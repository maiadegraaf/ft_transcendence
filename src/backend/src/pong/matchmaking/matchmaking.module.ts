import { Module } from '@nestjs/common';
import { MatchmakingController } from './matchmaking.controller';
import { MatchmakingService } from './matchmaking.service';
import { Matchmaking } from './matchmaking.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([Matchmaking])],
    controllers: [MatchmakingController],
    providers: [MatchmakingService],
})
export class MatchmakingModule {}
