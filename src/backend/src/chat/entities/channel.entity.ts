import {
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  TableInheritance,
} from 'typeorm';
import { Message } from './message.entity';

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class Channel {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Message, (msg) => msg.channel)
  messages: Message[];
}
