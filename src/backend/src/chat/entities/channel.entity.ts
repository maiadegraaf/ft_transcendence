import {
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  TableInheritance,
} from 'typeorm';
import { Msg } from './message.entity';

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class Channel {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Msg, (msg) => msg.channel)
  messages: Msg[];
}
