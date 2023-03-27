import { Module } from '@nestjs/common';
import { Server } from 'socket.io';
import { PongGateway } from './gateway/pong.gateway';
import { PongController } from './pong.controller';
import { PongService } from './pong.service';
import { MatchService } from './match/match.service';

@Module({
    imports: [],
    controllers: [PongController],
    providers: [PongGateway, PongService, Server, MatchService],
})
export class PongModule {}
