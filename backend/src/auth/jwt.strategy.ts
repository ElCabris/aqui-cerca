import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

export interface JwtPayload {
	username: string;
	sub: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly usersService: UsersService,) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: process.env.JWT_SECRET_KEY ? process.env.JWT_SECRET_KEY : '',
		});
	}

	// Este método se ejecuta si el token es válido
	async validate(payload: JwtPayload) {
		const user = await this.usersService.findByEmail(payload.sub);

		if (!user) {
			throw new UnauthorizedException('Token inválido o usuario no encontrado');
		}

		return { userId: payload.sub, username: payload.username };
	}
}
