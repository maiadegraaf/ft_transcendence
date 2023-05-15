import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryColumn,
} from 'typeorm';
import { Channel } from '../chat/entities/channel.entity';
import { GroupProfile } from '../chat/entities/groupProfile.entity';
import { Avatar } from './avatar.entity';
import { MutedTime } from '../chat/entities/mutedTime.enitity';
// import { Post } from './Post';
// import { Profile } from './Profile';

@Entity({ name: 'users' })
export class User {
    @PrimaryColumn()
    id: number;

    @Column({ unique: true })
    login: string; //maybe call it username

    // @Column( {nullable: true })
    @Column({ nullable: true })
    email: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ nullable: true })
    twoFactorAuthenticationSecret?: string;

    @Column({ default: false })
    isTwoFactorAuthenticationEnabled: boolean;

    @JoinTable()
    @ManyToMany(() => Channel, (channel) => channel.users)
    channels: Channel[];

    @OneToOne(() => GroupProfile, (groupProfile) => groupProfile.owner)
    groupProfile: GroupProfile;

    @ManyToMany(() => GroupProfile, (group) => group.admin)
    admin: GroupProfile[];

    @ManyToMany(() => GroupProfile, (group) => group.blocked)
    blocked: GroupProfile[];

    @ManyToMany(() => GroupProfile, (group) => group.muted)
    muted: GroupProfile[];

    @JoinTable()
    @ManyToMany(() => MutedTime, (mt) => mt.user)
    mutedTime: MutedTime[];

    @OneToOne(() => Avatar, (avatar) => avatar.user)
    @JoinColumn()
    avatar: Avatar;

    @Column({
        default: null,
    })
    socketId: string;

    @ManyToMany(() => User)
    @JoinTable()
    friends: User[];

    @ManyToMany(() => User)
    @JoinTable()
    blockedUsers: User[];

    // @ManyToMany(() => User)
    // @JoinTable()
    // friends: User[];

    // @Column({ default: 100 })
    // rank: number;

    // @Column('int', { array: true, default: [] })
    // followed: number[];

    // @Column('int', { array: true, default: [] })
    // blocked: number[];

    // @Column({ default: Status.OFFLINE })
    // status: Status;

    // @OneToMany(() => Match, (match) => match.winner)
    // won: Match[];

    // @OneToMany(() => Match, (match) => match.loser)
    // lost: Match[];
}
