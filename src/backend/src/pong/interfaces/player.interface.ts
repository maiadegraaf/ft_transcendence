import { User } from '../../user/user.entity'

export interface Player {
    user: User
    x: number
    y: number
    new_y: number
    score: number
}
