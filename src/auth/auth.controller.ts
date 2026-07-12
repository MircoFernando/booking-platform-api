import { Body, Controller, Post, HttpCode, HttpStatus, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, LogoutDto, RefreshDto, RegisterDto } from './dto';
import { JwtAuthGuard, JwtRefreshGuard } from './guards';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    // Register User
    // Route: POST /api/v1/auth/register
    // Body: { "email": "", "password": "", "name": "" }
    @Post('register')
    @ApiOperation({ summary: 'Register a new user' })
    @ApiResponse({ status: 201, description: 'User successfully registered' })
    @ApiResponse({ status: 400, description: 'Invalid input parameters' })
    @ApiResponse({ status: 409, description: 'Email address already in use' })
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    // Login User
    // Route: POST /api/v1/auth/login
    // Body: { "email": "", "password": "" }
    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Authenticate user credentials' })
    @ApiResponse({ status: 200, description: 'User successfully logged in, returns tokens' })
    @ApiResponse({ status: 401, description: 'Invalid credentials' })
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    // Logout User
    // Route: POST /api/v1/auth/logout
    // Body: { "refreshToken": "" }
    @UseGuards(JwtAuthGuard)
    @Post('logout')
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Invalidate current refresh token and logout' })
    @ApiResponse({ status: 200, description: 'Logout successful' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async logout(@Req() req: any, @Body() logoutDto: LogoutDto) {
        return this.authService.logout(req.user.id, logoutDto);
    }

    // Refresh Tokens
    // Route: POST /api/v1/auth/refresh
    // Body: None (Requires Refresh Token in Authorization Header)
    @UseGuards(JwtRefreshGuard)
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Rotate access and refresh tokens using refresh token' })
    @ApiResponse({ status: 200, description: 'Tokens successfully refreshed' })
    @ApiResponse({ status: 401, description: 'Invalid refresh token' })
    async refresh(@Req() req: any) {
        return this.authService.refreshTokens({
            userId: req.user.sub,
            refreshToken: req.user.refreshToken,
        });
    }
}