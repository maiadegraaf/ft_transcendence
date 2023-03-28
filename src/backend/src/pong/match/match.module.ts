import { Module } from '@nestjs/common';
import { Match } from './match.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchService } from './match.service';

@Module({
    imports: [TypeOrmModule.forFeature([Match])],
    providers: [MatchService],
})
export class MatchModule {}
