// src/websocket/websocket.gateway.ts
import {
  WebSocketGateway as NestWebSocketGateway,
  WebSocketServer as NestWebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@NestWebSocketGateway({
  cors: {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    methods: ['GET', 'POST'],
  },
  pingTimeout: 60000,
})
export class AppWebSocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @NestWebSocketServer()
  server!: SocketIOServer;

  private readonly logger = new Logger(AppWebSocketGateway.name);

  afterInit() {
    this.logger.log('WebSocket server initialized');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  // Example method to emit events
  emitToRoom(room: string, event: string, data: unknown): void {
    this.server.to(room).emit(event, data);
  }

  // Example method to join a room
  joinRoom(client: Socket, room: string): void {
    void client.join(room);
  }
}
