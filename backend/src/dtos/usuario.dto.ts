import { IsString, IsNotEmpty, IsEmail, MinLength, MaxLength, IsIn, IsOptional } from 'class-validator';

export const ROLES = ['educador', 'coordinador'];

export class CrearUsuarioDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MaxLength(100)
  nombre: string;

  @IsString()
  @IsNotEmpty({ message: 'Los apellidos son obligatorios' })
  @MaxLength(150)
  apellidos: string;

  @IsEmail({}, { message: 'El email no es válido' })
  @MaxLength(200)
  email: string;

  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  // Los usuarios nuevos siempre se crean como educador (lo fuerza el servicio)
  @IsOptional()
  @IsIn(['educador'], { message: 'Los usuarios nuevos se crean como educador' })
  rol?: string;
}

// Sin "password": si se aceptara aquí se guardaría sin cifrar
export class ActualizarUsuarioDto {
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
  @IsEmail({}, { message: 'El email no es válido' })
  @MaxLength(200)
  email?: string;

  @IsOptional()
  @IsIn(ROLES, { message: `Rol no válido. Usa: ${ROLES.join(', ')}` })
  rol?: string;
}
