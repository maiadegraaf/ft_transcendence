import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Channel } from '../chat/entities/channel.entity';
import { GroupProfile } from '../chat/entities/groupProfile.entity';
// import { Post } from './Post';
// import { Profile } from './Profile';

@Entity({ name: 'users' })
export class User {
  @PrimaryColumn()
  id: number;

  @Column({ nullable: true })
  login: string;

  // @Column( {nullable: true })
  @Column({ nullable: true })
  email: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @JoinTable()
  @ManyToMany(() => Channel, (channel) => channel.users)
  channels: Channel[];

  @OneToOne(() => GroupProfile, (groupProfile) => groupProfile.admin)
  groupProfile: GroupProfile;
  // @OneToOne(() => Profile)
  // @JoinColumn()
  // profile: Profile;

  // @OneToMany(() => Post, (post) => post.user)
  // posts: Post[];
}
