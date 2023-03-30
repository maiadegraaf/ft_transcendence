import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
// import { Avatar } from './avatar.entity';
import { Channel } from '../../chat/entities/channel.entity';
import { GroupProfile } from '../../chat/entities/groupProfile.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column()
  username: string;

  @Column()
  email: string;

  @JoinTable()
  @OneToOne(() => GroupProfile, (groupProfile) => groupProfile.admin)
  groupProfile: GroupProfile;

  // @OneToOne(() => Avatar)
  // @JoinColumn()
  // avatar: Avatar;

  @ManyToMany(() => User)
  @JoinTable()
  blocked: User[];

  @ManyToMany(() => Channel)
  @JoinTable()
  channels: Channel[];
}
