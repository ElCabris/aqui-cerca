import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class CreateUserDto {
	@ApiProperty({
		description: "User's fullname",
		example: 'Pepito Perez',
		minLength: 2
	})
	@IsString()
	@MinLength(2)
	name: string;

	@ApiProperty({
		description: "User's unique email",
		example: "juan.perez@example.com"
	})
	@IsEmail()
	email: string;

	@ApiProperty({
		description: 'User password',
		example: 'easypassword',
		minLength: 6
	})
	@IsString()
	@MinLength(6)
	password: string;
}
