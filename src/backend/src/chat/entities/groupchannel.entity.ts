import { ChildEntity } from 'typeorm';
import { Channel } from './channel.entity';

@ChildEntity()
export class GroupChannel extends Channel {
  // @ManyToMany
}
