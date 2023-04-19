import { Test, TestingModule } from '@nestjs/testing';
import { PracticeMatchService } from './practice-match.service';

describe('PracticeMatchService', () => {
    let service: PracticeMatchService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [PracticeMatchService],
        }).compile();

        service = module.get<PracticeMatchService>(PracticeMatchService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
