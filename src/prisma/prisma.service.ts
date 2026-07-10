import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';

// instantiating PrismaClient and connecting to the database
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    private readonly logger = new Logger(PrismaService.name);

    constructor() {
        const adapter = new PrismaPg({
            connectionString: process.env.DATABASE_URL,
        });
        super({ adapter });
    }

    // connects to the database
    async onModuleInit() {
        await this.$connect();
        this.logger.log('Successfully connected to the PostgreSQL database.');
    }
} 