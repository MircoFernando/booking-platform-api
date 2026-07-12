import { Controller, Post, Body, UseGuards, Req, Patch, Param, Delete, Get } from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto, UpdateServiceDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Services')
@ApiBearerAuth()
@Controller('services')
export class ServicesController {
    constructor(private readonly servicesService: ServicesService) { }

    // Create Service
    // Route: POST /api/v1/services
    // Body: { "title": "", "description": "", "duration": "", "price": "" }
    @UseGuards(JwtAuthGuard)
    @Post()
    @ApiOperation({ summary: 'Create a new service' })
    @ApiResponse({ status: 201, description: 'Service created successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized access' })
    async create(@Body() createServiceDto: CreateServiceDto, @Req() req: any) {
        return this.servicesService.create(req.user.id, createServiceDto);
    }

    // Update Service
    // Route: PATCH /api/v1/services/:id
    // Body: { "title": "", "description": "", "duration": "", "price": "" }
    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    @ApiOperation({ summary: 'Update an existing service details' })
    @ApiResponse({ status: 200, description: 'Service updated successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized access' })
    @ApiResponse({ status: 404, description: 'Service with the specified ID not found' })
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
    @ApiOperation({ summary: 'Delete a service by ID' })
    @ApiResponse({ status: 200, description: 'Service deleted successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized access' })
    @ApiResponse({ status: 404, description: 'Service not found' })
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
    @ApiOperation({ summary: 'Retrieve all services' })
    @ApiResponse({ status: 200, description: 'List of all services' })
    @ApiResponse({ status: 401, description: 'Unauthorized access' })
    async findAll() {
        return this.servicesService.findAll();
    }

    // Get Service by ID
    // Route: GET /api/v1/services/:id
    // Body: None
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    @ApiOperation({ summary: 'Retrieve a service by ID' })
    @ApiResponse({ status: 200, description: 'Service details' })
    @ApiResponse({ status: 401, description: 'Unauthorized access' })
    @ApiResponse({ status: 404, description: 'Service not found' })
    async findById(@Param('id') id: string) {
        return this.servicesService.findOne(id);
    }
}
