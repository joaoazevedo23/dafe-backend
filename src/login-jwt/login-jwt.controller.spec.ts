import { Test, TestingModule } from '@nestjs/testing';
import { LoginJwtController } from './login-jwt.controller';

describe('LoginJwtController', () => {
  let controller: LoginJwtController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoginJwtController],
    }).compile();

    controller = module.get<LoginJwtController>(LoginJwtController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
