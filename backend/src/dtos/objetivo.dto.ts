import { IsString, IsNotEmpty, IsIn, IsOptional, IsDateString } from 'class-validator';

export const PLAZOS = ['corto', 'medio', 'largo'];
export const ESTADOS_OBJETIVO = ['pendiente', 'en_proceso', 'conseguido', 'no_trabajado'];

export class CrearObjetivoDto {
  @IsString()
  @IsNotEmpty({ message: 'La descripción es obligatoria' })
  descripcion: string;

  @IsIn(PLAZOS, { message: `Plazo no válido. Usa: ${PLAZOS.join(', ')}` })
  plazo: string;

  @IsOptional()
  @IsDateString({}, { message: 'fecha_inicio debe ser una fecha válida' })
  fecha_inicio?: string;

  @IsOptional()
  @IsDateString({}, { message: 'fecha_prevista debe ser una fecha válida' })
  fecha_prevista?: string;
}

// Sin "estado": el estado solo se cambia por PATCH /:id/estado, que aplica las reglas de negocio
export class ActualizarObjetivoDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'La descripción no puede estar vacía' })
  descripcion?: string;

  @IsOptional()
  @IsIn(PLAZOS, { message: `Plazo no válido. Usa: ${PLAZOS.join(', ')}` })
  plazo?: string;

  @IsOptional()
  @IsDateString({}, { message: 'fecha_inicio debe ser una fecha válida' })
  fecha_inicio?: string;

  @IsOptional()
  @IsDateString({}, { message: 'fecha_prevista debe ser una fecha válida' })
  fecha_prevista?: string;
}

export class CambiarEstadoObjetivoDto {
  @IsIn(ESTADOS_OBJETIVO, { message: `Estado no válido. Usa: ${ESTADOS_OBJETIVO.join(', ')}` })
  estado: string;

  @IsOptional()
  @IsDateString({}, { message: 'fecha_consecucion debe ser una fecha válida' })
  fecha_consecucion?: string;
}
