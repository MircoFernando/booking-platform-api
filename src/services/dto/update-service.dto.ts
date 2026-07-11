import { IsString, IsInt, Min, IsNumber, IsOptional, IsPositive, IsBoolean } from 'class-validator';

export class UpdateServiceDto {
    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsInt()
    @Min(1, { message: 'Duration must be at least 1 minute' })
    @IsOptional()
    duration?: number;

    @IsNumber()
    @IsPositive({ message: 'Price must be a positive number' })
    @IsOptional()
    price?: number;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}
