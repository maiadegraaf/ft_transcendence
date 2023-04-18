import { Module } from '@nestjs/common';
import { PracticeMatch } from './practice-match';
import { PracticeMatchInstance } from './practice-match-instance';

@Module({
    providers: [PracticeMatchInstance, PracticeMatch],
})
export class PracticeMatchModule {}
