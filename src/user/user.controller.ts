import { Controller, Get, Query, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

    // Get User by ID
    // Route: GET /api/v1/users/find?id=...
    // Body: None
    @Get('find')
    @ApiOperation({ summary: 'Get a user by their UUID' })
    @ApiQuery({ name: 'id', description: 'The UUID of the user to fetch' })
    @ApiResponse({ status: 200, description: 'The user details returned successfully.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 404, description: 'User not found.' })
    async getUser(@Query('id', ParseUUIDPipe) id: string) {
        return this.userService.findOne(id);
    }

    // Get All Users
    // Route: GET /api/v1/users
    // Body: None
    @Get()
    @ApiOperation({ summary: 'Retrieve a list of all users' })
    @ApiResponse({ status: 200, description: 'The list of users returned successfully.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    async getAllUsers() {
        return this.userService.findAll();
    }
}
