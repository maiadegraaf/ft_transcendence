import { Module } from '@nestjs/common';
import { MatchmakingController } from './matchmaking.controller';
import { MatchmakingService } from './matchmaking.service';
import { Matchmaking } from './matchmaking.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayerModule } from '../player/player.module';
import { Player } from '../player/player.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Matchmaking]),
        PlayerModule,
        TypeOrmModule.forFeature([Player]),
    ],
    controllers: [MatchmakingController],
    providers: [MatchmakingService],
})
export class MatchmakingModule {}
