import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterRequestDTO } from './dto/request/register-request.dto';
import { LoginRequestDTO } from './dto/request/login-request.dto';
import { AuthResponse } from './dto/response/Auth-response';
import { AuthRefreshGuard } from './guard/auth-freshToken.guard';

@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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

  @Get('/refreshToken')
  @UseGuards(AuthRefreshGuard)
  async refreshToken(@Request() req): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const res = await this.authService.refreshTokens(req.email, req.token);
    return res;
  }
}
