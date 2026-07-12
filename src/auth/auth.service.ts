import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { UserService } from '../user/user.service';
import { LoginDto, RegisterDto, RefreshDto, LogoutDto } from './dto';
import { AppLogger } from '../common/logger/app-logger.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly logger: AppLogger,
    ) { }

    // Register a new user and return user details without password
    async register(registerDto: RegisterDto) {
        // Hash the password using Argon2
        const passwordHash = await argon2.hash(registerDto.password);

        // Delegate the actual database insertion to the UserService
        const user = await this.userService.create(registerDto, passwordHash);

        // Remove the hash before returning the user
        const { passwordHash: _, ...safeUser } = user;
        return safeUser;
    }

    // Login user, verify password hash, and return access/refresh tokens
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
        const accessToken = this.jwtService.sign(payload, {
            secret: process.env.JWT_SECRET,
            expiresIn: '15m',
        });
        const refreshToken = this.jwtService.sign(payload, {
            secret: process.env.JWT_REFRESH_SECRET,
            expiresIn: '7d',
        });

        // Hash and store the refresh token
        const refreshTokenHash = await argon2.hash(refreshToken);
        await this.userService.updateRefreshToken(user.id, refreshTokenHash);

        this.logger.log(`Login successful for User ID: ${user.id}`);

        return {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
        };
    }

    // Logout user by clearing their saved refresh token hash
    async logout(userId: string, logoutDto: LogoutDto) {
        this.logger.log(`Attempting logout for User ID: ${userId}`);

        // Find the user
        const user = await this.userService.findRawById(userId);
        if (!user) {
            this.logger.error('Token logout failed: User not found');
            throw new UnauthorizedException('Invalid tokens');
        }

        // Verify the refresh token if provided
        if (logoutDto.refreshToken) {
            if (!user.refreshTokenHash) {
                this.logger.error('Token logout failed: No refresh token found');
                throw new UnauthorizedException('Invalid tokens');
            }

            const isRefreshTokenValid = await argon2.verify(user.refreshTokenHash, logoutDto.refreshToken);
            if (!isRefreshTokenValid) {
                this.logger.error('Token logout failed: Invalid refresh token');
                throw new UnauthorizedException('Invalid tokens');
            }
        }

        // Remove the refresh token from the user
        await this.userService.updateRefreshToken(userId, null);

        this.logger.log(`Logout successful for User ID: ${userId}`);

        return {
            message: 'Logout successful',
        };
    }

    // Re-issue a new pair of access and refresh tokens
    async refreshTokens(refreshDto: RefreshDto) {

        const userId = refreshDto.userId;
        const refreshToken = refreshDto.refreshToken;

        this.logger.log(`Attempting to refresh tokens for User ID: ${userId}`);

        // Find the user
        const user = await this.userService.findRawById(userId);
        if (!user) {
            this.logger.error('Token refresh failed: User not found');
            throw new UnauthorizedException('Invalid tokens');
        }

        // Verify the refresh token
        if (!user.refreshTokenHash) {
            this.logger.error('Token refresh failed: No refresh token found');
            throw new UnauthorizedException('Invalid tokens');
        }

        const isRefreshTokenValid = await argon2.verify(user.refreshTokenHash, refreshToken);
        if (!isRefreshTokenValid) {
            this.logger.error('Token refresh failed: Invalid refresh token');
            throw new UnauthorizedException('Invalid tokens');
        }

        // Generate new tokens
        const payload = { sub: user.id, email: user.email };
        const accessToken = this.jwtService.sign(payload, {
            secret: process.env.JWT_SECRET,
            expiresIn: '15m',
        });
        const newRefreshToken = this.jwtService.sign(payload, {
            secret: process.env.JWT_REFRESH_SECRET,
            expiresIn: '7d',
        });

        // Hash and store the new refresh token
        const newRefreshTokenHash = await argon2.hash(newRefreshToken);
        await this.userService.updateRefreshToken(user.id, newRefreshTokenHash);

        this.logger.log(`Tokens refreshed successfully for User ID: ${userId}`);

        return {
            accessToken,
            refreshToken: newRefreshToken,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
        };
    }
}