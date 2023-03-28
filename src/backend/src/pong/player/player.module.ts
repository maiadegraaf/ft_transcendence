import { Module } from '@nestjs/common';
import { PlayerService } from './player.service';
import { Player } from './player.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([Player])],
    providers: [PlayerService],
})
export class PlayerModule {}
