import { ChildEntity, JoinTable, ManyToMany } from 'typeorm';
import { Channel } from './channel.entity';
// import {User} from "../../user/entities/user.entity";
import { User } from 'src/typeorm/entities/User';

@ChildEntity()
export class DmChannel extends Channel {
  @ManyToMany(() => User, { onDelete: 'CASCADE' })
  @JoinTable()
  members: User[];
}
