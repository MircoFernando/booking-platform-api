import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto, UpdateServiceDto } from './dto';

@Injectable()
export class ServicesService {
    constructor(private readonly prisma: PrismaService) { }

    // Create a new service associated with the creator user
    async create(createdById: string, createServiceDto: CreateServiceDto) {
        return this.prisma.service.create({
            data: {
                ...createServiceDto,
                createdById,
            },
        });
    }

    // Update details of an existing service record
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

    // Delete a service record from the database by ID
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

    // Retrieve all service records
    async findAll() {
        return this.prisma.service.findMany();
    }

    // Retrieve a single service by its ID
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
