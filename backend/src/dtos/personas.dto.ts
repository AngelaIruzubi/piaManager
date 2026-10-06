import { IsString, IsNotEmpty, MaxLength, IsInt, Min, IsOptional, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

// Las longitudes máximas coinciden con las columnas de la entidad Persona
export class CrearPersonaDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MaxLength(100)
  nombre: string;

  @IsString()
  @IsNotEmpty({ message: 'Los apellidos son obligatorios' })
  @MaxLength(150)
  apellidos: string;

  @IsDateString({}, { message: 'fecha_nacimiento debe ser una fecha válida' })
  fecha_nacimiento: string;

  @IsString()
  @IsNotEmpty({ message: 'El tutor legal es obligatorio' })
  @MaxLength(200)
  tutor_legal: string;

  @IsString()
  @IsNotEmpty({ message: 'El teléfono de contacto es obligatorio' })
  @MaxLength(20)
  telefono_contacto: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  foto_url?: string;

  @Type(() => Number)
  @IsInt({ message: 'Hay que elegir un profesional de referencia' })
  @Min(1)
  profesional_referencia_id: number;

  @IsDateString({}, { message: 'fecha_alta debe ser una fecha válida' })
  fecha_alta: string;
}

// Sin "activo" ni "fecha_baja": la baja se hace con PATCH /:id/baja
export class ActualizarPersonaDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  apellidos?: string;

  @IsOptional()
  @IsDateString({}, { message: 'fecha_nacimiento debe ser una fecha válida' })
  fecha_nacimiento?: string;

  @IsOptional()
  @IsDateString({}, { message: 'fecha_alta debe ser una fecha válida' })
  fecha_alta?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  tutor_legal?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  telefono_contacto?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  foto_url?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  profesional_referencia_id?: number;
}
