import { Controller, Post, Body, Get, Patch, Param, UseGuards, Query, Req } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto, UpdateBookingStatusDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('bookings')
export class BookingsController {
    constructor(private readonly bookingsService: BookingsService) { }

    // Create Booking
    // Route: POST /api/v1/bookings
    // Body: { "serviceId": "", "customerName": "", "customerEmail": "", "customerPhone": "", "bookingDate": "YYYY-MM-DD", "bookingTime": "HH:MM", "notes": "" }
    @Post()
    async create(@Body() createBookingDto: CreateBookingDto) {
        return this.bookingsService.create(createBookingDto);
    }

    // Get All Bookings
    // Route: GET /api/v1/bookings?search=...&status=...&limit=...&cursor=...
    // Body: None
    @UseGuards(JwtAuthGuard)
    @Get()
    async findAll(
        @Query('search') search?: string,
        @Query('status') status?: string,
        @Query('limit') limit?: number,
        @Query('cursor') cursor?: string,
    ) {
        return this.bookingsService.getAllBookings(search, status, limit ? Number(limit) : undefined, cursor);
    }

    // Get Booking by ID
    // Route: GET /api/v1/bookings/:id
    // Body: None
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.bookingsService.findOne(id);
    }

    // Update Booking Status
    // Route: PATCH /api/v1/bookings/:id/status
    // Body: { "status": "PENDING | CONFIRMED | CANCELLED | COMPLETED" }
    @UseGuards(JwtAuthGuard)
    @Patch(':id/status')
    async updateStatus(
        @Param('id') id: string,
        @Body() updateBookingStatusDto: UpdateBookingStatusDto,
        @Req() req: any,
    ) {
        return this.bookingsService.updateStatus(id, updateBookingStatusDto);
    }

    // Cancel Booking
    // Route: PATCH /api/v1/bookings/:id/cancel
    // Body: None
    @UseGuards(JwtAuthGuard)
    @Patch(':id/cancel')
    async cancel(@Param('id') id: string) {
        return this.bookingsService.cancel(id);
    }
}
