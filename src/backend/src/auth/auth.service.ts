import { Injectable } from '@nestjs/common';
import { UserService } from '../user/services/user/user.service';
import { CreateUserDto } from '../user/dtos/CreateUser.dto';
import { User } from '../user/user.entity';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async validateUser(profile: any): Promise<User> {
    const user = this.userService.findOrCreateUser(
      profile.id,
      profile.email,
      profile.login,
    );
    return user;
  }
}
