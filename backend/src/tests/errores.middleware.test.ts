import { manejadorErrores, rutaNoEncontrada } from '../middlewares/errores.middleware';
import {
  BadRequestError, UnauthorizedError, ForbiddenError,
  NotFoundError, ConflictError, BadGatewayError
} from '../errors';

function crearRes() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as any;
}

const req: any = { method: 'GET', originalUrl: '/api/prueba' };

describe('manejadorErrores', () => {

  it.each([
    [new BadRequestError('Estado no válido'), 400],
    [new UnauthorizedError('Credenciales incorrectas'), 401],
    [new ForbiddenError('No puedes dar de baja tu propia cuenta'), 403],
    [new NotFoundError('PAI no encontrado'), 404],
    [new ConflictError('Ya existe un PAI para ese año'), 409],
    [new BadGatewayError('Error al buscar pictogramas'), 502],
  ])('responde %s con su código %i y su mensaje', (error, codigo) => {
    const res = crearRes();
    manejadorErrores(error, req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(codigo);
    expect(res.json).toHaveBeenCalledWith({ mensaje: error.message });
  });

  it('oculta los detalles de un error inesperado tras un 500', () => {
    const res = crearRes();
    const consola = jest.spyOn(console, 'error').mockImplementation(() => {});

    manejadorErrores(new Error('relation "usuarios" does not exist'), req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ mensaje: 'Error interno del servidor' });
    expect(consola).toHaveBeenCalled(); // queda registrado en el servidor
    consola.mockRestore();
  });

  it('traduce una clave foránea rota de PostgreSQL a 404', () => {
    const res = crearRes();
    manejadorErrores({ driverError: { code: '23503' } }, req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ mensaje: 'El elemento relacionado no existe' });
  });

  it('traduce un valor duplicado de PostgreSQL a 409', () => {
    const res = crearRes();
    manejadorErrores({ driverError: { code: '23505' } }, req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(409);
  });

  it('responde 400 si el body no es un JSON válido', () => {
    const res = crearRes();
    manejadorErrores({ type: 'entity.parse.failed' }, req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(400);
  });

});

describe('rutaNoEncontrada', () => {

  it('responde 404 indicando la ruta', () => {
    const res = crearRes();
    rutaNoEncontrada(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json.mock.calls[0][0].mensaje).toContain('GET /api/prueba');
  });

});
