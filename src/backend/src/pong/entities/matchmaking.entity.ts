import { User } from 'src/user/entities/user.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Matchmaking {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  player: User;
}
