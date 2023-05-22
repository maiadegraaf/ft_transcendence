import { User } from 'src/user/user.entity'

export class Match {
    static idCounter = 0
    private readonly _id: number
    private readonly _player1: User
    private readonly _player2: User
    private _score1: number
    private _score2: number
    constructor(player1: User, player2: User) {
        this._id = Match.idCounter++
        this._player1 = player1
        this._player2 = player2
        this._score1 = 0
        this._score2 = 0
    }

    get score2(): number {
        return this._score2
    }
    get score1(): number {
        return this._score1
    }
    get player2(): User {
        return this._player2
    }
    get player1(): User {
        return this._player1
    }
    get id(): number {
        return this._id
    }

    updateScore(score1: number, score2: number) {
        this._score1 = score1
        this._score2 = score2
    }
}
