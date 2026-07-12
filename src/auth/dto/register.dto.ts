import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
    @ApiProperty({ example: 'merchant@example.com', description: 'The email address of the merchant' })
    @IsEmail({}, { message: 'Please provide a valid email address' })
    email: string;

    @ApiProperty({ example: 'Password123!', description: 'The password of the merchant (min 6 chars)' })
    @IsString()
    @IsNotEmpty({ message: 'Password is required' })
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password: string;

    @ApiProperty({ example: 'Spa Salon', description: 'The name of the merchant/user' })
    @IsString()
    @IsNotEmpty({ message: 'Name is required' })
    name: string;
}
