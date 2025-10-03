import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, HttpStatus, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto/update-user.dto';
import { User } from './entities/user.entity/user.entity';

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
	remove(@Param('id', ParseIntPipe) id: number) {
		return this.usersService.remove(id);
	}

	@Patch(':id/points')
	@ApiOperation({ summary: 'Actualizar puntos de un usuario' })
	@ApiParam({ name: 'id', description: 'ID del usuario', type: Number })
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Puntos actualizados exitosamente',
		type: User
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Usuario no encontrado'
	})
	updatePoints(
		@Param('id', ParseIntPipe) id: number,
		@Body('points', ParseIntPipe) points: number,
	) {
		return this.usersService.updatePoints(id, points);
	}

	@Get('email/:email')
	async findByEmail(@Param('email') email: string) {
		try {
			const user = await this.usersService.findByEmail(email);
			return user;
		} catch (error) {
			throw new NotFoundException();
		}
	}
}
