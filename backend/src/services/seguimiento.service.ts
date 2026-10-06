import { AppDataSource } from '../config/database';
import { Seguimiento } from '../entities/Seguimiento';
import { CrearSeguimientoDto, ActualizarSeguimientoDto } from '../dtos/seguimiento.dto';

const repo = AppDataSource.getRepository(Seguimiento);

export const seguimientoService = {

  async getByObjetivo(objetivoId: number) {
    return await repo.find({
      where: { objetivo: { id: objetivoId } },
      relations: { registrado_por: true },
      order: { fecha: 'DESC' }
    });
  },

  async crear(objetivoId: number, data: CrearSeguimientoDto, usuarioId: number) {
    if (data.porcentaje_logro < 0 || data.porcentaje_logro > 100) {
      throw new Error('El porcentaje debe estar entre 0 y 100');
    }

    const seguimiento = repo.create({
      objetivo: { id: objetivoId } as any,
      registrado_por: { id: usuarioId } as any,
      fecha: new Date(data.fecha),
      porcentaje_logro: data.porcentaje_logro,
      observacion: data.observacion,
    });
    return await repo.save(seguimiento);
  },
  async actualizar(id: number, data: ActualizarSeguimientoDto) {
  const seguimiento = await repo.findOneBy({ id });
  if (!seguimiento) throw new Error('Seguimiento no encontrado');

  if (data.porcentaje_logro !== undefined) {
    if (data.porcentaje_logro < 0 || data.porcentaje_logro > 100) {
      throw new Error('El porcentaje debe estar entre 0 y 100');
    }
  }

  Object.assign(seguimiento, {
    ...data,
    fecha: data.fecha ? new Date(data.fecha) : seguimiento.fecha
  });

  return await repo.save(seguimiento);
}
};