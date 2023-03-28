import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Message } from './message.entity';
import { User } from '../../users/entities/users.entity';

// @TableInheritance({ column: { type: 'varchar', name: 'type' } })
@Entity()
export class Channel {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Message, (msg) => msg.channel)
  messages: Message[];

  @JoinTable()
  @ManyToMany(() => User, (usr) => usr.id)
  users: User[];

  @Column()
  dmChannel: boolean;

  @Column()
  name: string;
}
