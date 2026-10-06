import { BadRequestError, ConflictError, NotFoundError } from '../errors';
import { AppDataSource } from '../config/database';
import { Objetivo } from '../entities/Objetivo';
import {
  CrearObjetivoDto, ActualizarObjetivoDto, CambiarEstadoObjetivoDto,
  PLAZOS, ESTADOS_OBJETIVO
} from '../dtos/objetivo.dto';

const repo = AppDataSource.getRepository(Objetivo);

export const objetivoService = {

  async getByArea(areaId: number) {
    return await repo.find({
      where: { area: { id: areaId } },
      relations: { medios: true, seguimientos: true },
      order: { created_at: 'ASC' }
    });
  },

  async getById(id: number) {
    const objetivo = await repo.findOne({
      where: { id },
      relations: { medios: true, seguimientos: true, area: true, pictogramas: true }
    });
    if (!objetivo) throw new NotFoundError('Objetivo no encontrado');

    return {
      ...objetivo,
      seguimientos: [...(objetivo.seguimientos ?? [])]
        .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()),
      pictogramas: (objetivo.pictogramas ?? []).map(p => ({
        ...p,
        imagen_url: `https://static.arasaac.org/pictograms/${p.arasaac_id}/${p.arasaac_id}_500.png`
      }))
    };
  },

  async crear(areaId: number, data: CrearObjetivoDto) {
    if (!PLAZOS.includes(data.plazo)) {
      throw new BadRequestError('Plazo no válido. Usa: corto, medio o largo');
    }

    const objetivo = repo.create({
      area: { id: areaId } as any,
      descripcion: data.descripcion,
      plazo: data.plazo,
      estado: 'pendiente',
      fecha_inicio: data.fecha_inicio ? new Date(data.fecha_inicio) : undefined,
      fecha_prevista: data.fecha_prevista ? new Date(data.fecha_prevista) : undefined,
    });
    return await repo.save(objetivo);
  },

  async actualizar(id: number, data: ActualizarObjetivoDto) {
    const objetivo = await repo.findOneBy({ id });
    if (!objetivo) throw new NotFoundError('Objetivo no encontrado');
    Object.assign(objetivo, data);
    return await repo.save(objetivo);
  },

  async cambiarEstado(id: number, data: CambiarEstadoObjetivoDto) {
    const objetivo = await repo.findOneBy({ id });
    if (!objetivo) throw new NotFoundError('Objetivo no encontrado');

    if (!ESTADOS_OBJETIVO.includes(data.estado)) {
      throw new BadRequestError('Estado no válido');
    }

    // Un objetivo conseguido no puede volver a pendiente
    if (objetivo.estado === 'conseguido' && data.estado === 'pendiente') {
      throw new ConflictError('No se puede revertir un objetivo conseguido');
    }

    objetivo.estado = data.estado;

    // Si se marca como conseguido guardar la fecha
    if (data.estado === 'conseguido') {
      objetivo.fecha_consecucion = data.fecha_consecucion
        ? new Date(data.fecha_consecucion)
        : new Date();
    }

    return await repo.save(objetivo);
  },

  async eliminar(id: number) {
    const objetivo = await repo.findOneBy({ id });
    if (!objetivo) throw new NotFoundError('Objetivo no encontrado');
    if (objetivo.estado === 'conseguido') {
      throw new ConflictError('No se puede eliminar un objetivo conseguido');
    }
    await repo.remove(objetivo);
    return { mensaje: 'Objetivo eliminado correctamente' };
  }
};