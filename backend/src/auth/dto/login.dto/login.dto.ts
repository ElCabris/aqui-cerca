import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength } from "class-validator";

export class LoginDto {
	@ApiProperty({
		description: "User's email",
		example: 'user@example.com'
	})
	@IsEmail()
	email: string;

	@ApiProperty({
		description: "User's password",
		example: 'mypasswordxd',
		minLength: 6
	})
	@IsString()
	@MinLength(6)
	password: string;
}
