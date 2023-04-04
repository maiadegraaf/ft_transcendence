import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from '../entities/channel.entity';
// import { User } from '../../users/entities/users.entity';
import { UserService } from '../../user/services/user/user.service';
import { GroupProfile } from '../entities/groupProfile.entity';

@Injectable()
export class GroupProfileService {
  constructor(
    @InjectRepository(GroupProfile)
    private readonly groupProfileRepository: Repository<GroupProfile>,
    private readonly userService: UserService,
  ) {}

  async createGroupProfile(
    ownerId: number,
    groupName: string,
    channel: Channel,
  ): Promise<GroupProfile> {
    try {
      const groupProfile = new GroupProfile();
      const groupOwner = await this.userService.findUserByID(ownerId);
      if (!groupProfile.admin.push(groupOwner)) {
        throw new HttpException(
          'Could not add gorup admin to group',
          HttpStatus.FORBIDDEN,
        );
      }
      groupProfile.owner = groupOwner;
      groupProfile.name = groupName;
      groupProfile.channel = channel;
      return await this.groupProfileRepository.save(groupProfile);
    } catch {}
  }
}
