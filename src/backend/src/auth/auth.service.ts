import { Injectable } from '@nestjs/common';
import { UserService } from '../user/services/user/user.service';
import { CreateUserDto } from '../user/dtos/CreateUser.dto';
import { User } from '../user/user.entity';
import axios from 'axios';

@Injectable()
export class AuthService {
    constructor(private userService: UserService) {}

    async validateUser(accessToken: any, id: any): Promise<boolean> {
        const config = {
            headers: {
                Authorization: 'Bearer ' + accessToken,
            },
        };
        let id_to_ckeck;
        await axios
            .get('https://api.intra.42.fr/v2/me', config)
            .then((response) => {
                id_to_ckeck = response.data.id;
            })
            .catch((error) => {
                console.error(error);
            });
        if (id_to_ckeck == id) return true;
        else return false;
    }

    async validateUserByAccessToken(accessToken: any): Promise<User> {
        let id_from_42;
        const config = {
            headers: {
                Authorization: 'Bearer ' + accessToken,
            },
        };
        await axios
            .get('https://api.intra.42.fr/v2/me', config)
            .then((response) => {
                id_from_42 = response.data.id;
            })
            .catch((error) => {
                console.error(error);
            });
        const user = await this.userService.findUserByID(id_from_42);
        if (user) return user;
        else return null;
    }

    serializeUser(
        user: any,
        done: (err: Error | null, user: any) => void,
    ): any {
        done(null, user.id);
    }

    async deserializeUser(
        userId: number,
        done: (err: Error | null, payload: any) => void,
    ): Promise<any> {
        const user = await this.userService.findUserByID(userId);
        done(null, user);
    }
}
