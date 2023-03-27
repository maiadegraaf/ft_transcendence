// import { User } from "src/user/entities/user.entity";
import { User } from "src/typeorm/entities/User";
import {Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {Channel} from "./channel.entity";

@Entity()
export class Msg {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    text: string;

    @OneToOne(() => User)
    @JoinColumn()
    sender: User;

    @ManyToOne(() => Channel)
    @JoinColumn()
    channel: Channel;
}