import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersService } from './users.service'; //  Corrigido
import { User } from '../../models/user.schema'; //  Importado

// Descrevendo o teste para o serviço de usuários
describe('UsersService', () => { //  Corrigido
  let service: UsersService;
  let model: Model<User>;

  // Objeto mock com as funções que o serviço usa
  const mockUserModel = {
    find: jest.fn(),
    findById: jest.fn(),
    save: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService, //  Corrigido
        {
          //  Corrigido: Provendo o mock do Model<User>
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService); // Corrigido
    model = module.get<Model<User>>(getModelToken(User.name));
  });

  // Limpa os mocks após cada teste para garantir que os testes sejam independentes
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('o serviço deve estar definido', () => {
    expect(service).toBeDefined();
  });
  
  it('o modelo deve estar definido', () => {
    expect(model).toBeDefined();
  });

  // Aqui você pode adicionar mais testes para cada método do seu serviço
  // Exemplo:
  describe('findAll', () => {
    it('deve chamar o método find do modelo', async () => {
      // Configura o mock para retornar um valor quando 'find' for chamado
      mockUserModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce([]),
      } as any);

      await service.findAll();
      expect(model.find).toHaveBeenCalledWith({});
    });
  });
});