import { IsEmail, IsNotEmpty, IsString, IsOptional, IsUUID, IsDateString, Matches } from 'class-validator';

export class CreateBookingDto {
    @IsUUID('4', { message: 'Invalid Service ID format' })
    @IsNotEmpty({ message: 'Service ID is required' })
    serviceId: string;

    @IsString()
    @IsNotEmpty({ message: 'Customer name is required' })
    customerName: string;

    @IsEmail({}, { message: 'Please provide a valid email address' })
    @IsNotEmpty({ message: 'Customer email is required' })
    customerEmail: string;

    @IsString()
    @IsNotEmpty({ message: 'Customer phone number is required' })
    customerPhone: string;

    @IsDateString({}, { message: 'Booking date must be a valid date string (YYYY-MM-DD)' })
    @IsNotEmpty({ message: 'Booking date is required' })
    bookingDate: string;

    @IsString()
    @IsNotEmpty({ message: 'Booking time is required' })
    @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/, {
        message: 'Booking time must be in HH:MM or HH:MM:SS format',
    })
    bookingTime: string;

    @IsString()
    @IsOptional()
    notes?: string;
}
