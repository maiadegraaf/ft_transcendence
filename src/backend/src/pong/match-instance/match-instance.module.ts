import { Module } from '@nestjs/common';
import { MatchInstance } from './match-instance.service';

@Module({
    providers: [MatchInstance],
})
export class MatchInstanceModule {}
