import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './dto/create-user.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async createNewUser(createUserDTO: CreateUserDTO): Promise<User> {
    try {
      const user = await this.userRepository.save(createUserDTO);
      return user;
    } catch (error) {
      throw new HttpException('Create user failed', HttpStatus.BAD_REQUEST);
    }
  }

  async findUserByEmail(email: string, select?: (keyof User)[]): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { email: email },
        select: select ? select : undefined,
      });
      return user;
    } catch (error) {
      throw new HttpException('Find user failed', HttpStatus.BAD_REQUEST);
    }
  }

  async findUserById(id: string, select?: (keyof User)[]): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: id },
        select: select ? select : undefined,
        relations: {
          role: true,
        },
      });
      return user;
    } catch (error) {
      console.log(error);
      throw new HttpException('Find user failed', HttpStatus.BAD_REQUEST);
    }
  }

  async updateUser(user: User): Promise<User> {
    try {
      const userUpdate = await this.userRepository.save(user);
      return userUpdate;
    } catch (error) {
      throw new HttpException('Update user failed', HttpStatus.BAD_REQUEST);
    }
  }
}
