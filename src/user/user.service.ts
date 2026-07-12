import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) { }

  // Find user by ID (excludes password hash)
  async findOne(id: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      // Exclude passwordHash from response
      const { passwordHash, ...result } = user;
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Get all registered users (excludes password hashes)
  async findAll() {
    try {
      const users = await this.prisma.user.findMany();
      return users.map((user) => {
        const { passwordHash, ...result } = user;
        return result;
      });
    } catch (error) {
      throw error;
    }
  }

  // Find user by email including sensitive fields
  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  // Find raw user by ID including sensitive fields
  async findRawById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  // Register a new user in the database
  async create(createUserDto: CreateUserDto, passwordHash: string) {
    // Check if user already exists
    const existingUser = await this.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('Email address is already in use');
    }

    return this.prisma.user.create({
      data: {
        email: createUserDto.email,
        name: createUserDto.name,
        passwordHash,
      },
    });
  }

  // Refresh Token Implementation
  // Update the refresh token hash for a user
  async updateRefreshToken(id: string, refreshTokenHash: string | null) {
    return this.prisma.user.update({
      where: { id },
      data: { refreshTokenHash },
    });
  }
}
