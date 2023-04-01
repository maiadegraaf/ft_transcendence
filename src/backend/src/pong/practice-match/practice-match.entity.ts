import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/users.entity'

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

    @ManyToOne(() => User)
    player: User;

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
