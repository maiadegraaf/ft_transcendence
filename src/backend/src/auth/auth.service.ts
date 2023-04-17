import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AuthService {
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
}
