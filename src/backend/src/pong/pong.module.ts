import { Module } from '@nestjs/common';
import { Server } from 'socket.io';
import { PongGateway } from './gateway/pong.gateway';
import { PongController } from './pong.controller';
import { PongService } from './pong.service';
import { UserModule } from '../users/users.module';
import { MatchmakingModule } from './matchmaking/matchmaking.module';
import { MatchmakingService } from './matchmaking/matchmaking.service';
import { Matchmaking } from './matchmaking/matchmaking.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchModule } from './match/match.module';
import { MatchService } from './match/match.service';
import { Match } from './match/match.entity';
import { PlayerModule } from './player/player.module';
import { Player } from './player/player.entity';
import { PlayerService } from './player/player.service';
import { MatchInstanceModule } from './match-instance/match-instance.module';
import { PracticeMatchModule } from './practice-match/practice-match.module';
import { PracticeMatchService } from './practice-match/practice-match.service';
import { PracticeMatchEntity } from './practice-match/practice-match.entity';

@Module({
    imports: [
        UserModule,
        MatchmakingModule,
        TypeOrmModule.forFeature([Matchmaking]),
        MatchModule,
        TypeOrmModule.forFeature([Match]),
        PlayerModule,
        TypeOrmModule.forFeature([Player]),
        MatchInstanceModule,
        PracticeMatchModule,
        TypeOrmModule.forFeature([PracticeMatchEntity]),
    ],
    controllers: [PongController],
    providers: [
        PongGateway,
        PongService,
        Server,
        MatchmakingService,
        MatchService,
        PlayerService,
        PracticeMatchService,
    ],
})
export class PongModule {}
