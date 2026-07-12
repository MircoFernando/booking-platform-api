import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum BookingStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    CANCELLED = 'CANCELLED',
    COMPLETED = 'COMPLETED',
}

export class UpdateBookingStatusDto {
    @ApiProperty({ enum: BookingStatus, example: 'CONFIRMED', description: 'The new status of the booking' })
    @IsEnum(BookingStatus, { message: 'Invalid booking status' })
    @IsNotEmpty({ message: 'Status is required' })
    status: BookingStatus;
}
