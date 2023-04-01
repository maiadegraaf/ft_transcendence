import { Player } from 'src/pong/player/player.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

export enum Difficulty {
    EASY = 'EASY',
    NORMAL = 'NORMAL',
    HARD = 'HARD',
    IMPOSSIBLE = 'IMPOSSIBLE',
}
@Entity()
export class PracticeMatchEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Player)
    player: Player;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({
        default: 0,
    })
    score1: number;

    @Column({
        default: 0,
    })
    score2: number;

    @Column({
        type: 'enum',
        enum: Difficulty,
        default: Difficulty.EASY,
    })
    difficulty: Difficulty;

    @Column({
        default: 10,
    })
    winningCondition: number;
}
