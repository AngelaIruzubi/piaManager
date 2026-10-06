import { IsString, IsNotEmpty, IsInt, Min, Max, IsOptional, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class CrearSeguimientoDto {
  @IsDateString({}, { message: 'La fecha debe ser una fecha válida' })
  fecha: string;

  @Type(() => Number)
  @IsInt({ message: 'El porcentaje debe ser un número entero' })
  @Min(0, { message: 'El porcentaje debe estar entre 0 y 100' })
  @Max(100, { message: 'El porcentaje debe estar entre 0 y 100' })
  porcentaje_logro: number;

  @IsString()
  @IsNotEmpty({ message: 'La observación es obligatoria' })
  observacion: string;
}

export class ActualizarSeguimientoDto {
  @IsOptional()
  @IsDateString({}, { message: 'La fecha debe ser una fecha válida' })
  fecha?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'El porcentaje debe ser un número entero' })
  @Min(0, { message: 'El porcentaje debe estar entre 0 y 100' })
  @Max(100, { message: 'El porcentaje debe estar entre 0 y 100' })
  porcentaje_logro?: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'La observación no puede estar vacía' })
  observacion?: string;
}
