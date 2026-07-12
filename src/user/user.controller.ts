import { Controller, Get, Param, Query, ParseUUIDPipe } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

    // Get User by ID
    // Route: GET /api/v1/users/find?id=...
    // Body: None
    @Get('find')
    async getUser(@Query('id', ParseUUIDPipe) id: string) {
        return this.userService.findOne(id);
    }

    // Get All Users
    // Route: GET /api/v1/users
    // Body: None
    @Get()
    async getAllUsers() {
        return this.userService.findAll();
    }
}
