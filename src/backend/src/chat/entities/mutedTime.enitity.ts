import { Entity, ManyToMany, Column, PrimaryGeneratedColumn } from 'typeorm';

import { User } from '../../user/user.entity';
import { GroupProfile } from './groupProfile.entity';

@Entity()
export class MutedTime {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToMany(() => User, (user) => user.mutedTime)
    user: User[];

    @ManyToMany(() => GroupProfile, (groupProfile) => groupProfile.mutedTime)
    groupProfile: GroupProfile[];

    @Column()
    time: Date;
}
