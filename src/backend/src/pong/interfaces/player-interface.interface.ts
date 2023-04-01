import { Player } from '../player/player.entity'

export interface PlayerInterface {
    user: Player;
    x: number;
    y: number;
    new_y: number;
    score: number;
}
