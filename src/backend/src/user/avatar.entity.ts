import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Avatar {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    filename: string;

    @Column({ type: "bytea", nullable: true })
    data: Buffer;

    @OneToOne(() => User, (user) => user.avatar, { onDelete: 'CASCADE' })
    @JoinColumn()
    user: User;
}
