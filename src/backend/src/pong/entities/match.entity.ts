import { User } from 'src/user/entities/user.entity';
import { Matchmaking } from 'src/pong/matchmaking/matchmaking.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Match {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User)
    player1: Matchmaking;

    @ManyToOne(() => User)
    player2: Matchmaking;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column()
    score1: number;

    @Column()
    score2: number;
}
