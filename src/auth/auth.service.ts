import { HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { RegisterRequestDTO, RegisterRequestPayload } from './dto/request/register-request.dto';
import { LoginRequestPayload } from './dto/request/login-request.dto';
import * as bcrypt from 'bcrypt';
import { RpcException } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(loginRequestDTO: LoginRequestPayload): Promise<{
    access_token: string;
    refresh_token: string;
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

    const payload = { sub: user.id };

    return {
      access_token: await this.jwtService.signAsync(payload),
      refresh_token: await this.jwtService.signAsync(payload, {
        expiresIn: '1d',
      }),
    };
  }

  async register(registerDto: RegisterRequestPayload): Promise<{
    access_token: string;
    refresh_token: string;
  }> {
    const newUser = await this.userService.createUser(registerDto);

    const payload = { sub: newUser.id };

    return {
      access_token: await this.jwtService.signAsync(payload),
      refresh_token: await this.jwtService.signAsync(payload, {
        expiresIn: '1d',
      }),
    };
  }
}
