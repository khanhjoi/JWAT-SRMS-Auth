import { Role } from '../../role/entity/role.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { IUser } from './user.interface';
import { Token } from '../../Token/entity/token.entity';

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

  @Column({
    default: false,
  })
  isDelete: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  password: string;

  @OneToMany(() => Token, (token) => token.user)
  tokens: Token;

  @ManyToOne(() => Role, (role) => role.users)
  role: Role;
}
