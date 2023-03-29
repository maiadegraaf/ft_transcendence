import { User } from 'src/users/entities/users.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Channel } from './channel.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @OneToOne(() => User)
  @JoinColumn()
  sender: User;

  @ManyToOne(() => Channel)
  @JoinColumn()
  channel: Channel;
}
