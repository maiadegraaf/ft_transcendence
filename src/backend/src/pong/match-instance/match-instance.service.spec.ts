import { Test, TestingModule } from '@nestjs/testing';
import { MatchInstanceService } from './match-instance.service';

describe('MatchInstanceService', () => {
  let service: MatchInstanceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MatchInstanceService],
    }).compile();

    service = module.get<MatchInstanceService>(MatchInstanceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
