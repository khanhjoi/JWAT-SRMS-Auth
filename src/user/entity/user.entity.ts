import { Role } from '../../role/entity/role.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { IUser } from './user.interface';
import { RefreshToken } from '../../RefreshToken/entity/refresh-token.entity';

@Entity()
@Unique(['email'])
export class User implements IUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  password: string;

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
  refreshTokens: RefreshToken;

  @ManyToOne(() => Role, (role) => role.users)
  role: Role;
}
