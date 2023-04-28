import { Module } from '@nestjs/common';
import { MatchInstance } from './match-instance';
import { Server } from 'socket.io';
import { Match } from './match';
import { Matches } from './match.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchController } from './match.controller';
import { MatchService } from './match.service';
import { User } from '../../user/user.entity';
import { UserService } from '../../user/services/user/user.service';
import { AvatarService } from 'src/user/services/user/avatar.service';
import { Avatar } from 'src/user/avatar.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Matches]),
        TypeOrmModule.forFeature([User]),
        TypeOrmModule.forFeature([Avatar]),
    ],
    providers: [
        MatchInstance,
        Server,
        Match,
        MatchService,
        UserService,
        AvatarService,
    ],
    controllers: [MatchController],
})
export class MatchInstanceModule {}
