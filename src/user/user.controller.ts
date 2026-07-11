import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get(':id')
  async getUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.findOne(id);
  }

  @Get()
  async getAllUsers() {
    return this.userService.findAll();
  }
}
