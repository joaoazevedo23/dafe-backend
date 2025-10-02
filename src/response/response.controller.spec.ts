import { Test, TestingModule } from '@nestjs/testing';
import { ResponseController } from './response.controller';
import { ResponseService } from './response.service';

describe('ResponseController', () => { 
let controller: ResponseController;

  beforeEach(async () => {
const module: TestingModule = await Test.createTestingModule({
 controllers: [ResponseController], 
 providers: [ResponseService],      
 }).compile();

controller = module.get<ResponseController>(ResponseController);});
 it('should be defined', () => {
expect(controller).toBeDefined();
 });
});