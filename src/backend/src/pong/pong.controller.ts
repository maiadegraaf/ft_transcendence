import { Controller, Post, Body } from '@nestjs/common';
import { PongService } from './pong.service';
import { JoinMatchDto } from '../dto/join-match.dto/join-match.dto';

@Controller('pong')
export class PongController {
  constructor(private readonly pongService: PongService) {}

}
