import { ApiProperty } from "@nestjs/swagger";

export class User {
	@ApiProperty({ example: 1, description: 'Unique user ID' })
	id: number;

	@ApiProperty({ example: 'Juan Perez', description: "User's full name" })
	name: string;

	@ApiProperty({ example: 'juan.perez@example.com', description: "User's unique ID" })
	email: string;

	@ApiProperty({ example: '2023-1-1T00:00:00.000Z', description: "User's date creation" })
	creation_date: Date;

	@ApiProperty({ example: 100, description: 'Loyalty points accumulated', default: 0 })
	points: number;
}
