import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Message } from './message.entity';
import { User } from '../../user/user.entity';
import { GroupProfile } from './groupProfile.entity';

@Entity()
export class Channel {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Message, (msg) => msg.channel)
  messages: Message[];

  @JoinTable()
  @ManyToMany(() => User, (usr) => usr.id)
  users: User[];

  @OneToOne(() => GroupProfile, (profile) => profile.channel)
  profile: GroupProfile;
  //
  // @Column()
  // type: ChannelEnum;
  //
  // @Column()
  // dmChannel: ChannelEnum;

  // @Column()
  // name: string;
}
