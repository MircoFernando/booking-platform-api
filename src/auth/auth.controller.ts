import { Body, Controller, Post, HttpCode, HttpStatus, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, LogoutDto, RefreshDto, RegisterDto } from './dto';
import { JwtAuthGuard, JwtRefreshGuard } from './guards';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    // Register User
    // Route: POST /api/v1/auth/register
    // Body: { "email": "", "password": "", "name": "" }
    @Post('register')
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    // Login User
    // Route: POST /api/v1/auth/login
    // Body: { "email": "", "password": "" }
    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    // Logout User
    // Route: POST /api/v1/auth/logout
    // Body: { "refreshToken": "" }
    @UseGuards(JwtAuthGuard)
    @Post('logout')
    @HttpCode(HttpStatus.OK)
    async logout(@Req() req: any, @Body() logoutDto: LogoutDto) {
        return this.authService.logout(req.user.id, logoutDto);
    }

    // Refresh Tokens
    // Route: POST /api/v1/auth/refresh
    // Body: None (Requires Refresh Token in Authorization Header)
    @UseGuards(JwtRefreshGuard)
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    async refresh(@Req() req: any) {
        return this.authService.refreshTokens({
            userId: req.user.sub,
            refreshToken: req.user.refreshToken,
        });
    }
}