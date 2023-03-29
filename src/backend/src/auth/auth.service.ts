import { Injectable } from '@nestjs/common';
import { CreateUserParams } from 'src/utils/types';

import { UsersService } from '../users/services/users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService) {}

  static async validateUser(profile: any) {
    // Implement user validation logic here
    return {
      id: profile._json.id,
      login: profile._json.login,
      email: profile._json.email,
    };
  }

  async newUser(param: CreateUserParams): Promise<any> {
    await this.userService.createUser(param);
  }
}
