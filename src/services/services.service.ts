import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

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

    async update(id: string, updateServiceDto: UpdateServiceDto) {
        const service = await this.prisma.service.findUnique({
            where: { id },
        });

        if (!service) {
            throw new NotFoundException(`Service with ID ${id} not found`);
        }

        return this.prisma.service.update({
            where: { id },
            data: updateServiceDto,
        });
    }

    async delete(id: string) {
        const service = await this.prisma.service.findUnique({
            where: { id },
        });

        if (!service) {
            throw new NotFoundException(`Service with ID ${id} not found`);
        }

        return this.prisma.service.delete({
            where: { id },
        });
    }

    async findAll() {
        return this.prisma.service.findMany();
    }

    async findOne(id: string) {
        const service = await this.prisma.service.findUnique({
            where: { id }
        });

        if (!service) {
            throw new NotFoundException(`Service with ID ${id} not found`);
        }

        return service
    }
}
