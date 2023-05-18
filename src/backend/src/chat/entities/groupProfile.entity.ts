import {
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn
} from 'typeorm'
import { Channel } from './channel.entity'
import { User } from '../../user/user.entity'
import { EGroupChannelType } from '../dtos/chat.dtos'

// @TableInheritance({ column: { type: 'varchar', name: 'type' } })
@Entity()
export class GroupProfile {
    @PrimaryGeneratedColumn()
    id: number

    @JoinColumn()
    @OneToOne(() => Channel, (channel) => channel.profile, { nullable: true })
    channel: Channel

    @JoinColumn()
    @ManyToOne(() => User, (owner) => owner.groupProfile)
    owner: User

    @Column({ nullable: true })
    name: string

    @JoinTable()
    @ManyToMany(() => User, (admin) => admin.groupProfile)
    admin: User[]

    @JoinTable()
    @ManyToMany(() => User, (usr) => usr.blocked)
    blocked: User[]

    @JoinTable()
    @ManyToMany(() => User, (usr) => usr.muted)
    muted: User[]

    @Column({ nullable: true })
    type: EGroupChannelType

    @Column({ nullable: true })
    password: string
}
