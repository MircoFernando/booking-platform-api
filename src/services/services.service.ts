import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';

@Injectable()
export class ServicesService {
    constructor(private readonly prisma: PrismaService) { }

    async create(createdById: string, createServiceDto: CreateServiceDto) {
        return this.prisma.service.create({
            data: {
                ...createServiceDto,
                createdById,
            },
        });
    }
}
