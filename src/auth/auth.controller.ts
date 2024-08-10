import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterRequestDTO } from './dto/request/register-request.dto';
import { LoginRequestDTO } from './dto/request/login-request.dto';
import { AuthGuard } from './guard/auth.guard';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entity/user.entity';
import { AuthResponse } from './dto/response/Auth-response';
import { AuthRefreshGuard } from './guard/auth-freshToken.guard';

@Controller('/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('/login')
  async login(@Body() data: LoginRequestDTO): Promise<AuthResponse> {
    const res = await this.authService.login(data);
    return res;
  }

  @Post('/register')
  async register(@Body() data: RegisterRequestDTO): Promise<AuthResponse> {
    const res = await this.authService.register(data);
    return res;
  }

  @Get('/profile')
  @UseGuards(AuthGuard)
  async getProfile(@Request() req): Promise<User> {
    const res = await this.userService.findUserById(req.user.sub);
    delete res.password;
    delete res.refreshTokens;
    delete res.id;
    return res;
  }

  @Get('/refreshToken')
  @UseGuards(AuthRefreshGuard)
  async refreshToken(@Request() req): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    console.log(req.token);
    const res = await this.authService.refreshTokens(req.user.sub, req.token);
    return res;
  }
}
