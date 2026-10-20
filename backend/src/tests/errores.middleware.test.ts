import { manejadorErrores, rutaNoEncontrada, paraLog } from '../middlewares/errores.middleware';
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

describe('paraLog (contra log injection)', () => {

  it('cambia los saltos de línea por espacios para que no se puedan inventar líneas en el log', () => {
    const malicioso = '/api/personas\n✅ Login correcto del usuario admin';
    expect(paraLog(malicioso)).not.toContain('\n');
    expect(paraLog(malicioso)).toBe('/api/personas ✅ Login correcto del usuario admin');
  });

  it('limpia también retornos de carro y tabuladores', () => {
    expect(paraLog('a\r\nb\tc')).toBe('a  b c');
  });

  it('recorta los textos muy largos', () => {
    expect(paraLog('x'.repeat(1000))).toHaveLength(300);
  });

  it('deja intacto un texto normal', () => {
    expect(paraLog('/api/objetivos/5?campo=valor')).toBe('/api/objetivos/5?campo=valor');
  });

  it('el manejador escribe en el log la URL ya limpia', () => {
    const consola = jest.spyOn(console, 'error').mockImplementation(() => {});
    const reqMaliciosa: any = { method: 'GET', originalUrl: '/api/x\nLínea falsa' };

    manejadorErrores(new Error('fallo'), reqMaliciosa, crearRes(), jest.fn());

    expect(consola.mock.calls[0][0]).toBe('❌ Error en GET /api/x Línea falsa:');
    consola.mockRestore();
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
