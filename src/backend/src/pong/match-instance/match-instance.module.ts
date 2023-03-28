import { Module } from '@nestjs/common';
import { MatchInstance } from './match-instance.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from '../match/match.entity';
import { MatchModule } from '../match/match.module';
import { Server } from 'socket.io';

@Module({
    imports: [MatchModule, TypeOrmModule.forFeature([Match])],
    providers: [MatchInstance, Server, Match],
})
export class MatchInstanceModule {}
