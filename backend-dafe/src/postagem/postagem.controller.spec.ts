import { Test, TestingModule } from '@nestjs/testing';
import { PostagemController } from './postagem.controller';

describe('PostagemController', () => {
  let controller: PostagemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostagemController],
    }).compile();

    controller = module.get<PostagemController>(PostagemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
