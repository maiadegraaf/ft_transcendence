import { Player } from 'src/pong/player/player.entity';
import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Matchmaking {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => Player)
    @JoinColumn()
    player: Player;
}
