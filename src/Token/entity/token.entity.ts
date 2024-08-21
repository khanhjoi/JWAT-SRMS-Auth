import { User } from '../../user/entity/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IToken } from './token.interface';
import { TypeToken } from '../../common/enums/typeToken.enum';

@Entity()
export class Token implements IToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  token: string;

  @Column({
    type: 'enum',
    enum: TypeToken,
  })
  type: TypeToken;

  @Column()
  expiresAt: Date;

  @ManyToOne(() => User, (user) => user.tokens)
  user: User;
}
