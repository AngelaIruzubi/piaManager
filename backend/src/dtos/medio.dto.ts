import { IsString, IsNotEmpty, IsIn, MaxLength, IsOptional } from 'class-validator';

// Mismos códigos que el catálogo TIPO_MEDIO (config/seed.ts)
export const TIPOS_MEDIO = ['material', 'persona_apoyo', 'tecnica', 'adaptacion'];

export class CrearMedioDto {
  @IsIn(TIPOS_MEDIO, { message: `Tipo no válido. Usa: ${TIPOS_MEDIO.join(', ')}` })
  tipo: string;

  @IsString()
  @IsNotEmpty({ message: 'La descripción es obligatoria' })
  descripcion: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  responsable?: string;
}

export class ActualizarMedioDto {
  @IsOptional()
  @IsIn(TIPOS_MEDIO, { message: `Tipo no válido. Usa: ${TIPOS_MEDIO.join(', ')}` })
  tipo?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'La descripción no puede estar vacía' })
  descripcion?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  responsable?: string;
}
