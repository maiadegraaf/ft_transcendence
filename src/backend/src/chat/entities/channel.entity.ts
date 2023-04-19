import {
    Entity,
    JoinColumn,
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

    @ManyToMany(() => User, (user) => user.channels)
    users: User[];

    @JoinColumn()
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
