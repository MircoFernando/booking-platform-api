import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('services')
export class ServicesController {
    constructor(private readonly servicesService: ServicesService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Body() createServiceDto: CreateServiceDto, @Req() req: any) {
        return this.servicesService.create(req.user.id, createServiceDto);
    }
}
