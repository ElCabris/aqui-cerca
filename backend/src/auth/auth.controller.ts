import { Controller, Post, Body, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) { }

	@Post('login')
	@ApiOperation({ summary: 'Iniciar sesión' })
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'successful login',
		schema: {
			example: {
				message: 'successful login',
				success: true
			}
		}
	})
	@ApiResponse({
		status: HttpStatus.UNAUTHORIZED,
		description: 'invalid credentials'
	})
	@ApiBody({ type: LoginDto })
	async login(@Body() loginDto: LoginDto) {
		return this.authService.login(loginDto);
	}
}
