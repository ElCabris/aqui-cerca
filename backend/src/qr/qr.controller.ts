import { Controller, Get, Query, UseGuards, BadRequestException, Post, Body, Req } from '@nestjs/common';
import { QrService } from './qr.service';
import { UsersService } from 'src/users/users.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('qr')
export class QrController {
	constructor(
		private readonly qrService: QrService,
		private readonly usersService: UsersService,
	) { }

	@UseGuards(AuthGuard('jwt'))
	@Get()
	async getQr(@Query('email') email?: string) {
		if (!email) {
			throw new BadRequestException('El parámetro email es requerido');
		}

		const business = await this.usersService.findBusinessByUserEmail(email);
		const qrCodeData = business.qr_code_id as string;
		const qr = await this.qrService.generateQr(qrCodeData);
		return { qr, qr_code_id: qrCodeData };
	}

	@UseGuards(AuthGuard('jwt'))
	@Post('award')
	async awardPoints(
		@Body('qr_code_id') qrCodeId: string,
		@Body('points') points: number,
		@Req() req: any,
	) {
		if (!qrCodeId || typeof qrCodeId !== 'string') {
			throw new BadRequestException('qr_code_id es requerido');
		}
		if (!Number.isFinite(points) || points <= 0) {
			throw new BadRequestException('points debe ser un número positivo');
		}

		// Verificar que el QR exista (local válido)
		await this.usersService.findLocalByQrCodeId(qrCodeId);

		// Sumar puntos al usuario autenticado
		const email = req.user?.username || req.user?.sub;
		if (!email) {
			throw new BadRequestException('No se pudo determinar el email del usuario');
		}

		const updatedUser = await this.usersService.addPointsByEmail(email, points);
		return { success: true, points: updatedUser.points };
	}
}
