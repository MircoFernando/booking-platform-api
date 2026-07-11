import { Controller, Post, Body, Get, Patch, Param, UseGuards, Query, Req } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto, UpdateBookingStatusDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('bookings')
export class BookingsController {
    constructor(private readonly bookingsService: BookingsService) { }

    @Post()
    async create(@Body() createBookingDto: CreateBookingDto) {
        return this.bookingsService.create(createBookingDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async findAll(
        @Query('search') search?: string,
        @Query('status') status?: string,
    ) {
        return this.bookingsService.getAllBookings(search, status);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.bookingsService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id/status')
    async updateStatus(
        @Param('id') id: string,
        @Body() updateBookingStatusDto: UpdateBookingStatusDto,
        @Req() req: any,
    ) {
        return this.bookingsService.updateStatus(id, updateBookingStatusDto);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id/cancel')
    async cancel(@Param('id') id: string) {
        return this.bookingsService.cancel(id);
    }
}
