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
}

