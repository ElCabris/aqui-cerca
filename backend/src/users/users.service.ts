import { Injectable, Inject, ConflictException, BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import type { ConfigType } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import supabaseConfig from 'src/config/supabase.config/supabase.config';
import { CreateUserDto } from './dto/create-user.dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto/update-user.dto';
import { User } from './entities/user.entity/user.entity';

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

	async updatePoints(userId: number, points: number): Promise<User> {
		const { data, error } = await this.supabase
			.from('users')
			.update({ points })
			.eq('id', userId)
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
}

