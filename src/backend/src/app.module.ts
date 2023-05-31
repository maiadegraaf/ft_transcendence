import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'
import { Message } from './chat/entities/message.entity'
import { User } from './user/user.entity'
import { Matches } from './pong/match/match.entity'
import { UserModule } from './user/user.module'
import { AuthModule } from './auth/auth.module'
import { Channel } from './chat/entities/channel.entity'
import { ChatModule } from './chat/chat.module'
import { PongModule } from './pong/pong.module'
import { GroupProfile } from './chat/entities/groupProfile.entity'
import { MatchInstanceModule } from './pong/match/match-instance.module'
import { Leaderboard } from './pong/leaderboard/leaderboard.entity'
import { LeaderboardModule } from './pong/leaderboard/leaderboard.module'
import { TwoFAModule } from './auth/2fa/2fa.module'
import { PassportModule } from '@nestjs/passport'
import { Avatar } from './user/avatar.entity'
import { MutedTime } from './chat/entities/mutedTime.enitity'
import { ConfigModule } from '@nestjs/config'

@Module({
    imports: [
        ConfigModule.forRoot(),
        PassportModule,
        TypeOrmModule.forRoot({
            type: process.env.TYPEORM_CONNECTION as any,
            host: process.env.TYPEORM_HOST,
            port: parseInt(process.env.TYPEORM_PORT, 10),
            username: process.env.TYPEORM_USERNAME,
            password: process.env.TYPEORM_PASSWORD,
            database: process.env.TYPEORM_DATABASE,
            entities: [
                User,
                Avatar,
                Leaderboard,
                Message,
                Channel,
                GroupProfile,
                Matches,
                MutedTime
            ],
            synchronize: true
        }),
        MatchInstanceModule,
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '../..', './frontend/dist')
        }),
        UserModule,
        PongModule,
        ChatModule,
        AuthModule,
        LeaderboardModule,
        TwoFAModule
    ],
})
export class AppModule {}
