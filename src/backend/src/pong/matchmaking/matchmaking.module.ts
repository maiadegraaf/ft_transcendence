import { Module } from '@nestjs/common';
import { MatchmakingService } from './matchmaking.service';
import { Matchmaking } from './matchmaking.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        TypeOrmModule.forFeature([Matchmaking]),
    ],
    controllers: [],
    providers: [MatchmakingService],
})
export class MatchmakingModule {}
