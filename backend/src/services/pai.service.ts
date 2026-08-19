import { AppDataSource } from '../config/database';
import { Pai } from '../entities/Pai';
import { Area } from '../entities/Area';
import { CrearPaiDto, ActualizarPaiDto, CambiarEstadoPaiDto } from '../dtos/pai.dto';

const paiRepo = AppDataSource.getRepository(Pai);
const areaRepo = AppDataSource.getRepository(Area);

const AREAS_FIJAS = [
  'autonomia', 'cognitiva', 'social', 'ocupacional', 'salud'
];

function sinPasswordCreador(pai: Pai) {
  if (!pai.creado_por) return pai;
  const { password, ...creado_por } = pai.creado_por as any;
  return { ...pai, creado_por };
}

export const paiService = {

  async getByPersona(personaId: number) {
    const pais = await paiRepo.find({
      where: { persona: { id: personaId } },
      relations: { persona: true, areas: { objetivos: true }, creado_por: true },
      order: { anio: 'DESC' }
    });
    return pais.map(sinPasswordCreador);
  },

  async getById(id: number) {
    const pai = await paiRepo.findOne({
      where: { id },
      relations: { persona: true, areas: { objetivos: true }, creado_por: true }
    });
    if (!pai) throw new Error('PAI no encontrado');
    return sinPasswordCreador(pai);
  },

  async crear(personaId: number, data: CrearPaiDto, creadoPorId: number) {
    // Comprobar que no existe ya un PAI para ese año
    const existe = await paiRepo.findOne({
      where: { persona: { id: personaId }, anio: data.anio }
    });
    if (existe) throw new Error('Ya existe un PAI para ese año');

    // Crear el PAI
    const pai = paiRepo.create({
      persona: { id: personaId } as any,
      creado_por: { id: creadoPorId } as any,
      anio: data.anio,
      fecha_inicio: new Date(data.fecha_inicio),
      fecha_revision: data.fecha_revision ? new Date(data.fecha_revision) : undefined,
      observaciones_generales: data.observaciones_generales,
      estado: 'borrador'
    });
    await paiRepo.save(pai);

    // Generar automáticamente las 5 áreas
    for (const tipo of AREAS_FIJAS) {
      const area = areaRepo.create({
        pai: { id: pai.id } as any,
        tipo
      });
      await areaRepo.save(area);
    }

    return await paiRepo.findOne({
      where: { id: pai.id },
      relations: { areas: true, persona: true }
    });
  },

  async actualizar(id: number, data: ActualizarPaiDto) {
    const pai = await paiRepo.findOneBy({ id });
    if (!pai) throw new Error('PAI no encontrado');
    Object.assign(pai, data);
    return await paiRepo.save(pai);
  },

  async cambiarEstado(id: number, data: CambiarEstadoPaiDto) {
    const pai = await paiRepo.findOneBy({ id });
    if (!pai) throw new Error('PAI no encontrado');

    const estadosValidos = ['borrador', 'activo', 'cerrado'];
    if (!estadosValidos.includes(data.estado)) {
      throw new Error('Estado no válido');
    }

    pai.estado = data.estado;
    return await paiRepo.save(pai);
  }
};