import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { UseGuards } from '@nestjs/common';
import { websocketGuard } from '../../auth/auth.guard';
import { Server } from 'socket.io';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
@UseGuards(websocketGuard)
export class GroupProfileGateway {
    @WebSocketServer()
    server: Server;
}
