import { AppDataSource } from '../config/database';
import { Medio } from '../entities/Medio';
import { CrearMedioDto, ActualizarMedioDto } from '../dtos/medio.dto';

const repo = AppDataSource.getRepository(Medio);

const TIPOS_VALIDOS = ['material', 'persona_apoyo', 'tecnica', 'adaptacion_entorno'];

export const medioService = {

  async getByObjetivo(objetivoId: number) {
    return await repo.find({
      where: { objetivo: { id: objetivoId } },
      order: { created_at: 'ASC' }
    });
  },

  async crear(objetivoId: number, data: CrearMedioDto) {
    if (!TIPOS_VALIDOS.includes(data.tipo)) {
      throw new Error(`Tipo no válido. Usa: ${TIPOS_VALIDOS.join(', ')}`);
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
    if (!medio) throw new Error('Medio no encontrado');
    Object.assign(medio, data);
    return await repo.save(medio);
  },

  async eliminar(id: number) {
    const medio = await repo.findOneBy({ id });
    if (!medio) throw new Error('Medio no encontrado');
    await repo.remove(medio);
    return { mensaje: 'Medio eliminado correctamente' };
  }
};