import { Injectable, NotFoundException, BadRequestException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto, UpdateBookingStatusDto } from './dto';
import { Prisma } from '../generated/prisma/client';

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
        try {
            return await this.prisma.booking.create({
                data: {
                    ...rest,
                    serviceId,
                    bookingDate: parsedDate,
                    bookingTime: parsedTime,
                    status: 'PENDING', // Default state for a new booking
                },
                include: {
                    service: true, // Include the service in the returned payload
                },
            });
        } catch (error) {
            // Preventing duplicate bookings for the same service, date, and time using unique constraint on the database
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                // Prisma Error for unique constraint violation (P2002)
                if (error.code === 'P2002') {
                    throw new ConflictException('A booking already exists for this service at the selected date and time.');
                }
            }
            throw error;
        }
    }

    async getAllBookings(search?: string, status?: string) {
        const where: any = {};

        if (status) {
            where.status = status;
        }

        if (search) {
            where.OR = [
                { customerName: { contains: search, mode: 'insensitive' } },
                { customerEmail: { contains: search, mode: 'insensitive' } },
                { customerPhone: { contains: search, mode: 'insensitive' } },
            ];
        }

        return this.prisma.booking.findMany({
            where,
            include: {
                service: true,
            },
        });
    }

    async findOne(id: string) {
        const booking = await this.prisma.booking.findUnique({
            where: { id },
            include: {
                service: true,
            },
        });

        if (!booking) {
            throw new NotFoundException(`Booking with ID ${id} not found`);
        }

        return booking;
    }

    async updateStatus(id: string, updateBookingStatusDto: UpdateBookingStatusDto) {
        const booking = await this.findOne(id);
        const newStatus = updateBookingStatusDto.status;

        if (!booking) {
            throw new NotFoundException(`Booking with ID ${id} not found`);
        }

        // Constraint: Cancelled bookings cannot be marked as completed
        if (booking.status === 'CANCELLED' && newStatus === 'COMPLETED') {
            throw new BadRequestException('Cancelled bookings cannot be marked as completed');
        }

        return this.prisma.booking.update({
            where: { id },
            data: { status: newStatus as any },
            include: {
                service: true,
            },
        });
    }

    async cancel(id: string) {
        const booking = await this.findOne(id);

        if (!booking) {
            throw new NotFoundException(`Booking with ID ${id} not found`);
        }

        // Cancelled bookings 
        if (booking.status === 'CANCELLED') {
            throw new BadRequestException('Booking is already cancelled');
        }

        return this.prisma.booking.update({
            where: { id },
            data: { status: 'CANCELLED' },
            include: {
                service: true,
            },
        });
    }
}
