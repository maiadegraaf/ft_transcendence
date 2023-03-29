import { Injectable } from '@nestjs/common';
import { CreateUserParams } from 'src/utils/types';

import { UsersService } from '../users/services/users/users.service';

@Injectable()
export class AuthService {
  constructor(

      private readonly userService: UsersService
  ) {}

  async newUser(param: CreateUserParams): Promise<any> {
    await this.userService.createUser(param);
  }
}
