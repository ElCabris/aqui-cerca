import { Injectable, Inject, ConflictException, BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import type { ConfigType } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import supabaseConfig from 'src/config/supabase.config/supabase.config';
import { CreateUserDto } from './dto/create-user.dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto/update-user.dto';
import { User } from './entities/user.entity/user.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class UsersService {
	private supabase: SupabaseClient;
	private readonly saltRounds: number;

	constructor(
		@Inject(supabaseConfig.KEY)
		private config: ConfigType<typeof supabaseConfig>,
	) {
		if (!config.url || !config.key) {
			throw new Error('Supabase URL and Key must be provided');
		}
		this.supabase = createClient(config.url, config.key);
		this.saltRounds = config.bcryptSaltRounds;
	}

	async create(createUserDto: CreateUserDto): Promise<{ id: number }> {
		const { name, email, password } = createUserDto;

		try {
			const password_hash = await bcrypt.hash(password, this.saltRounds);

			const { data, error } = await this.supabase
				.rpc('insert_user', {
					p_name: name,
					p_email: email,
					p_password_hash: password_hash
				});

			if (error) {
				if (error.code === '23505') {
					throw new ConflictException('The email is already registered');
				}
				throw new BadRequestException(`Error creating user: ${error.message}`);
			}

			// Crear local asociado al usuario recién creado
			const qrCodeId = randomUUID();
			const { error: localError } = await this.supabase
				.from('locals')
				.insert({
					name: '',
					physical_address: '',
					latitude: 0,
					longitude: 0,
					qr_code_id: qrCodeId,
					// Campo de asociación propuesto en el esquema
					owner_email: email,
					// Campos opcionales quedan en null por defecto (p.ej., description)
				});

			if (localError) {
				throw new InternalServerErrorException(`Error creando negocio asociado: ${localError.message}`);
			}

			return { id: data };
		} catch (error) {
			if (error instanceof ConflictException || error instanceof BadRequestException) {
				throw error;
			}
			throw new InternalServerErrorException('Error interno del servidor al crear usuario');
		}
	}

	async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
		const { data, error } = await this.supabase
			.from('users')
			.update(updateUserDto)
			.eq('id', id)
			.select()
			.single();

		if (error) {
			throw new Error(`Error updating user: ${error.message}`);
		}

		return data as User;
	}

	async remove(id: number): Promise<void> {
		const { error } = await this.supabase.from('users').delete().eq('id', id);

		if (error) {
			throw new Error(`Error deleting user: ${error.message}`);
		}
	}

	async updatePoints(userEmail: string, points: number): Promise<User> {
		const { data, error } = await this.supabase
			.from('users')
			.update({ points })
			.eq('email', userEmail)
			.select()
			.single();

		if (error) {
			throw new Error(`Error updating points: ${error.message}`);
		}

		return data as User;
	}

	async findByEmail(email: string): Promise<User> {
		const { data, error } = await this.supabase.from('users').select('*').eq('email', email).single();

		if (error) {
			throw new NotFoundException(`User with email: ${email} not found`);
		}

		return data;
	}

	async findBusinessByUserEmail(email: string): Promise<any> {
		const { data, error } = await this.supabase
			.from('locals')
			.select('*')
			.eq('owner_email', email)
			.single();

		if (error) {
			throw new NotFoundException(`Business for user email: ${email} not found`);
		}

		return data;
	}

	async findLocalByQrCodeId(qrCodeId: string): Promise<any> {
		const { data, error } = await this.supabase
			.from('locals')
			.select('*')
			.eq('qr_code_id', qrCodeId)
			.single();

		if (error) {
			throw new NotFoundException(`Local con qr_code_id ${qrCodeId} no encontrado`);
		}

		return data;
	}

	async addPointsByEmail(email: string, delta: number): Promise<User> {
		const user = await this.findByEmail(email);
		const newPoints = (user.points || 0) + delta;

		const { data, error } = await this.supabase
			.from('users')
			.update({ points: newPoints })
			.eq('email', email)
			.select('*')
			.single();

		if (error) {
			throw new InternalServerErrorException(`Error sumando puntos: ${error.message}`);
		}

		return data as User;
	}

	// ----- Categorías (etiquetas) por local -----
	private async ensureCategory(name: string): Promise<{ id: number }> {
		const normalized = name.trim().toLowerCase();
		if (!normalized) {
			throw new BadRequestException('El nombre de la etiqueta es requerido');
		}
		const { data, error } = await this.supabase
			.from('categories')
			.upsert({ name: normalized }, { onConflict: 'name' })
			.select('id')
			.single();
		if (error) {
			throw new InternalServerErrorException(`Error asegurando categoría: ${error.message}`);
		}
		return { id: data.id };
	}

	async getTagsByUserEmail(email: string): Promise<string[]> {
		const local = await this.findBusinessByUserEmail(email);
		const localId = local.id as number;

		const { data: rels, error: relErr } = await this.supabase
			.from('categories_locals')
			.select('category_id')
			.eq('local_id', localId);
		if (relErr) {
			throw new InternalServerErrorException(`Error obteniendo relaciones: ${relErr.message}`);
		}
		const ids = (rels || []).map(r => r.category_id);
		if (ids.length === 0) return [];
		const { data: cats, error: catErr } = await this.supabase
			.from('categories')
			.select('name,id')
			.in('id', ids);
		if (catErr) {
			throw new InternalServerErrorException(`Error obteniendo categorías: ${catErr.message}`);
		}
		return (cats || []).map(c => c.name as string);
	}

	async addTagByUserEmail(email: string, tagName: string): Promise<string[]> {
		const local = await this.findBusinessByUserEmail(email);
		const localId = local.id as number;
		const { id: categoryId } = await this.ensureCategory(tagName);

		const { error } = await this.supabase
			.from('categories_locals')
			.upsert({ local_id: localId, category_id: categoryId }, { onConflict: 'local_id,category_id' });
		if (error) {
			throw new InternalServerErrorException(`Error agregando etiqueta: ${error.message}`);
		}
		return await this.getTagsByUserEmail(email);
	}

	async removeTagByUserEmail(email: string, tagName: string): Promise<string[]> {
		const local = await this.findBusinessByUserEmail(email);
		const localId = local.id as number;
		const normalized = tagName.trim().toLowerCase();
		const { data: cat, error: catErr } = await this.supabase
			.from('categories')
			.select('id')
			.eq('name', normalized)
			.single();
		if (catErr) {
			// Si no existe, simplemente retorna el estado actual
			return await this.getTagsByUserEmail(email);
		}
		const { error: delErr } = await this.supabase
			.from('categories_locals')
			.delete()
			.eq('local_id', localId)
			.eq('category_id', cat.id);
		if (delErr) {
			throw new InternalServerErrorException(`Error eliminando etiqueta: ${delErr.message}`);
		}
		return await this.getTagsByUserEmail(email);
	}

	async updateBusinessNameByUserEmail(email: string, name: string): Promise<any> {
		const local = await this.findBusinessByUserEmail(email);
		const localId = local.id as number;
		if (!name || !name.trim()) {
			throw new BadRequestException('El nombre es requerido');
		}
		const { data, error } = await this.supabase
			.from('locals')
			.update({ name: name.trim() })
			.eq('id', localId)
			.select('*')
			.single();
		if (error) {
			throw new InternalServerErrorException(`Error actualizando nombre del negocio: ${error.message}`);
		}
		return data;
	}

	async searchLocalsByTags(tagNames: string[]): Promise<Array<{ id: number; name: string; description: string | null }>> {
		const normalized = (tagNames || []).map(t => t.trim().toLowerCase()).filter(Boolean);
		if (normalized.length === 0) {
			// Si no hay etiquetas, devolver todos los locales por nombre/descr
			const { data, error } = await this.supabase
				.from('locals')
				.select('id,name,description');
			if (error) throw new InternalServerErrorException(`Error listando locales: ${error.message}`);
			return (data || []) as any;
		}

		// Obtener IDs de categorías por nombre
		const { data: cats, error: catErr } = await this.supabase
			.from('categories')
			.select('id,name')
			.in('name', normalized);
		if (catErr) throw new InternalServerErrorException(`Error consultando categorías: ${catErr.message}`);
		const ids = (cats || []).map(c => c.id);
		if (ids.length === 0) return [];

		// Relaciones local-categoría que coincidan con cualquiera de las etiquetas
		const { data: rels, error: relErr } = await this.supabase
			.from('categories_locals')
			.select('local_id,category_id')
			.in('category_id', ids);
		if (relErr) throw new InternalServerErrorException(`Error consultando relaciones: ${relErr.message}`);
		const localIds = Array.from(new Set((rels || []).map(r => r.local_id)));
		if (localIds.length === 0) return [];

		// Traer locales
		const { data: locals, error: locErr } = await this.supabase
			.from('locals')
			.select('id,name,description')
			.in('id', localIds);
		if (locErr) throw new InternalServerErrorException(`Error consultando locales: ${locErr.message}`);
		return (locals || []) as any;
	}
}

