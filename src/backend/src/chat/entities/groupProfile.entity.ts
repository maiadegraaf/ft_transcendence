import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Channel } from './channel.entity';
import { User } from '../../user/user.entity';

// @TableInheritance({ column: { type: 'varchar', name: 'type' } })
@Entity()
export class GroupProfile {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => Channel, (channel) => channel.profile) // @PrimaryGeneratedColumn()
    channel: Channel;

    @JoinTable()
    @ManyToMany(() => User, (admin) => admin.groupProfile)
    admin: User[];

    @OneToOne(() => User, (owner) => owner.groupProfile)
    owner: User;

    @JoinTable()
    @ManyToMany(() => User, (usr) => usr.id)
    blocked: User[];

    @Column()
    name: string;
    // id: number;
    //
    // @OneToMany(() => Message, (msg) => msg.channel)
    // messages: Message[];
    //
    // @JoinTable()
    // @ManyToMany(() => User, (usr) => usr.id)
    // users: User[];
    // @OneToOne(() => GroupProfile)
    //
    // @Column()
    // type: ChannelEnum;
    //
    // @Column()
    // dmChannel: ChannelEnum;
}
