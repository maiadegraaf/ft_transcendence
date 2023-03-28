import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from 'src/pong/match/match.entity';
import { Avatar } from 'src/user/entities/avatar.entity';
import { User } from 'src/user/entities/user.entity';
import { Msg } from '../chat/entities/message.entity';
import { DmChannel } from '../chat/entities/dmchannel.entity';
import { Channel } from '../chat/entities/channel.entity';
import { Matchmaking } from '../pong/matchmaking/matchmaking.entity';
import { Player } from '../pong/player/player.entity';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'pongmaster',
            password: 'ping_pong42',
            database: 'transcendence',
            entities: [
                User,
                Avatar,
                Match,
                Msg,
                DmChannel,
                Channel,
                Matchmaking,
                Player,
            ],
            synchronize: true,
        }),
    ],
})
export class DatabaseModule {}
