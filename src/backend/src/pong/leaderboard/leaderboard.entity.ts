import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from '../../user/user.entity'

@Entity({ name: 'leaderboard' })
export class Leaderboard {
    @PrimaryGeneratedColumn()
    id: number

    @JoinColumn()
    @OneToOne(() => User)
    user: User

    @Column({ default: 1000 })
    rating: number

    @Column({ default: 0 })
    wins: number

    @Column({ default: 0 })
    losses: number

    @Column({ default: 0 })
    winStreak: number

    @Column({ default: 0 })
    practiceEasyPlayed: number

    @Column({ default: 0 })
    practiceEasyWins: number

    @Column({ default: 0 })
    practiceNormalPlayed: number

    @Column({ default: 0 })
    practiceNormalWins: number

    @Column({ default: 0 })
    practiceHardPlayed: number

    @Column({ default: 0 })
    practiceHardWins: number

    @Column({ default: 0 })
    practiceExpertPlayed: number

    @Column({ default: 0 })
    practiceExpertWins: number
}
