import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule} from '@nestjs/serve-static'; // New
import { join } from 'path'; // New
import { EventsGateway } from './events/events.gateway';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    DatabaseModule,
    ServeStaticModule.forRoot({ // New
      rootPath: join(__dirname, '../..', '../frontend/dist'), // New
    }),
  ],
  controllers: [AppController],
  providers: [AppService, EventsGateway],
})
export class AppModule {}
