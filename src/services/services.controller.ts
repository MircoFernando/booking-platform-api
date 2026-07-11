import { Controller, Post, Body, UseGuards, Req, Patch, Param } from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('services')
export class ServicesController {
    constructor(private readonly servicesService: ServicesService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Body() createServiceDto: CreateServiceDto, @Req() req: any) {
        return this.servicesService.create(req.user.id, createServiceDto);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateServiceDto: UpdateServiceDto,
        @Req() req: any,
    ) {
        return this.servicesService.update(id, req.user.id, updateServiceDto);
    }
}
