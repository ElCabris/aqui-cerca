import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, HttpStatus, NotFoundException, UseGuards, BadRequestException, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto/update-user.dto';
import { User } from './entities/user.entity/user.entity';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('users')
@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) { }

	@Post()
	@ApiOperation({ summary: 'Crear un nuevo usuario' })
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'User created successfully'
	})
	@ApiResponse({
		status: HttpStatus.BAD_REQUEST,
		description: 'Invalid input data'
	})
	@ApiResponse({
		status: HttpStatus.CONFLICT,
		description: 'The email already exists'
	})
	@ApiBody({ type: CreateUserDto })
	async create(@Body() createUserDto: CreateUserDto) {
		await this.usersService.create(createUserDto);
		return { message: 'User created successfully' };
	}

	@Patch(':id')
	@ApiOperation({ summary: 'Actualizar usuario' })
	@ApiParam({ name: 'id', description: 'ID del usuario a actualizar', type: Number })
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'User updated successfully',
		type: User
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Usuario no encontrado'
	})
	@ApiBody({ type: UpdateUserDto })
	@UseGuards(AuthGuard('jwt'))
	update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
		return this.usersService.update(id, updateUserDto);
	}

	@Delete(':id')
	@ApiOperation({ summary: 'Eliminar usuario' })
	@ApiParam({ name: 'id', description: 'ID del usuario a eliminar', type: Number })
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Usuario eliminado exitosamente'
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Usuario no encontrado'
	})
	@UseGuards(AuthGuard('jwt'))
	remove(@Param('id', ParseIntPipe) id: number) {
		return this.usersService.remove(id);
	}

	@Patch(':email/points') // 1. Cambia el parámetro de la ruta a 'email'
	@ApiOperation({ summary: 'Actualizar puntos de un usuario' })
	@ApiParam({
		name: 'email',
		description: 'Correo electrónico del usuario',
		type: String // 2. Actualiza el tipo a String
	})
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Puntos actualizados exitosamente',
		type: User
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Usuario no encontrado'
	})
	@UseGuards(AuthGuard('jwt'))
	updatePoints(
		// 3. Cambia el decorador a @Param('email') y el tipo a string
		@Param('email') userEmail: string,
		@Body('points', ParseIntPipe) points: number,
	) {
		// 4. Llama al servicio con el correo electrónico
		return this.usersService.updatePoints(userEmail, points);
	}

	@UseGuards(AuthGuard('jwt'))
	@ApiOperation({ summary: 'Buscar un usuario por email' })
	@Get('email/:email')
	async findByEmail(@Param('email') email: string) {
		try {
			const user = await this.usersService.findByEmail(email);
			return user;
		} catch (error) {
			throw new NotFoundException(`Usuario con email ${email} no encontrado.`);
		}
	}

	@UseGuards(AuthGuard('jwt'))
	@ApiOperation({ summary: 'Obtener negocio del usuario por email' })
	@Get('email/:email/business')
	async findBusinessByEmail(@Param('email') email: string) {
		try {
			const business = await this.usersService.findBusinessByUserEmail(email);
			return business;
		} catch (error) {
			throw new NotFoundException(`Negocio del usuario con email ${email} no encontrado.`);
		}
	}

	@UseGuards(AuthGuard('jwt'))
	@ApiOperation({ summary: 'Actualizar nombre del negocio por email' })
	@Patch('email/:email/business/name')
	async updateBusinessName(
		@Param('email') email: string,
		@Body('name') name: string,
	) {
		if (!name) throw new BadRequestException('name es requerido');
		const updated = await this.usersService.updateBusinessNameByUserEmail(email, name);
		return updated;
	}

	@UseGuards(AuthGuard('jwt'))
	@ApiOperation({ summary: 'Listar etiquetas del negocio del usuario por email' })
	@Get('email/:email/tags')
	async getTags(@Param('email') email: string) {
		return { tags: await this.usersService.getTagsByUserEmail(email) };
	}

	@UseGuards(AuthGuard('jwt'))
	@ApiOperation({ summary: 'Agregar etiqueta al negocio del usuario por email' })
	@Post('email/:email/tags')
	async addTag(@Param('email') email: string, @Body('name') name: string) {
		if (!name) throw new BadRequestException('name es requerido');
		return { tags: await this.usersService.addTagByUserEmail(email, name) };
	}

	@UseGuards(AuthGuard('jwt'))
	@ApiOperation({ summary: 'Eliminar etiqueta del negocio del usuario por email' })
	@Delete('email/:email/tags/:name')
	async removeTag(@Param('email') email: string, @Param('name') name: string) {
		return { tags: await this.usersService.removeTagByUserEmail(email, name) };
	}

	@UseGuards(AuthGuard('jwt'))
	@ApiOperation({ summary: 'Buscar locales por etiquetas (cualquiera)' })
	@Get('locals/search')
	async searchLocals(@Query('tags') tags?: string) {
		const list = await this.usersService.searchLocalsByTags(tags ? tags.split(',') : []);
		return { locals: list };
	}
}
