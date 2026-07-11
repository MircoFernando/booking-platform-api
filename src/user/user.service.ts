import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

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
}
