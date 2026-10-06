import { Response, NextFunction } from 'express';
import { AppDataSource } from '../config/database';
import { RequestConUsuario } from './auth.middleware';
import { Persona } from '../entities/Persona';
import { Pai } from '../entities/Pai';
import { Area } from '../entities/Area';
import { Objetivo } from '../entities/Objetivo';
import { Medio } from '../entities/Medio';
import { Seguimiento } from '../entities/Seguimiento';
import { ObjetivoPictograma } from '../entities/ObjetivoPictograma';

// Un resolver averigua a qué persona pertenece lo que se pide (subiendo por la jerarquía si hace falta)
type ResolverPersona = (req: RequestConUsuario) => Promise<Persona | null | undefined>;

// Lo que necesitamos de la persona: su profesional de referencia
const REFERENCIA = { profesional_referencia: true };

function idDe(req: RequestConUsuario, param: string): number | null {
  const id = Number(req.params[param]);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export const personaPorId = (param: string): ResolverPersona => async req => {
  const id = idDe(req, param);
  if (!id) return null;
  return AppDataSource.getRepository(Persona).findOne({ where: { id }, relations: REFERENCIA });
};

export const personaDePai = (param: string): ResolverPersona => async req => {
  const id = idDe(req, param);
  if (!id) return null;
  const pai = await AppDataSource.getRepository(Pai).findOne({
    where: { id }, relations: { persona: REFERENCIA }
  });
  return pai?.persona;
};

export const personaDeArea = (param: string): ResolverPersona => async req => {
  const id = idDe(req, param);
  if (!id) return null;
  const area = await AppDataSource.getRepository(Area).findOne({
    where: { id }, relations: { pai: { persona: REFERENCIA } }
  });
  return area?.pai?.persona;
};

export const personaDeObjetivo = (param: string): ResolverPersona => async req => {
  const id = idDe(req, param);
  if (!id) return null;
  const objetivo = await AppDataSource.getRepository(Objetivo).findOne({
    where: { id }, relations: { area: { pai: { persona: REFERENCIA } } }
  });
  return objetivo?.area?.pai?.persona;
};

// Medio, seguimiento y pictograma cuelgan de un objetivo
const RELACIONES_DESDE_OBJETIVO = { objetivo: { area: { pai: { persona: REFERENCIA } } } };

export const personaDeMedio = (param: string): ResolverPersona => async req => {
  const id = idDe(req, param);
  if (!id) return null;
  const medio = await AppDataSource.getRepository(Medio).findOne({
    where: { id }, relations: RELACIONES_DESDE_OBJETIVO
  });
  return medio?.objetivo?.area?.pai?.persona;
};

export const personaDeSeguimiento = (param: string): ResolverPersona => async req => {
  const id = idDe(req, param);
  if (!id) return null;
  const seguimiento = await AppDataSource.getRepository(Seguimiento).findOne({
    where: { id }, relations: RELACIONES_DESDE_OBJETIVO
  });
  return seguimiento?.objetivo?.area?.pai?.persona;
};

export const personaDePictograma = (param: string): ResolverPersona => async req => {
  const id = idDe(req, param);
  if (!id) return null;
  const pictograma = await AppDataSource.getRepository(ObjetivoPictograma).findOne({
    where: { id }, relations: RELACIONES_DESDE_OBJETIVO
  });
  return pictograma?.objetivo?.area?.pai?.persona;
};

// Coordinación accede a todo; un educador solo a las personas de las que es profesional de referencia
export const accesoPersona = (resolver: ResolverPersona) =>
  async (req: RequestConUsuario, res: Response, next: NextFunction) => {
    if (req.usuario?.rol === 'coordinador') return next();

    const persona = await resolver(req);
    if (!persona) {
      return res.status(404).json({ mensaje: 'Recurso no encontrado' });
    }
    if (persona.profesional_referencia?.id !== req.usuario?.id) {
      return res.status(403).json({ mensaje: 'No tienes acceso a esta persona' });
    }
    next();
  };
