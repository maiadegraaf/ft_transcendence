import { HttpException, HttpStatus, Injectable, StreamableFile } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { readFile } from "fs/promises";
import { Avatar } from "src/user/avatar.entity";
import { User } from "src/user/user.entity";
import { Repository } from "typeorm";
import { Readable } from "typeorm/platform/PlatformTools";

@Injectable()
export class AvatarService {
    constructor(
        @InjectRepository(Avatar)
        private avatarRepository: Repository<Avatar>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    async createAvatar(filename: string, data: Buffer, user: User): Promise<Avatar> {
        const avatar = this.avatarRepository.create({ filename, data, user });
        // try {
        await this.avatarRepository.save(avatar);
        // } catch (error) {
        //     throw new HttpException(error.message, HttpStatus.BAD_REQUEST);;
        // }
        return avatar;
    }

    async   createDefaultAvatar(user: User): Promise<Avatar> {
        const defaultImageBuffer = await readFile('src/user/default_avatar.png');
        const avatar = this.avatarRepository.create({ filename: 'defaultAvatar.png', data: defaultImageBuffer, user });
        return this.avatarRepository.save(avatar);
    }


    // async deleteAvatar(avatar: Avatar): Promise<void> {
    //     try {
    //         await this.avatarRepository.delete(avatar.id);
    //     } catch (error) {
    //         throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    //     }
    // }

    async deleteAvatar(avatar: Avatar): Promise<void> {
        try {
            const user = await this.userRepository.findOne({ where: { avatar: avatar } });
            if (user) {
                user.avatar = null;
                await this.userRepository.save(user);
            }
            await this.avatarRepository.delete(avatar.id);
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    toStreamableFile(data: Buffer): StreamableFile{
        return new StreamableFile(Readable.from(data));
    }

}
