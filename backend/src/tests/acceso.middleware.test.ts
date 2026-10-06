import { AppDataSource } from '../config/database';

jest.mock('../config/database', () => ({
  AppDataSource: {
    getRepository: jest.fn(),
  },
}));

const mockRepo = {
  findOne: jest.fn(),
};

(AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepo);

const {
  accesoPersona, personaPorId, personaDeObjetivo
} = require('../middlewares/acceso.middleware');

// Simula una petición de un usuario pasando por el middleware
async function ejecutar(middleware: any, usuario: any, params: any) {
  const req: any = { usuario, params };
  const res: any = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  const next = jest.fn();

  await middleware(req, res, next);
  return { res, next };
}

const coordinadora = { id: 4, rol: 'coordinador' };
const educadora = { id: 6, rol: 'educador' };

describe('accesoPersona', () => {

  beforeEach(() => {
    jest.clearAllMocks();
    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepo);
  });

  it('deja pasar a coordinación sin consultar la base de datos', async () => {
    const { next } = await ejecutar(accesoPersona(personaPorId('id')), coordinadora, { id: '1' });
    expect(next).toHaveBeenCalled();
    expect(mockRepo.findOne).not.toHaveBeenCalled();
  });

  it('deja pasar a un educador con una persona suya', async () => {
    mockRepo.findOne.mockResolvedValue({ id: 1, profesional_referencia: { id: 6 } });

    const { next, res } = await ejecutar(accesoPersona(personaPorId('id')), educadora, { id: '1' });
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('rechaza con 403 a un educador con una persona ajena', async () => {
    mockRepo.findOne.mockResolvedValue({ id: 1, profesional_referencia: { id: 2 } });

    const { next, res } = await ejecutar(accesoPersona(personaPorId('id')), educadora, { id: '1' });
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it('responde 404 si la persona no existe', async () => {
    mockRepo.findOne.mockResolvedValue(null);

    const { next, res } = await ejecutar(accesoPersona(personaPorId('id')), educadora, { id: '999' });
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('responde 404 con un id que no es un número, sin consultar la base de datos', async () => {
    const { res } = await ejecutar(accesoPersona(personaPorId('id')), educadora, { id: 'abc' });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(mockRepo.findOne).not.toHaveBeenCalled();
  });

  it('sube desde el objetivo hasta la persona para decidir', async () => {
    mockRepo.findOne.mockResolvedValue({
      id: 5,
      area: { pai: { persona: { id: 1, profesional_referencia: { id: 2 } } } }
    });

    const { res } = await ejecutar(accesoPersona(personaDeObjetivo('id')), educadora, { id: '5' });
    expect(res.status).toHaveBeenCalledWith(403);
  });

});
