import { AppDataSource } from '../config/database';
import { Pai } from '../entities/Pai';
import { Area } from '../entities/Area';

jest.mock('../config/database', () => ({
  AppDataSource: {
    getRepository: jest.fn(),
  },
}));

const mockPaiRepo = {
  findOne: jest.fn(),
  findOneBy: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};

const mockAreaRepo = {
  create: jest.fn(),
  save: jest.fn(),
};

(AppDataSource.getRepository as jest.Mock).mockImplementation((entity: any) => {
  if (entity === Pai) return mockPaiRepo;
  if (entity === Area) return mockAreaRepo;
});

const { paiService } = require('../services/pai.service');

describe('paiService', () => {

  beforeEach(() => {
    jest.clearAllMocks();
    (AppDataSource.getRepository as jest.Mock).mockImplementation((entity: any) => {
      if (entity === Pai) return mockPaiRepo;
      if (entity === Area) return mockAreaRepo;
    });
  });

  describe('cambiarEstado', () => {

    it('debe lanzar error con estado no válido', async () => {
      mockPaiRepo.findOneBy.mockResolvedValue({ id: 1, estado: 'borrador' });

      await expect(
        paiService.cambiarEstado(1, { estado: 'inventado' })
      ).rejects.toThrow('Estado no válido');
    });

    it('debe cambiar estado correctamente', async () => {
      mockPaiRepo.findOneBy.mockResolvedValue({ id: 1, estado: 'borrador' });
      mockPaiRepo.save.mockImplementation((obj: any) => Promise.resolve(obj));

      const result = await paiService.cambiarEstado(1, { estado: 'activo' });
      expect(result.estado).toBe('activo');
    });

    it('debe lanzar error si PAI no existe', async () => {
      mockPaiRepo.findOneBy.mockResolvedValue(null);

      await expect(
        paiService.cambiarEstado(999, { estado: 'activo' })
      ).rejects.toThrow('PAI no encontrado');
    });

  });

});