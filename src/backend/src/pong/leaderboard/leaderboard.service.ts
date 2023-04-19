import { Injectable } from '@nestjs/common';
import { Match } from '../match/match.entity';
import { User } from '../../user/user.entity';
import { Leaderboard } from './leaderboard.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
    Difficulty,
    PracticeMatchEntity,
} from '../practice-match/practice-match.entity';
import { PracticeMatchService } from '../practice-match/practice-match.service';
import { MatchService } from '../match/match.service';

@Injectable()
export class LeaderboardService {
    constructor(
        @InjectRepository(Leaderboard)
        private leaderboardRepository: Repository<Leaderboard>,
        private readonly practiceMatchService: PracticeMatchService,
        private readonly matchService: MatchService,
    ) {}

    async findMatchResults(): Promise<Leaderboard[]> {
        return this.leaderboardRepository.find({
            select: ['rating', 'wins', 'losses', 'winStreak'],
            relations: {
                user: true,
            },
            order: {
                rating: 'DESC',
            },
        });
    }

    async findAll(): Promise<Leaderboard[]> {
        return this.leaderboardRepository.find({
            relations: {
                user: true,
            },
        });
    }

    async createNewLeaderboardEntry(player: User) {
        const leaderboardEntry = new Leaderboard();
        leaderboardEntry.user = player;
        return await this.leaderboardRepository.save(leaderboardEntry);
    }

    async findLeaderboardEntry(player: User) {
        let entry;
        for (const e of await this.findAll()) {
            if (e.user?.id === player.id) {
                entry = e;
                break;
            }
        }
        // const entry = await this.leaderboardRepository.findOne({
        //     where: { user: player },
        //     relations: {
        //         user: true,
        //     },
        // });
        if (!entry) {
            return await this.createNewLeaderboardEntry(player);
        }
        return entry;
    }

    async addWinToLeaderboardEntry(entry: Leaderboard, newRating: number) {
        entry.rating = Math.round(newRating);
        entry.wins++;
        entry.winStreak++;
        return await this.leaderboardRepository.save(entry);
    }

    async addLossToLeaderboardEntry(entry: Leaderboard, newRating: number) {
        entry.rating = Math.round(newRating);
        entry.losses++;
        entry.winStreak = 0;
        return await this.leaderboardRepository.save(entry);
    }

    async assignWinnerAndLoser(winner: Leaderboard, loser: Leaderboard) {
        const winnerRating = winner.rating;
        const loserRating = loser.rating;
        const expectedWinnerScore =
            1 / (1 + 10 ** ((loserRating - winnerRating) / 400));
        const expectedLoserScore =
            1 / (1 + 10 ** ((winnerRating - loserRating) / 400));
        const winnerNewRating = winnerRating + 32 * (1 - expectedWinnerScore);
        const loserNewRating = loserRating + 32 * (0 - expectedLoserScore);
        await this.addWinToLeaderboardEntry(winner, winnerNewRating);
        await this.addLossToLeaderboardEntry(loser, loserNewRating);
    }

    async addMatchToLeaderboard(match: Match) {
        const player1 = await this.findLeaderboardEntry(
            await this.matchService.returnPlayer1(match),
        );
        const player2 = await this.findLeaderboardEntry(
            await this.matchService.returnPlayer2(match),
        );
        if (match.score1 == 10) {
            await this.assignWinnerAndLoser(player1, player2);
        } else {
            await this.assignWinnerAndLoser(player2, player1);
        }
    }

    async assignPracticeMatchType(
        type: Difficulty,
        player: Leaderboard,
        addScore: number,
    ) {
        switch (type) {
            case Difficulty.EASY:
                player.practiceEasyWins += addScore;
                player.practiceEasyPlayed++;
                break;
            case Difficulty.NORMAL:
                player.practiceNormalWins += addScore;
                player.practiceNormalPlayed++;
                break;
            case Difficulty.HARD:
                player.practiceHardWins += addScore;
                player.practiceHardPlayed++;
                break;
            case Difficulty.IMPOSSIBLE:
                player.practiceImpossibleWins += addScore;
                player.practiceImpossiblePlayed++;
                break;
        }
        return await this.leaderboardRepository.save(player);
    }

    async addPracticeMatchToLeaderboard(practiceMatch: PracticeMatchEntity) {
        const player = await this.findLeaderboardEntry(
            await this.practiceMatchService.returnPlayer(practiceMatch),
        );
        console.log('player', player);
        console.log('practiceMatch', practiceMatch);
        if (practiceMatch.score1 == practiceMatch.winningCondition) {
            await this.assignPracticeMatchType(
                practiceMatch.difficulty,
                player,
                1,
            );
        } else {
            await this.assignPracticeMatchType(
                practiceMatch.difficulty,
                player,
                0,
            );
        }
    }
}
