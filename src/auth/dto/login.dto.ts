import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty({ example: 'merchant@example.com', description: 'The email address of the merchant' })
    @IsEmail({}, { message: 'Please provide a valid email address' })
    email: string;

    @ApiProperty({ example: 'Password123!', description: 'The password of the merchant' })
    @IsString()
    @IsNotEmpty({ message: 'Password is required' })
    password: string;
}