import { IsString, IsInt, Min, IsNumber, IsOptional, IsPositive, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateServiceDto {
    @ApiProperty({ example: 'Massage Therapy', description: 'The title of the service', required: false })
    @IsString()
    @IsOptional()
    title?: string;

    @ApiProperty({ example: 'Full body relaxing massage with aromatherapy oils', description: 'Description of the service details', required: false })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ example: 60, description: 'Duration of the service in minutes (minimum 1)', required: false })
    @IsInt()
    @Min(1, { message: 'Duration must be at least 1 minute' })
    @IsOptional()
    duration?: number;

    @ApiProperty({ example: 85.50, description: 'Price of the service in standard currency', required: false })
    @IsNumber()
    @IsPositive({ message: 'Price must be a positive number' })
    @IsOptional()
    price?: number;

    @ApiProperty({ example: true, description: 'Flag indicating if the service is active and bookable', required: false })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}
