import { Test, TestingModule } from '@nestjs/testing';
import { TmploginGateway } from './tmplogin.gateway';

describe('TmploginGateway', () => {
  let gateway: TmploginGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TmploginGateway],
    }).compile();

    gateway = module.get<TmploginGateway>(TmploginGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
