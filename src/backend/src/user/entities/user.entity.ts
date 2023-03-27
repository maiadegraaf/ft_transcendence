import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
// import { Avatar } from "./avatar.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  // @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  // createdAt: Date;

  @Column()
  username: string;

  @Column()
  password: string;

  // @OneToOne(() => Avatar)
  // @JoinColumn()
  // avatar: Avatar;
  //
  // @ManyToMany(() => User)
  // @JoinTable()
  // blocked: User[];
  //
  // @ManyToMany(() => User)
  // @JoinTable()
  // friends: User[];
}
