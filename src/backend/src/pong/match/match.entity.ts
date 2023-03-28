import { Player } from 'src/pong/player/player.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Match {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Player)
    player1: Player;

    @ManyToOne(() => Player)
    player2: Player;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column()
    score1: number;

    @Column()
    score2: number;
}
