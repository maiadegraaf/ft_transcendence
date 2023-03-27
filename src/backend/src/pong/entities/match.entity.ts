// import { User } from "src/user/entities/user.entity";
import { User } from "src/typeorm/entities/User";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Match {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToMany(() => User)
    @JoinTable()
    players: User[];

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column()
    score: string;
}