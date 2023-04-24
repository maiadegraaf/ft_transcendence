import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    OneToOne,
    PrimaryColumn,
} from 'typeorm';
import { Channel } from '../chat/entities/channel.entity';
import { GroupProfile } from '../chat/entities/groupProfile.entity';

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

    @Column({
        default: null,
    })
    socketId: string;
}
