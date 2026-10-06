import { BadRequestError, NotFoundError } from '../errors';
import { AppDataSource } from '../config/database';
import { Medio } from '../entities/Medio';
import { CrearMedioDto, ActualizarMedioDto, TIPOS_MEDIO } from '../dtos/medio.dto';

const repo = AppDataSource.getRepository(Medio);

export const medioService = {

  async getByObjetivo(objetivoId: number) {
    return await repo.find({
      where: { objetivo: { id: objetivoId } },
      order: { created_at: 'ASC' }
    });
  },

  async crear(objetivoId: number, data: CrearMedioDto) {
    if (!TIPOS_MEDIO.includes(data.tipo)) {
      throw new BadRequestError(`Tipo no válido. Usa: ${TIPOS_MEDIO.join(', ')}`);
    }

    const medio = repo.create({
      objetivo: { id: objetivoId } as any,
      tipo: data.tipo,
      descripcion: data.descripcion,
      responsable: data.responsable,
    });
    return await repo.save(medio);
  },

  async actualizar(id: number, data: ActualizarMedioDto) {
    const medio = await repo.findOneBy({ id });
    if (!medio) throw new NotFoundError('Medio no encontrado');
    Object.assign(medio, data);
    return await repo.save(medio);
  },

  async eliminar(id: number) {
    const medio = await repo.findOneBy({ id });
    if (!medio) throw new NotFoundError('Medio no encontrado');
    await repo.remove(medio);
    return { mensaje: 'Medio eliminado correctamente' };
  }
};