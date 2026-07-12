import { Controller, Post, Body, Get, Patch, Param, UseGuards, Query, Req } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto, UpdateBookingStatusDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

@ApiTags('Bookings')
@Controller('bookings')
export class BookingsController {
    constructor(private readonly bookingsService: BookingsService) { }

    // Create Booking
    // Route: POST /api/v1/bookings
    // Body: { "serviceId": "", "customerName": "", "customerEmail": "", "customerPhone": "", "bookingDate": "YYYY-MM-DD", "bookingTime": "HH:MM", "notes": "" }
    @Post()
    @ApiOperation({ summary: 'Create a new booking (Public Endpoint)' })
    @ApiResponse({ status: 201, description: 'Booking created successfully' })
    @ApiResponse({ status: 400, description: 'Invalid date/time parameters' })
    @ApiResponse({ status: 409, description: 'Duplicate booking slot clash' })
    async create(@Body() createBookingDto: CreateBookingDto) {
        return this.bookingsService.create(createBookingDto);
    }

    // Get All Bookings
    // Route: GET /api/v1/bookings?search=...&status=...&limit=...&cursor=...
    // Body: None
    @UseGuards(JwtAuthGuard)
    @Get()
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Retrieve bookings with filtering and pagination' })
    @ApiQuery({ name: 'search', required: false, description: 'Search name, email, or phone' })
    @ApiQuery({ name: 'status', required: false, description: 'Filter by PENDING | CONFIRMED | CANCELLED | COMPLETED' })
    @ApiQuery({ name: 'limit', required: false, description: 'Number of items (max 100, default 10)' })
    @ApiQuery({ name: 'cursor', required: false, description: 'Booking ID cursor for pagination' })
    @ApiResponse({ status: 200, description: 'List of bookings with nextCursor pagination reference' })
    @ApiResponse({ status: 401, description: 'Unauthorized access' })
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
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Retrieve booking by ID' })
    @ApiResponse({ status: 200, description: 'Booking details' })
    @ApiResponse({ status: 401, description: 'Unauthorized access' })
    @ApiResponse({ status: 404, description: 'Booking not found' })
    async findOne(@Param('id') id: string) {
        return this.bookingsService.findOne(id);
    }

    // Update Booking Status
    // Route: PATCH /api/v1/bookings/:id/status
    // Body: { "status": "PENDING | CONFIRMED | CANCELLED | COMPLETED" }
    @UseGuards(JwtAuthGuard)
    @Patch(':id/status')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update status of a booking' })
    @ApiResponse({ status: 200, description: 'Status updated successfully' })
    @ApiResponse({ status: 400, description: 'Illegal state transition (e.g. completing cancelled booking)' })
    @ApiResponse({ status: 401, description: 'Unauthorized access' })
    @ApiResponse({ status: 404, description: 'Booking not found' })
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
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Cancel a booking' })
    @ApiResponse({ status: 200, description: 'Booking cancelled successfully' })
    @ApiResponse({ status: 400, description: 'Booking is already cancelled' })
    @ApiResponse({ status: 401, description: 'Unauthorized access' })
    @ApiResponse({ status: 404, description: 'Booking not found' })
    async cancel(@Param('id') id: string) {
        return this.bookingsService.cancel(id);
    }
}
