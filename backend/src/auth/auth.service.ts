import { Injectable, UnauthorizedException, Inject, Logger } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import * as bcrypt from 'bcrypt';
import type { ConfigType } from '@nestjs/config';
import supabaseConfig from 'src/config/supabase.config/supabase.config';
import { LoginDto } from './dto/login.dto/login.dto';

@Injectable()
export class AuthService {
	private supabase: SupabaseClient;

	constructor(
		@Inject(supabaseConfig.KEY)
		private config: ConfigType<typeof supabaseConfig>,
	) {
		this.supabase = createClient(config.url, config.key);
	}

	async validateUser(loginDto: LoginDto): Promise<boolean> {
		const { email, password } = loginDto;

		try {
			const { data: storedHash, error } = await this.supabase
				.rpc('get_password_hash', { p_email: email });

			if (error || !storedHash) {
				return false;
			}

			const isValid = await bcrypt.compare(password, storedHash);
			return isValid;

		} catch (error) {
			return false;
		}
	}

	async login(loginDto: LoginDto) {
		const isValid = await this.validateUser(loginDto);

		if (!isValid) {
			throw new UnauthorizedException('Credenciales inválidas');
		}

		return {
			message: 'successful login',
			success: true
		};
	}
}
