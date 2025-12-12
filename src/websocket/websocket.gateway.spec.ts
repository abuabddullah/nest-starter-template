import { Test, TestingModule } from '@nestjs/testing';
import { AppWebSocketGateway } from './websocket.gateway';

describe('WebsocketGateway', () => {
  let gateway: AppWebSocketGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppWebSocketGateway],
    }).compile();

    gateway = module.get<AppWebSocketGateway>(AppWebSocketGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
