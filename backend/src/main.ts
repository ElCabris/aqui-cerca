import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.enableCors({
		origin: true,
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
		allowedHeaders: 'Content-Type, Authorization, X-Requested-With, Accept',
		credentials: true,
		preflightContinue: false,
		optionsSuccessStatus: 204
	});

	app.useGlobalPipes(new ValidationPipe());

	// Configuración de Swagger
	const config = new DocumentBuilder()
		.setTitle('API de Gestión de Usuarios')
		.setDescription('API para la gestión de usuarios del sistema con Supabase')
		.setVersion('1.0')
		.addTag('users')
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api', app, document);

	await app.listen(3000);
}
bootstrap();
