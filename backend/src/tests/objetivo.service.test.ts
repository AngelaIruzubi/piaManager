import { AppDataSource } from '../config/database';
import { Objetivo } from '../entities/Objetivo';

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
  remove: jest.fn(),
};

(AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepo);

// Importamos el servicio DESPUÉS de configurar el mock
const { objetivoService } = require('../services/objetivo.service');

describe('objetivoService', () => {

  beforeEach(() => {
    jest.clearAllMocks();
    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepo);
  });

  describe('cambiarEstado', () => {

    it('debe cambiar estado de pendiente a en_proceso', async () => {
      mockRepo.findOneBy.mockResolvedValue({ id: 1, estado: 'pendiente' });
      mockRepo.save.mockResolvedValue({ id: 1, estado: 'en_proceso' });

      const result = await objetivoService.cambiarEstado(1, { estado: 'en_proceso' });
      expect(result.estado).toBe('en_proceso');
    });

    it('debe lanzar error si objetivo conseguido vuelve a pendiente', async () => {
      mockRepo.findOneBy.mockResolvedValue({ id: 1, estado: 'conseguido' });

      await expect(
        objetivoService.cambiarEstado(1, { estado: 'pendiente' })
      ).rejects.toThrow('No se puede revertir un objetivo conseguido');
    });

    it('debe lanzar error con estado no válido', async () => {
      mockRepo.findOneBy.mockResolvedValue({ id: 1, estado: 'pendiente' });

      await expect(
        objetivoService.cambiarEstado(1, { estado: 'inventado' })
      ).rejects.toThrow('Estado no válido');
    });

    it('debe guardar fecha_consecucion al marcar como conseguido', async () => {
      mockRepo.findOneBy.mockResolvedValue({ id: 1, estado: 'en_proceso' });
      mockRepo.save.mockImplementation((obj: any) => Promise.resolve(obj));

      const result = await objetivoService.cambiarEstado(1, { estado: 'conseguido' });
      expect(result.fecha_consecucion).toBeDefined();
    });

    it('debe lanzar error si objetivo no existe', async () => {
      mockRepo.findOneBy.mockResolvedValue(null);

      await expect(
        objetivoService.cambiarEstado(999, { estado: 'en_proceso' })
      ).rejects.toThrow('Objetivo no encontrado');
    });

  });

  describe('eliminar', () => {

    it('debe eliminar objetivo no conseguido', async () => {
      mockRepo.findOneBy.mockResolvedValue({ id: 1, estado: 'pendiente' });
      mockRepo.remove.mockResolvedValue({});

      const result = await objetivoService.eliminar(1);
      expect(result.mensaje).toBe('Objetivo eliminado correctamente');
    });

    it('no debe eliminar objetivo conseguido', async () => {
      mockRepo.findOneBy.mockResolvedValue({ id: 1, estado: 'conseguido' });

      await expect(
        objetivoService.eliminar(1)
      ).rejects.toThrow('No se puede eliminar un objetivo conseguido');
    });

  });

  describe('crear', () => {

    it('debe lanzar error con plazo no válido', async () => {
      await expect(
        objetivoService.crear(1, { descripcion: 'Test', plazo: 'inventado' })
      ).rejects.toThrow('Plazo no válido');
    });

    it('debe crear objetivo con plazo válido', async () => {
      mockRepo.create.mockReturnValue({ descripcion: 'Test', plazo: 'corto', estado: 'pendiente' });
      mockRepo.save.mockResolvedValue({ id: 1, descripcion: 'Test', plazo: 'corto', estado: 'pendiente' });

      const result = await objetivoService.crear(1, { descripcion: 'Test', plazo: 'corto' });
      expect(result.estado).toBe('pendiente');
      expect(result.plazo).toBe('corto');
    });

  });

});