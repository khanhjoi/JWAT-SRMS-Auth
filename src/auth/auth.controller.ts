import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterRequestDTO } from './dto/request/register.dto';
import { LoginRequestDTO } from './dto/request/login.dto';
import { AuthResponse } from './dto/response/Auth.dto';
import { AuthRefreshGuard } from './guard/auth-freshToken.guard';
import { ChangePasswordDTO } from './dto/request/change-password.dto';
import { AuthGuard } from './guard/auth.guard';
import { ForgotPasswordDTO } from './dto/request/forgot-password.dto';
import { ResetPasswordReqDTO } from './dto/request/reset-password.dto';

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

  @Put('/change-password')
  @UseGuards(AuthGuard)
  async changePassword(
    @Body() changePasswordDTO: ChangePasswordDTO,
    @Request() req,
  ) {
    const user = req.user;

    const res = await this.authService.changePassword(
      user.sub,
      changePasswordDTO.oldPassword,
      changePasswordDTO.newPassword,
    );

    return res;
  }

  @Post('/forgot-password')
  async forgotPassword(@Body() forgotPasswordDTO: ForgotPasswordDTO) {
    const res = await this.authService.forgotPassword(forgotPasswordDTO.email);
    return res;
  }

  @Put('/reset-password')
  async resetPassword(
    @Query('token') tokenDTO: string,
    @Body() ResetPasswordDTO: ResetPasswordReqDTO,
  ) {
    return this.authService.resetPassword(tokenDTO, ResetPasswordDTO);
  }
}
