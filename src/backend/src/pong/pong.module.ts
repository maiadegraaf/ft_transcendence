import { Module } from '@nestjs/common';
import { PongGateway } from './gateway/pong.gateway';

@Module({
  imports: [],
  controllers: [],
  providers: [PongGateway],
})
export class PongModule {}
