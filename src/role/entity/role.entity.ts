import { Permission } from 'src/permission/entity/permission.entity';
import { User } from 'src/user/entity/user.entity';

import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IRole } from './role.interface';

@Entity()
export class Role implements IRole {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column() 
  description: string;

  @Column({
    default: true,
  })
  active: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.role)
  users: User;

  @ManyToMany(() => Permission)
  @JoinTable({
    name: 'role_permission',
  })
  permissions: Permissions[];
}
