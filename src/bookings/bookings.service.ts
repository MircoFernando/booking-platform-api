import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingsService {
    constructor(private readonly prisma: PrismaService) { }

    async create(createBookingDto: CreateBookingDto) {
        const { serviceId, bookingDate, bookingTime, ...rest } = createBookingDto;

        // 1. Verify that the service exists and is active
        const service = await this.prisma.service.findUnique({
            where: { id: serviceId },
        });

        if (!service) {
            throw new NotFoundException(`Service with ID ${serviceId} not found`);
        }

        if (!service.isActive) {
            throw new BadRequestException('This service is inactive and cannot be booked');
        }

        // 2. Parse bookingDate and bookingTime into JavaScript Date objects
        const parsedDate = new Date(`${bookingDate}T00:00:00Z`);
        
        const timeStr = bookingTime.length === 5 ? `${bookingTime}:00` : bookingTime;
        const parsedTime = new Date(`1970-01-01T${timeStr}Z`);

        // 3. Create the booking
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
