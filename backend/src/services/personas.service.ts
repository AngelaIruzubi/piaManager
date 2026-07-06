import { AppDataSource } from '../config/database';
import { Persona } from '../entities/Persona';
import { CrearPersonaDto, ActualizarPersonaDto } from '../dtos/personas.dto';

const repo = AppDataSource.getRepository(Persona);

export const personasService = {

    async getAll(usuarioId: number, rol: string) {
    if (rol === 'coordinador') {
        return await repo.find({
        where: { activo: true },
        relations: { profesional_referencia: true }
        });
    }
    return await repo.find({
        where: { profesional_referencia: { id: usuarioId }, activo: true },
        relations: { profesional_referencia: true }
    });
    },

    async getById(id: number) {
    const persona = await repo.findOne({
        where: { id },
        relations: { profesional_referencia: true }
    });
    if (!persona) throw new Error('Persona no encontrada');
    return persona;
    },

  async crear(data: CrearPersonaDto) {
    const persona = repo.create({
      nombre: data.nombre,
      apellidos: data.apellidos,
      fecha_nacimiento: new Date(data.fecha_nacimiento),
      tutor_legal: data.tutor_legal,
      telefono_contacto: data.telefono_contacto,
      foto_url: data.foto_url,
      profesional_referencia: { id: data.profesional_referencia_id } as any,
      fecha_alta: new Date(data.fecha_alta),
      activo: true,
    });
    return await repo.save(persona);
  },

  async actualizar(id: number, data: ActualizarPersonaDto) {
    const persona = await repo.findOneBy({ id });
    if (!persona) throw new Error('Persona no encontrada');
    Object.assign(persona, data);
    return await repo.save(persona);
  },

  async darDeBaja(id: number) {
    const persona = await repo.findOneBy({ id });
    if (!persona) throw new Error('Persona no encontrada');
    persona.activo = false;
    persona.fecha_baja = new Date();
    return await repo.save(persona);
  }
};