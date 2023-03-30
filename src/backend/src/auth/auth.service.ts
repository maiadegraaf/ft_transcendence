import { Injectable } from '@nestjs/common';
import { UserService } from '../user/services/user/user.service';
import { CreateUserDto } from '../user/dtos/CreateUser.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  static async validateUser(profile: any) {
    // Implement user validation logic here
    return {
      id: profile._json.id,
      login: profile._json.login,
      email: profile._json.email,
    };
  }

  async newUser(id: number, login: string, email: string): Promise<any> {
    await this.userService.findOrCreateUser(id, login, email);
  }
}
