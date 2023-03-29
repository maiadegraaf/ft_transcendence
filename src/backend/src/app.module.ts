import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { User } from './typeorm/entities/User';
import { UserModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
// import { Profile } from './typeorm/entities/Profile';
// import { Post } from './typeorm/entities/Post';
// import { ChatModule } from './chat/chat.module';
// import { PongModule } from './pong/pong.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'pongmaster',
      password: 'ping_pong42',
      database: 'transcendence',
      // entities: [User, Profile, Post],
      entities: [User],
      synchronize: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', './frontend/dist'),
    }),
    UserModule,
    AuthModule,
    //PongModule,
    //ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
