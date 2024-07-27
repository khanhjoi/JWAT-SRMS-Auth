import { Role } from 'src/role/entity/role.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { IUser } from './user.interface';

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

  @Column({ nullable: true })
  refreshToken: string | null;

  @OneToMany(() => Role, (role) => role.users)
  role: Role;
}
