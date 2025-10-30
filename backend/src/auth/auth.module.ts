import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtStrategy } from './jwt.strategy';

@Module({
	imports: [
		UsersModule,
		PassportModule,
		JwtModule.register({
			secret: process.env.JWT_SECRET_KEY,
			signOptions: { expiresIn: '60m' },
		})
	],
	providers: [
		AuthService,
		JwtStrategy,
	],
	controllers: [AuthController],
	exports: [AuthService, JwtModule],
})
export class AuthModule { }
