import { User } from 'src/user/entities/user.entity';
import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Matchmaking {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User)
    player: User;

    @Column()
    socketId: string;
}
