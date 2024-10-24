import {
  Body,
  Controller,
  Get,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entity/user.entity';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('/user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/profile')
  @UseGuards(AuthGuard)
  async getProfile(@Request() req): Promise<User> {
    const res = await this.userService.findUserById(req.user.sub, [
      'id',
      'lastName',
      'firstName',
      'email',
      'password',
      'createdAt',
      'role',
      'isDelete',
    ]);
    res.password = '';
    return res;
  }

  @Put('/profile')
  @UseGuards(AuthGuard)
  async updateProfile(
    @Request() req,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<User> {
    const user = await this.userService.updateProfileUser(
      req.user.sub,
      updateProfileDto,
    );

    return user;
  }
}
