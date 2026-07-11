import { IsEnum, IsNotEmpty } from 'class-validator';

export enum BookingStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    CANCELLED = 'CANCELLED',
    COMPLETED = 'COMPLETED',
}

export class UpdateBookingStatusDto {
    @IsEnum(BookingStatus, { message: 'Invalid booking status' })
    @IsNotEmpty({ message: 'Status is required' })
    status: BookingStatus;
}
