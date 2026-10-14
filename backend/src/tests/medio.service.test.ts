import { AppDataSource } from '../config/database';

jest.mock('../config/database', () => ({
  AppDataSource: {
    getRepository: jest.fn(),
  },
}));

const mockRepo = {
  find: jest.fn(),
  findOneBy: jest.fn(),
  create: jest.fn((datos: any) => datos),
  save: jest.fn((medio: any) => Promise.resolve(medio)),
  remove: jest.fn(),
};

(AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepo);

const { medioService } = require('../services/medio.service');
const { catalogoService } = require('../services/catalogo.service');

describe('medioService', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('crea un medio con un tipo del catálogo', async () => {
    const result = await medioService.crear(5, { tipo: 'adaptacion', descripcion: 'Ropa ordenada por días' });
    expect(result.tipo).toBe('adaptacion');
    expect(result.objetivo).toEqual({ id: 5 });
  });

  it('rechaza un tipo que no está en el catálogo', async () => {
    await expect(
      medioService.crear(5, { tipo: 'adaptacion_entorno', descripcion: 'x' })
    ).rejects.toThrow('Tipo no válido');
  });

  it('al editar sin responsable, lo borra (PUT reemplaza el medio)', async () => {
    mockRepo.findOneBy.mockResolvedValue({ id: 1, tipo: 'persona_apoyo', descripcion: 'Apoyo verbal', responsable: 'Pedro' });

    const result = await medioService.actualizar(1, { tipo: 'persona_apoyo', descripcion: 'Apoyo verbal' });
    expect(result.responsable).toBeNull();
  });

  it('al editar con responsable, lo actualiza', async () => {
    mockRepo.findOneBy.mockResolvedValue({ id: 1, tipo: 'persona_apoyo', descripcion: 'Apoyo verbal', responsable: 'Pedro' });

    const result = await medioService.actualizar(1, { tipo: 'persona_apoyo', descripcion: 'Apoyo verbal', responsable: 'Paca' });
    expect(result.responsable).toBe('Paca');
  });

});

describe('catalogoService', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('devuelve código y descripción de los valores activos del tipo pedido', async () => {
    mockRepo.find.mockResolvedValue([
      { id: 15, tipo: 'TIPO_MEDIO', codigo: 'material', descripcion: 'Material', activo: true, created_at: new Date() },
      { id: 18, tipo: 'TIPO_MEDIO', codigo: 'adaptacion', descripcion: 'Adaptación del entorno', activo: true, created_at: new Date() },
    ]);

    const result = await catalogoService.getByTipo('tipo_medio');

    expect(mockRepo.find).toHaveBeenCalledWith(expect.objectContaining({
      where: { tipo: 'TIPO_MEDIO', activo: true }
    }));
    expect(result).toEqual([
      { codigo: 'material', descripcion: 'Material' },
      { codigo: 'adaptacion', descripcion: 'Adaptación del entorno' },
    ]);
  });

});
