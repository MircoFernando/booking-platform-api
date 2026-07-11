import { IsNotEmpty, IsString, IsInt, Min, IsNumber, IsOptional, IsPositive } from 'class-validator';

export class CreateServiceDto {
    @IsString()
    @IsNotEmpty({ message: 'Title is required' })
    title: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsInt()
    @Min(1, { message: 'Duration must be at least 1 minute' })
    duration: number;

    @IsNumber()
    @IsPositive({ message: 'Price must be a positive number' })
    price: number;
}
