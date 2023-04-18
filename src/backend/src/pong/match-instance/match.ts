import { User } from 'src/user/user.entity';

export class Match {
    static idCounter = 0;
    id: number;
    player1: User;
    player2: User;
    score1: number;
    score2: number;
    constructor(player1: User, player2: User) {
        this.id = Match.idCounter++;
        this.player1 = player1;
        this.player2 = player2;
        this.score1 = 0;
        this.score2 = 0;
    }

    getId(): number {
        return this.id;
    }

    getPlayer1(): User {
        return this.player1;
    }

    getPlayer2(): User {
        return this.player2;
    }

    getScore1(): number {
        return this.score1;
    }

    getScore2(): number {
        return this.score2;
    }

    updateScore(score1: number, score2: number) {
        this.score1 = score1;
        this.score2 = score2;
    }
}
