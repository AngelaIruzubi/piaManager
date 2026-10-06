import 'reflect-metadata';
import { validarDto } from '../middlewares/validar.middleware';
import { ActualizarObjetivoDto, CrearObjetivoDto } from '../dtos/objetivo.dto';
import { CrearSeguimientoDto } from '../dtos/seguimiento.dto';
import { ActualizarUsuarioDto } from '../dtos/usuario.dto';
import { CrearPersonaDto } from '../dtos/personas.dto';

// Simula una petición pasando por el middleware y devuelve qué ha pasado
async function ejecutar(Dto: any, body: any) {
  const req: any = { body };
  const res: any = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  const next = jest.fn();

  await validarDto(Dto)(req, res, next);
  return { req, res, next };
}

describe('validarDto', () => {

  it('deja pasar datos válidos', async () => {
    const { next, res } = await ejecutar(CrearSeguimientoDto, {
      fecha: '2026-10-05', porcentaje_logro: 50, observacion: 'Avanza bien'
    });
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('rechaza con 400 un porcentaje mayor de 100', async () => {
    const { next, res } = await ejecutar(CrearSeguimientoDto, {
      fecha: '2026-10-05', porcentaje_logro: 150, observacion: 'Avanza bien'
    });
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json.mock.calls[0][0].mensaje).toContain('entre 0 y 100');
  });

  it('rechaza que se cuele el estado al editar un objetivo', async () => {
    const { next, res } = await ejecutar(ActualizarObjetivoDto, {
      descripcion: 'Nuevo texto', estado: 'pendiente'
    });
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('rechaza que se cambie la contraseña al editar un usuario', async () => {
    const { next, res } = await ejecutar(ActualizarUsuarioDto, {
      nombre: 'Ana', password: 'sin_cifrar'
    });
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('trata los campos opcionales vacíos como no enviados', async () => {
    const { next, req } = await ejecutar(CrearObjetivoDto, {
      descripcion: 'Poner la mesa', plazo: 'corto', fecha_inicio: '', fecha_prevista: ''
    });
    expect(next).toHaveBeenCalled();
    expect(req.body.fecha_inicio).toBeUndefined();
  });

  it('rechaza un campo obligatorio vacío', async () => {
    const { next, res } = await ejecutar(CrearObjetivoDto, {
      descripcion: '', plazo: 'corto'
    });
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('convierte a número el id que llega como texto desde un select', async () => {
    const { next, req } = await ejecutar(CrearPersonaDto, {
      nombre: 'Luis', apellidos: 'García', fecha_nacimiento: '1990-01-01',
      tutor_legal: 'Marta García', telefono_contacto: '600000000',
      profesional_referencia_id: '3', fecha_alta: '2026-01-01'
    });
    expect(next).toHaveBeenCalled();
    expect(req.body.profesional_referencia_id).toBe(3);
  });

});
