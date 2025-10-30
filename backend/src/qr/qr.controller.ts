import { Controller, Get, Query, UseGuards, BadRequestException } from '@nestjs/common';
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
		return { qr };
	}
}
