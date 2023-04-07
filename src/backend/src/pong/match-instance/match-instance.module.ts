import { Module } from '@nestjs/common';
import { MatchInstance } from './match-instance';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from '../match/match.entity';
import { MatchModule } from '../match/match.module';
import { Server } from 'socket.io';
import { MatchService } from '../match/match.service';

@Module({
    imports: [MatchModule, TypeOrmModule.forFeature([Match])],
    providers: [MatchInstance, Server, Match, MatchService],
})
export class MatchInstanceModule {}
