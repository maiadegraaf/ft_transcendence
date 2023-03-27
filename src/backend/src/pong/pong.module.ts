import { Module } from '@nestjs/common';
import { Server } from 'socket.io';
import { PongGateway } from './gateway/pong.gateway';
import { PongController } from './pong.controller';
import { PongService } from './pong.service';
import { UserModule } from 'src/user/user.module';
import { MatchmakingModule } from './matchmaking/matchmaking.module';
import { MatchmakingService } from './matchmaking/matchmaking.service';
import { Matchmaking } from './matchmaking/matchmaking.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        UserModule,
        MatchmakingModule,
        TypeOrmModule.forFeature([Matchmaking]),
    ],
    controllers: [PongController],
    providers: [PongGateway, PongService, Server, MatchmakingService],
})
export class PongModule {}
