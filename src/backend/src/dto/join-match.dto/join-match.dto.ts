import { IsNotEmpty, IsNumber } from 'class-validator';
import { User } from 'src/users/entities/users.entity';

export class JoinMatchDto {
  @IsNotEmpty()
  @IsNumber()
  readonly matchId: number;

  @IsNotEmpty()
  readonly player1: User;

  @IsNotEmpty()
  readonly player2: User;

  @IsNotEmpty()
  @IsNumber()
  readonly score1: number;

  @IsNotEmpty()
  @IsNumber()
  readonly score2: number;
}
