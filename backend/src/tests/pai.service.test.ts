import { AppDataSource } from '../config/database';
import { Pai } from '../entities/Pai';
import { Area } from '../entities/Area';

jest.mock('../config/database', () => ({
  AppDataSource: {
    getRepository: jest.fn(),
    transaction: jest.fn(),
  },
}));

// Simula el EntityManager que TypeORM pasa dentro de la transacción
const mockManager = {
  create: jest.fn((_entidad: any, datos: any) => datos),
  save: jest.fn(),
};

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
    // La transacción ejecuta el callback con el manager simulado
    (AppDataSource.transaction as jest.Mock).mockImplementation((callback: any) => callback(mockManager));
  });

  describe('crear', () => {

    const datos = { anio: 2026, fecha_inicio: '2026-01-01' };

    it('crea el PAI y sus 5 áreas dentro de una transacción', async () => {
      mockPaiRepo.findOne
        .mockResolvedValueOnce(null)                        // no existe PAI ese año
        .mockResolvedValueOnce({ id: 10, areas: [] });      // PAI creado que se devuelve
      mockManager.save.mockImplementation((obj: any) => Promise.resolve({ id: 10, ...obj }));

      const result = await paiService.crear(1, datos, 4);

      expect(AppDataSource.transaction).toHaveBeenCalledTimes(1);
      const areasCreadas = mockManager.create.mock.calls.filter(([entidad]) => entidad === Area);
      expect(areasCreadas.map(([, d]) => d.tipo))
        .toEqual(['autonomia', 'cognitiva', 'social', 'ocupacional', 'salud']);
      expect(result.id).toBe(10);
    });

    it('si falla al guardar un área, el error llega al usuario y no se devuelve un PAI a medias', async () => {
      mockPaiRepo.findOne.mockResolvedValueOnce(null);
      mockManager.save
        .mockResolvedValueOnce({ id: 10 })                  // PAI
        .mockResolvedValueOnce({})                          // área 1
        .mockRejectedValueOnce(new Error('conexión perdida')); // área 2 falla

      await expect(paiService.crear(1, datos, 4)).rejects.toThrow('conexión perdida');

      // Todo pasó por la transacción (PostgreSQL deshace lo anterior) y no se buscó el PAI creado
      expect(AppDataSource.transaction).toHaveBeenCalledTimes(1);
      expect(mockPaiRepo.findOne).toHaveBeenCalledTimes(1);
    });

    it('no crea nada si ya existe un PAI para ese año', async () => {
      mockPaiRepo.findOne.mockResolvedValueOnce({ id: 3 });

      await expect(paiService.crear(1, datos, 4)).rejects.toThrow('Ya existe un PAI para ese año');
      expect(AppDataSource.transaction).not.toHaveBeenCalled();
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