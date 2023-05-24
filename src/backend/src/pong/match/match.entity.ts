import { Entity, PrimaryColumn, Column, JoinColumn, ManyToOne } from 'typeorm'
import { User } from '../../user/user.entity'

@Entity({ name: 'matches' })
export class Matches {
    @PrimaryColumn()
    id: number

    @JoinColumn()
    @ManyToOne(() => User)
    player1: User

    @JoinColumn()
    @ManyToOne(() => User)
    player2: User

    @Column({ default: 0 })
    player1Score: number

    @Column({ default: 0 })
    player2Score: number
}
