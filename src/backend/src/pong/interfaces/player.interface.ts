import { User } from '../../users/entities/users.entity'

export interface Player {
    user: User;
    x: number;
    y: number;
    new_y: number;
    score: number;
}
