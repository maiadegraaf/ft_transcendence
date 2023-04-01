import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from '../entities/channel.entity';
// import { User } from '../../user/user.entity';
import { UserService } from '../../user/services/user/user.service';
// import { ChannelEnum } from '../../utils/types';
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
    const groupProfile = new GroupProfile();
    const groupOwner = await this.userService.findUserByID(ownerId);
    if (!groupProfile.admin.push(groupOwner)) {
      throw new InternalServerErrorException(
        'Could not add gorup admin to group',
      );
    }
    groupProfile.owner = groupOwner;
    groupProfile.name = groupName;
    groupProfile.channel = channel;
    return await this.groupProfileRepository.save(groupProfile);
  }
}
