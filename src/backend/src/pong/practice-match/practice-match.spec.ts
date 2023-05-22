import { Test, TestingModule } from '@nestjs/testing'
import { PracticeMatch } from './practice-match'

describe('PracticeMatchService', () => {
    let service: PracticeMatch

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [PracticeMatch]
        }).compile()

        service = module.get<PracticeMatch>(PracticeMatch)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })
})
