import { IsInt, IsNotEmpty, IsNumber } from 'class-validator'
import { User } from 'src/user/user.entity'

export class JoinMatchDto {
    @IsNotEmpty()
    @IsNumber()
    @IsInt()
    readonly matchId: number

    @IsNotEmpty()
    readonly player1: User

    @IsNotEmpty()
    readonly player2: User

    @IsNotEmpty()
    @IsNumber()
    @IsInt()
    readonly score1: number

    @IsNotEmpty()
    @IsNumber()
    @IsInt()
    readonly score2: number
}
