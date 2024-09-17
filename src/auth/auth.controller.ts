import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  Request,
  Res,
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
import { Response } from 'express';

@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  async login(
    @Body() data: LoginRequestDTO,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ message: string }> {
    const { accessToken, refreshToken } = await this.authService.login(data);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
    });

    return {
      message: 'Logged in successfully',
    };
  }

  @Post('/register')
  async register(
    @Body() data: RegisterRequestDTO,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ message: string }> {
    const { accessToken, refreshToken } = await this.authService.register(data);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
    });

    return { message: 'Register success' };
  }

  @Post('/forgot-password')
  async forgotPassword(@Body() forgotPasswordDTO: ForgotPasswordDTO) {
    const res = await this.authService.forgotPassword(forgotPasswordDTO.email);
    return res;
  }

  @Get('/logout')
  @UseGuards(AuthGuard)
  async logout(@Request() req, @Res({ passthrough: true }) res: Response) {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    await this.authService.logout(req.user.sub);
    return;
  }

  @Get('/refreshToken')
  @UseGuards(AuthRefreshGuard)
  async refreshToken(
    @Request() req,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const { accessToken, refreshToken } = await this.authService.refreshTokens(
      req.id,
      req.token,
    );

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
    });
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

  @Put('/reset-password')
  async resetPassword(
    @Query('token') tokenDTO: string,
    @Body() ResetPasswordDTO: ResetPasswordReqDTO,
  ) {
    return this.authService.resetPassword(tokenDTO, ResetPasswordDTO);
  }
}
