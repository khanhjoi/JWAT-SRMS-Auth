import { Permission } from '../../permission/entity/permission.entity';
import { User } from '../../user/entity/user.entity';

import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IRole } from '../interface/role.interface';

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

  @OneToMany(() => User, (user) => user.role)
  users: User[];

  @ManyToMany(() => Permission, { eager: true }) // eager: true will automatically load permissions when loading the role
  @JoinTable({
    name: 'role_permission',
  })
  permissions: Permission[];
}
