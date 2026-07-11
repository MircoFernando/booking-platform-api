import { IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class LogoutDto {
    @IsString()
    @IsOptional()
    refreshToken?: string;
}
