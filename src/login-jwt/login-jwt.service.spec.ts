import { Test, TestingModule } from '@nestjs/testing';
import { LoginJwtService } from './login-jwt.service';

describe('LoginJwtService', () => {
  let service: LoginJwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoginJwtService],
    }).compile();

    service = module.get<LoginJwtService>(LoginJwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
