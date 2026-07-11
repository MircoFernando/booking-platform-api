import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingsService {
    constructor(private readonly prisma: PrismaService) { }

    async create(createBookingDto: CreateBookingDto) {
        const { serviceId, bookingDate, bookingTime, ...rest } = createBookingDto;

        // Verify that the service exists and is active
        const service = await this.prisma.service.findUnique({
            where: { id: serviceId },
        });

        if (!service) {
            throw new NotFoundException(`Service with ID ${serviceId} not found, Booking cannot be made.`);
        }

        if (!service.isActive) {
            throw new BadRequestException('This service is inactive and cannot be booked');
        }

        // Parse bookingDate and bookingTime into JavaScript Date objects
        const parsedDate = new Date(`${bookingDate}T00:00:00Z`);

        // Enforce that the booking date cannot be in the past
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0); // Midnight UTC of today
        if (parsedDate < today) {
            throw new BadRequestException('Booking date cannot be in the past');
        }

        const timeStr = bookingTime.length === 5 ? `${bookingTime}:00` : bookingTime;
        const parsedTime = new Date(`1970-01-01T${timeStr}Z`); // Unix Epoch Time 

        // Create the booking
        return this.prisma.booking.create({
            data: {
                ...rest,
                serviceId,
                bookingDate: parsedDate,
                bookingTime: parsedTime,
                status: 'PENDING', // Default state for a new booking
            },
            include: {
                service: true, // Include the associated service in the returned payload
            },
        });
    }
}
