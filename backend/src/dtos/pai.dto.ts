import { IsString, IsInt, Min, Max, IsIn, IsOptional, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export const ESTADOS_PAI = ['borrador', 'activo', 'cerrado'];

export class CrearPaiDto {
  @Type(() => Number)
  @IsInt({ message: 'El año debe ser un número entero' })
  @Min(2000, { message: 'El año debe estar entre 2000 y 2100' })
  @Max(2100, { message: 'El año debe estar entre 2000 y 2100' })
  anio: number;

  @IsDateString({}, { message: 'fecha_inicio debe ser una fecha válida' })
  fecha_inicio: string;

  @IsOptional()
  @IsDateString({}, { message: 'fecha_revision debe ser una fecha válida' })
  fecha_revision?: string;

  @IsOptional()
  @IsString()
  observaciones_generales?: string;
}

export class ActualizarPaiDto {
  @IsOptional()
  @IsDateString({}, { message: 'fecha_revision debe ser una fecha válida' })
  fecha_revision?: string;

  @IsOptional()
  @IsString()
  observaciones_generales?: string;
}

export class CambiarEstadoPaiDto {
  @IsIn(ESTADOS_PAI, { message: `Estado no válido. Usa: ${ESTADOS_PAI.join(', ')}` })
  estado: string;
}
