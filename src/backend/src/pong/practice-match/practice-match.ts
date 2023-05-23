import { User } from '../../user/user.entity'

export enum Difficulty {
    EASY = 'EASY',
    NORMAL = 'NORMAL',
    HARD = 'HARD',
    EXPERT = 'EXPERT'
}

export class PracticeMatch {
    static idCounter = 0
    private readonly _id: number
    private readonly _player: User
    private _score1: number
    private _score2: number
    private readonly _difficulty: Difficulty
    private readonly _winningCondition: number

    constructor(player: User, difficulty: Difficulty, winningCondition: number) {
        this._id = PracticeMatch.idCounter++
        this._player = player
        this._score1 = 0
        this._score2 = 0
        this._difficulty = difficulty
        this._winningCondition = winningCondition
    }

    get winningCondition(): number {
        return this._winningCondition
    }

    get difficulty(): Difficulty {
        return this._difficulty
    }

    get score2(): number {
        return this._score2
    }

    get score1(): number {
        return this._score1
    }

    get player(): User {
        return this._player
    }

    get id(): number {
        return this._id
    }

    updateScore(score1: number, score2: number) {
        this._score1 = score1
        this._score2 = score2
    }
}
