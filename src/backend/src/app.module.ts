import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static'; // New
import { join } from 'path'; // New
import { ChatModule } from './chat/chat.module';
import { PongModule } from './pong/pong.module';
import { DatabaseModule } from './database/database.module';
import { TmploginModule } from './tmplogin/tmplogin.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { User } from './user/entities/user.entity';
import { AuthService } from './auth/auth.service';
import { LocalStrategy } from './auth/local.strategy';
import { JwtStrategy } from './auth/jwt.strategy';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { ApiModule } from './api/api.module';

@Module({
  imports: [
    DatabaseModule,
    ChatModule,
    PongModule,
    ServeStaticModule.forRoot({
      // New
      rootPath: join(__dirname, '../..', '../frontend/dist'), // New
    }),
    TmploginModule,
    AuthModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: 'secret',
      signOptions: { expiresIn: '1h' },
    }),
    PassportModule,
    UserModule,
    ApiModule,
  ],
  controllers: [AppController],
  providers: [AppService, UserService, AuthService, LocalStrategy, JwtStrategy],
})
export class AppModule {}
