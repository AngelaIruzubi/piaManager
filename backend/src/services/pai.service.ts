import { BadRequestError, ConflictError, NotFoundError } from '../errors';
import { AppDataSource } from '../config/database';
import { Pai } from '../entities/Pai';
import { Area } from '../entities/Area';
import { CrearPaiDto, ActualizarPaiDto, CambiarEstadoPaiDto, ESTADOS_PAI } from '../dtos/pai.dto';

const paiRepo = AppDataSource.getRepository(Pai);
const areaRepo = AppDataSource.getRepository(Area);

const AREAS_FIJAS = [
  'autonomia', 'cognitiva', 'social', 'ocupacional', 'salud'
];

function sinPassword(usuario: any) {
  if (!usuario) return usuario;
  const { password, ...resto } = usuario;
  return resto;
}

function sanearPai(pai: Pai) {
  const areas = (pai.areas ?? []).map(area => ({
    ...area,
    objetivos: (area.objetivos ?? []).map(objetivo => ({
      ...objetivo,
      seguimientos: [...(objetivo.seguimientos ?? [])]
        .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
        .map(seguimiento => ({
          ...seguimiento,
          registrado_por: sinPassword(seguimiento.registrado_por)
        })),
      pictogramas: (objetivo.pictogramas ?? []).map(p => ({
        ...p,
        imagen_url: `https://static.arasaac.org/pictograms/${p.arasaac_id}/${p.arasaac_id}_500.png`
      }))
    }))
  }));
  return { ...pai, creado_por: sinPassword(pai.creado_por), areas };
}

export const paiService = {

  async getByPersona(personaId: number) {
    const pais = await paiRepo.find({
      where: { persona: { id: personaId } },
      relations: {
        persona: true,
        areas: { objetivos: { seguimientos: { registrado_por: true }, pictogramas: true } },
        creado_por: true
      },
      order: { anio: 'DESC' }
    });
    return pais.map(sanearPai);
  },

  async getById(id: number) {
    const pai = await paiRepo.findOne({
      where: { id },
      relations: {
        persona: true,
        areas: { objetivos: { seguimientos: { registrado_por: true }, pictogramas: true } },
        creado_por: true
      }
    });
    if (!pai) throw new NotFoundError('PAI no encontrado');
    return sanearPai(pai);
  },

  async crear(personaId: number, data: CrearPaiDto, creadoPorId: number) {
    // Comprobar que no existe ya un PAI para ese año
    const existe = await paiRepo.findOne({
      where: { persona: { id: personaId }, anio: data.anio }
    });
    if (existe) throw new ConflictError('Ya existe un PAI para ese año');

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
    if (!pai) throw new NotFoundError('PAI no encontrado');
    Object.assign(pai, data);
    return await paiRepo.save(pai);
  },

  async cambiarEstado(id: number, data: CambiarEstadoPaiDto) {
    const pai = await paiRepo.findOneBy({ id });
    if (!pai) throw new NotFoundError('PAI no encontrado');

    if (!ESTADOS_PAI.includes(data.estado)) {
      throw new BadRequestError('Estado no válido');
    }

    pai.estado = data.estado;
    return await paiRepo.save(pai);
  }
};