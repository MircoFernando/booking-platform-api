import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) { }

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

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findRawById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

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
  async updateRefreshToken(id: string, refreshTokenHash: string | null) {
    return this.prisma.user.update({
      where: { id },
      data: { refreshTokenHash },
    });
  }
}
