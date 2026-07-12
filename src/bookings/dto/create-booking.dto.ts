import { IsEmail, IsNotEmpty, IsString, IsOptional, IsUUID, IsDateString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDto {
    @ApiProperty({ example: 'f28f99ce-673e-4ff4-b0eb-9b5299358f15', description: 'The UUID of the service to book' })
    @IsUUID('4', { message: 'Invalid Service ID format' })
    @IsNotEmpty({ message: 'Service ID is required' })
    serviceId: string;

    @ApiProperty({ example: 'John Doe', description: 'The full name of the customer' })
    @IsString()
    @IsNotEmpty({ message: 'Customer name is required' })
    customerName: string;

    @ApiProperty({ example: 'john.doe@example.com', description: 'The email address of the customer' })
    @IsEmail({}, { message: 'Please provide a valid email address' })
    @IsNotEmpty({ message: 'Customer email is required' })
    customerEmail: string;

    @ApiProperty({ example: '+15550199', description: 'The phone number of the customer' })
    @IsString()
    @IsNotEmpty({ message: 'Customer phone number is required' })
    customerPhone: string;

    @ApiProperty({ example: '2026-10-15', description: 'The date of the booking in YYYY-MM-DD format (must not be in the past)' })
    @IsDateString({}, { message: 'Booking date must be a valid date string (YYYY-MM-DD)' })
    @IsNotEmpty({ message: 'Booking date is required' })
    bookingDate: string;

    @ApiProperty({ example: '14:30', description: 'The time of the booking in 24-hour HH:MM or HH:MM:SS format' })
    @IsString()
    @IsNotEmpty({ message: 'Booking time is required' })
    @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/, {
        message: 'Booking time must be in HH:MM or HH:MM:SS format',
    })
    bookingTime: string;

    @ApiProperty({ example: 'Please prepare the standard consultation materials.', description: 'Optional comments or requests from customer', required: false })
    @IsString()
    @IsOptional()
    notes?: string;
}
