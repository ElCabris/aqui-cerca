import { Module } from '@nestjs/common';
import { QrController } from './qr.controller';
import { QrService } from './qr.service';
import { UsersModule } from 'src/users/users.module';

@Module({
    imports: [UsersModule],
    controllers: [QrController],
    providers: [QrService],
    exports: [QrService], // por si lo usas en otros módulos
})
export class QrModule { }
