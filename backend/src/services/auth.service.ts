import { UnauthorizedError } from '../errors';
import * as jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { AppDataSource } from '../config/database';
import { Usuario } from '../entities/Usuario';
import { LoginDto } from '../dtos/auth.dto';

const usuarioRepo = AppDataSource.getRepository(Usuario);

export const authService = {

  async login(data: LoginDto) {
    const usuario = await usuarioRepo.findOneBy({ email: data.email });
    if (!usuario) throw new UnauthorizedError('Credenciales incorrectas');

    const passwordOk = await bcrypt.compare(data.password, usuario.password);
    if (!passwordOk) throw new UnauthorizedError('Credenciales incorrectas');

    // Un usuario dado de baja no puede entrar. Mismo mensaje para no revelar el estado de la cuenta
    if (!usuario.activo) throw new UnauthorizedError('Credenciales incorrectas');

    const token = (jwt.sign as Function)(
      // El token se puede leer (no está cifrado, solo firmado): nada sensible aquí
      {
        id: usuario.id, email: usuario.email, rol: usuario.rol,
        nombre: usuario.nombre, apellidos: usuario.apellidos
      },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
    );

    return { token, rol: usuario.rol, nombre: usuario.nombre, apellidos: usuario.apellidos };
  }
};