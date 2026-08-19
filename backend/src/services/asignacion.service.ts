import { AppDataSource } from '../config/database';
import { Asignacion } from '../entities/Asignacion';
import { AsignarEducadorDto } from '../dtos/asignacion.dto';
import { IsNull } from 'typeorm';

const repo = AppDataSource.getRepository(Asignacion);

function sinPasswordEducador(asignacion: Asignacion) {
  if (!asignacion.educador) return asignacion;
  const { password, ...educador } = asignacion.educador as any;
  return { ...asignacion, educador };
}

export const asignacionService = {

  async getByPersona(personaId: number) {
    const asignaciones = await repo.find({
      where: { persona: { id: personaId } },
      relations: { educador: true, persona: true },
      order: { fecha_inicio: 'DESC' }
    });
    return asignaciones.map(sinPasswordEducador);
  },

  async asignar(personaId: number, data: AsignarEducadorDto) {
    // Finalizar asignación activa si existe
    const activa = await repo.findOne({
  where: { persona: { id: personaId }, fecha_fin: IsNull() }
});

    if (activa) {
      activa.fecha_fin = new Date();
      await repo.save(activa);
    }

    // Crear nueva asignación
    const nueva = repo.create({
      persona: { id: personaId } as any,
      educador: { id: data.educador_id } as any,
      fecha_inicio: new Date()
    });

    return await repo.save(nueva);
  },

  async finalizar(id: number) {
    const asignacion = await repo.findOneBy({ id });
    if (!asignacion) throw new Error('Asignación no encontrada');
    if (asignacion.fecha_fin) throw new Error('La asignación ya está finalizada');

    asignacion.fecha_fin = new Date();
    return await repo.save(asignacion);
  }
};