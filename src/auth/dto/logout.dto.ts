import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LogoutDto {
    @ApiProperty({ example: 'eyJhbGciOi...', description: 'Optional refresh token to invalidate on logout', required: false })
    @IsString()
    @IsOptional()
    refreshToken?: string;
}
