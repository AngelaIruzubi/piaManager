import { AppDataSource } from '../config/database';

jest.mock('../config/database', () => ({
  AppDataSource: {
    getRepository: jest.fn(),
  },
}));

const mockRepo = {
  findOneBy: jest.fn(),
  find: jest.fn(),
  countBy: jest.fn(),
  save: jest.fn(),
};

(AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepo);

const { usuarioService } = require('../services/usuario.service');

describe('usuarioService', () => {

  beforeEach(() => {
    jest.clearAllMocks();
    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepo);
    mockRepo.find.mockResolvedValue([]); // sin personas asignadas
    mockRepo.save.mockImplementation((u: any) => Promise.resolve(u));
  });

  describe('darDeBaja', () => {

    it('no permite darse de baja a uno mismo', async () => {
      await expect(
        usuarioService.darDeBaja(4, 4)
      ).rejects.toThrow('No puedes dar de baja tu propia cuenta');
    });

    it('no permite dar de baja al último coordinador activo', async () => {
      mockRepo.findOneBy.mockResolvedValue({ id: 2, rol: 'coordinador', activo: true });
      mockRepo.countBy.mockResolvedValue(1);

      await expect(
        usuarioService.darDeBaja(2, 4)
      ).rejects.toThrow('No se puede dar de baja al último coordinador activo');
    });

    it('permite dar de baja a un coordinador si quedan otros activos', async () => {
      mockRepo.findOneBy.mockResolvedValue({ id: 2, rol: 'coordinador', activo: true, password: 'hash' });
      mockRepo.countBy.mockResolvedValue(2);

      const result = await usuarioService.darDeBaja(2, 4);
      expect(result.activo).toBe(false);
      expect(result.password).toBeUndefined();
    });

    it('permite dar de baja a un educador sin personas asignadas', async () => {
      mockRepo.findOneBy.mockResolvedValue({ id: 3, rol: 'educador', activo: true, password: 'hash' });

      const result = await usuarioService.darDeBaja(3, 4);
      expect(result.activo).toBe(false);
      expect(result.fecha_baja).toBeDefined();
      expect(mockRepo.countBy).not.toHaveBeenCalled();
    });

  });

});
