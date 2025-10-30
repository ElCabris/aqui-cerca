import { Injectable } from '@nestjs/common';
import * as QRCode from 'qrcode';

@Injectable()
export class QrService {
	async generateQr(data: string): Promise<string> {
		return await QRCode.toDataURL(data);
	}

	async generateQrSvg(data: string): Promise<string> {
		return await QRCode.toString(data, { type: 'svg' });
	}
}

