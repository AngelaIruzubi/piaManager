import { AppDataSource } from '../config/database';

jest.mock('../config/database', () => ({
  AppDataSource: {
    getRepository: jest.fn(),
  },
}));

const mockRepo = {
  findOneBy: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  find: jest.fn(),
};

(AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepo);

const { seguimientoService } = require('../services/seguimiento.service');

describe('seguimientoService', () => {

  beforeEach(() => {
    jest.clearAllMocks();
    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepo);
  });

  describe('crear', () => {

    it('debe lanzar error si porcentaje es mayor de 100', async () => {
      await expect(
        seguimientoService.crear(1, {
          fecha: '2024-03-15',
          porcentaje_logro: 150,
          observacion: 'Test'
        }, 1)
      ).rejects.toThrow('El porcentaje debe estar entre 0 y 100');
    });

    it('debe lanzar error si porcentaje es negativo', async () => {
      await expect(
        seguimientoService.crear(1, {
          fecha: '2024-03-15',
          porcentaje_logro: -10,
          observacion: 'Test'
        }, 1)
      ).rejects.toThrow('El porcentaje debe estar entre 0 y 100');
    });

    it('debe crear seguimiento con porcentaje válido', async () => {
      mockRepo.create.mockReturnValue({
        porcentaje_logro: 75,
        observacion: 'Buena evolución'
      });
      mockRepo.save.mockResolvedValue({
        id: 1,
        porcentaje_logro: 75,
        observacion: 'Buena evolución'
      });

      const result = await seguimientoService.crear(1, {
        fecha: '2024-03-15',
        porcentaje_logro: 75,
        observacion: 'Buena evolución'
      }, 1);

      expect(result.porcentaje_logro).toBe(75);
    });

  });

});