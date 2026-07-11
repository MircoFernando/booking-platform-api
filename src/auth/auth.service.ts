import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { AppLogger } from '../common/logger/app-logger.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly logger: AppLogger,
    ) { }

    async register(createUserDto: CreateUserDto) {
        // Hash the password using Argon2
        const passwordHash = await argon2.hash(createUserDto.password);

        // Delegate the actual database insertion to the UserService
        const user = await this.userService.create(createUserDto, passwordHash);

        // Remove the hash before returning the user
        const { passwordHash: _, ...safeUser } = user;
        return safeUser;
    }

    async login(loginDto: LoginDto) {
        this.logger.log(`Attempting login for: ${loginDto.email}`);

        // Find the user
        const user = await this.userService.findByEmail(loginDto.email);
        if (!user) {
            this.logger.error('Login failed: User not found');
            throw new UnauthorizedException('Invalid credentials');
        }

        // Verify the Argon2 hash
        const isPasswordValid = await argon2.verify(user.passwordHash, loginDto.password);
        if (!isPasswordValid) {
            this.logger.error('Login failed: Invalid password');
            throw new UnauthorizedException('Invalid credentials');
        }

        // Generate the JWT payload
        const payload = { sub: user.id, email: user.email };
        const token = this.jwtService.sign(payload);

        this.logger.log(`Login successful for User ID: ${user.id}`);

        return {
            accessToken: token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
        };
    }
}