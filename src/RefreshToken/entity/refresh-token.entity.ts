import { User } from '../../user/entity/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IRefreshToken } from './refresh-token.interface';

@Entity()
export class RefreshToken implements IRefreshToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  expiresAt: Date;

  @ManyToOne(() => User, (user) => user.refreshTokens)
  user: User;
}
