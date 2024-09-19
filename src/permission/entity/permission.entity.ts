import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IPermission } from '../interface/permission.interface';
import { Action } from '../../common/enums/action.enum';

@Entity()
export class Permission implements IPermission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({
    type: 'enum',
    enum: Action,
  })
  action: Action;

  @Column()
  subject: string;

  @Column({
    nullable: true,
  })
  condition: string;

  @Column({
    default: true,
  })
  active: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
