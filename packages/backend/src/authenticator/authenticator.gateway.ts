import { Logger } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server } from 'socket.io';
import { Roles } from '@auth/decorators/DiscordRoleDecorator.decorator';
// import type { Server } from 'ws';

@WebSocketGateway({
  cors: {
    origin: ['*'],
  },
})
export class AuthenticatorGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger = new Logger(AuthenticatorGateway.name);

  afterInit() {
    this.logger.debug(`Started`);
  }
  handleConnection() {
    this.logger.debug(`Client Connected`);
  }
  handleDisconnect() {
    this.logger.debug(`Client Disconnected`);
  }

  @WebSocketServer()
  server: Server;

  @Roles(['MENTOR'])
  @SubscribeMessage('events')
  findAll(): Observable<WsResponse<number>> {
    return from([1, 2, 3]).pipe(
      map((item) => ({ event: 'events', data: item })),
    );
  }

  @SubscribeMessage('identity')
  async identity(@MessageBody() data: number): Promise<number> {
    return data;
  }
}
