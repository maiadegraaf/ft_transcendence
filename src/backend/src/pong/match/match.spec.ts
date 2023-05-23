import { Test, TestingModule } from '@nestjs/testing'
import { Match } from './match'

describe('MatchService', () => {
    let service: Match

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [Match]
        }).compile()

        service = module.get<Match>(Match)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })
})
