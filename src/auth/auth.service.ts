import { HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { RegisterRequestDTO } from './dto/request/register-request.dto';
import { User } from 'src/user/entity/user.entity';
import { LoginRequestDTO } from './dto/request/login-request.dto';
import * as bcrypt from 'bcrypt';
import { RpcException } from '@nestjs/microservices';
@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async login(loginRequestDTO: LoginRequestDTO) {
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

    return user;
  }

  register(registerDto: RegisterRequestDTO): Promise<User> {
    const newUser = this.userService.createUser(registerDto);
    return newUser;
  }
}
