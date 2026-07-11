import { Controller, Post, Body, UseGuards, Req, Patch, Param, Delete, Get } from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('services')
export class ServicesController {
    constructor(private readonly servicesService: ServicesService) { }

    // Create Service
    // Route: POST /api/v1/services
    // Body: { "title": "", "description": "", "duration": "", "price": "" }
    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Body() createServiceDto: CreateServiceDto, @Req() req: any) {
        return this.servicesService.create(req.user.id, createServiceDto);
    }


    // Update Service
    // Route: PATCH /api/v1/services/:id
    // Body: { "title": "", "description": "", "duration": "", "price": "" }
    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateServiceDto: UpdateServiceDto,
        @Req() req: any,
    ) {
        return this.servicesService.update(id, updateServiceDto);
    }


    // Delete Service
    // Route: DELETE /api/v1/services/:id
    // Body: { "title": "", "description": "", "duration": "", "price": "" }
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async delete(
        @Param('id') id: string,
    ) {
        return this.servicesService.delete(id);
    }

    // Get All Services
    // Route: GET /api/v1/services
    // Body: None
    @UseGuards(JwtAuthGuard)
    @Get()
    async findAll() {
        return this.servicesService.findAll();
    }

    // Get Service by ID



    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async findById(@Param('id') id: string
    ) {
        return this.servicesService.findOne(id);
    }
}
