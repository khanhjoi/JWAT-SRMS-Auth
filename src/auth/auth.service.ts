import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { RegisterRequestDTO } from './dto/request/register-request.dto';
import { LoginRequestDTO } from './dto/request/login-request.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthResponse, TokenType } from './dto/response/Auth-response';
import { v4 as uuidv4 } from 'uuid';
import { RefreshTokenService } from 'src/RefreshToken/refreshToken.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private refreshTokenService: RefreshTokenService,
  ) {}

  async login(loginRequestDTO: LoginRequestDTO): Promise<AuthResponse> {
    const user = await this.userService.findUserByEmail(loginRequestDTO.email);

    const isMatchPassword = await bcrypt.compare(
      loginRequestDTO.password,
      user.password,
    );

    if (!isMatchPassword) {
      throw new HttpException('Invalid password', HttpStatus.BAD_REQUEST);
    }

    let { accessToken, refreshToken } = await this.generateRefreshToken({
      sub: user.id,
    });

    const isRefreshTokenExit = await this.refreshTokenService.findTokenOfUserId(
      user.id,
    );

    if (isRefreshTokenExit) {
      await this.refreshTokenService.updateRefreshToken(isRefreshTokenExit.id);
    } else {
      await this.refreshTokenService.createRefreshToken(refreshToken, user.id);
    }

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
      userInfo: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    };
  }

  async register(registerDto: RegisterRequestDTO): Promise<AuthResponse> {
    const newUser = await this.userService.createUser(registerDto);

    const { accessToken, refreshToken } = await this.generateRefreshToken({
      sub: newUser.id,
    });

    const isRefreshTokenExit = await this.refreshTokenService.findTokenOfUserId(
      newUser.id,
    );

    if (isRefreshTokenExit) {
      await this.refreshTokenService.updateRefreshToken(isRefreshTokenExit.id);
    } else {
      await this.refreshTokenService.createRefreshToken(refreshToken, newUser.id);
    }
    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
      userInfo: {
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
      },
    };
  }

  async refreshTokens(id: string, token: string): Promise<AuthResponse> {
    const user = await this.userService.findUserById(id);

    if (!user) {
      throw new ForbiddenException('Access Denied');
    }

    const { accessToken, refreshToken } = await this.generateRefreshToken({
      sub: user.id,
    });

    await this.userService.updateUserWithRefreshToken(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
      userInfo: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    };
  }

  async generateRefreshToken(payload: { sub: string }): Promise<TokenType> {
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '10m',
    });

    const refreshToken = await uuidv4();

    return {
      accessToken,
      refreshToken,
    };
  }
}
