// src/websocket/websocket.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppWebSocketGateway } from './websocket.gateway';

@Module({
  imports: [ConfigModule],
  providers: [AppWebSocketGateway],
  exports: [AppWebSocketGateway],
})
export class WebSocketModule {}
