import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  WebSocketGateway,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { TmpLogin } from './tmplogin.decorator';
import { UserService } from '../user/user.service';
import { Logger} from '@nestjs/common'

@WebSocketGateway()
export class TmploginGateway {
  @WebSocketServer() server: Server;

  constructor(private tmpLogin: UserService) {}
  private logger: Logger = new Logger('TmploginGateway');

  @UseGuards(AuthGuard('jwt'))
  @SubscribeMessage('login')
  async handleLogin(
    @ConnectedSocket() client: Socket,
    @TmpLogin() user: { username: string },
  ) {
    this.logger.log(`User ${user.username} trying to connect to socket ${client.id}`);
    const dbUser = await this.tmpLogin.findOne(user.username);
    if (!dbUser) {
      return;
    }

    client.data.user = dbUser;
    console.log(`User ${dbUser.username} connected to socket ${client.id}`);

    client.emit('redirect', '/pong');
  }

  @UseGuards(AuthGuard('jwt'))
  @SubscribeMessage('logout')
  handleLogout(@ConnectedSocket() client: Socket) {
    const user = client.data.user;
    console.log(`User ${user.username} disconnected from socket ${client.id}`);
    client.disconnect();
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }
}
