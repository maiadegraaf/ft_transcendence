import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
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

  // @OneToOne(() => Profile)
  // @JoinColumn()
  // profile: Profile;

  // @OneToMany(() => Post, (post) => post.user)
  // posts: Post[];
}
