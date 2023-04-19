import { Module } from '@nestjs/common';
import { PracticeMatchService } from './practice-match.service';
import { PracticeMatchEntity } from './practice-match.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PracticeMatch } from './practice-match';

@Module({
    imports: [TypeOrmModule.forFeature([PracticeMatchEntity])],
    providers: [PracticeMatch, PracticeMatchService],
})
export class PracticeMatchModule {}
