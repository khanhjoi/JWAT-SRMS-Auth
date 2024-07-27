import { HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { RegisterRequestDTO } from './dto/request/register-request.dto';
import { LoginRequestDTO } from './dto/request/login-request.dto';
import * as bcrypt from 'bcrypt';
import { RpcException } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(loginRequestDTO: LoginRequestDTO): Promise<{
    assetToken: string;
    refreshToken: string;
  }> {
    const user = await this.userService.findUserByEmail(loginRequestDTO.email);

    const isMatchPassword = await bcrypt.compare(
      loginRequestDTO.password,
      user.password,
    );

    if (!isMatchPassword) {
      throw new RpcException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Invalid password',
      });
    }

    const { accessToken, refreshToken } = await this.generateRefreshToken({
      sub: user.id,
    });

    await this.userService.updateUserWithRefreshToken(user.id, refreshToken);

    return {
      assetToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  async register(registerDto: RegisterRequestDTO): Promise<{
    assetToken: string;
    refreshToken: string;
  }> {
    const newUser = await this.userService.createUser(registerDto);

    const { accessToken, refreshToken } = await this.generateRefreshToken({
      sub: newUser.id,
    });

    await this.userService.updateUserWithRefreshToken(newUser.id, refreshToken);

    return {
      assetToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  async generateRefreshToken(payload: { sub: string }): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '30m',
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '3d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
