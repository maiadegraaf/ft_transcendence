import { Test, TestingModule } from '@nestjs/testing';
import { TmploginService } from './tmplogin.service';

describe('TmploginService', () => {
  let service: TmploginService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TmploginService],
    }).compile();

    service = module.get<TmploginService>(TmploginService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
