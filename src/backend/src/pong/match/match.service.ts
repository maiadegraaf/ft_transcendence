import { Injectable } from '@nestjs/common';
import { Match } from 'src/pong/entities/match.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class MatchService {
  private waitlist: User[] = [];
  private matches: Match[] = [];

  addToWaitlist(user: User) {
    this.waitlist.push(user);
    this.tryToCreateMatch();
  }

  removeFromWaitlist(user: User) {
    this.waitlist = this.waitlist.filter((u) => u.id !== user.id);
  }

  private tryToCreateMatch() {
    if (this.waitlist.length >= 2) {
      const player1 = this.waitlist.shift();
      const player2 = this.waitlist.shift();
      const match = new Match();
      match.player1 = player1;
      match.player2 = player2;
      match.score1 = 0;
      match.score2 = 0;
      this.matches.push(match);
    }
  }

  getMatches(): Match[] {
    return this.matches;
  }

  getMatchById(id: number): Match {
    return this.matches.find((m) => m.id === id);
  }
}
