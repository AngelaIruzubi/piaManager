import * as jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { AppDataSource } from '../config/database';
import { Usuario } from '../entities/Usuario';
import { LoginDto } from '../dtos/auth.dto';

const usuarioRepo = AppDataSource.getRepository(Usuario);

export const authService = {

  async login(data: LoginDto) {
    const usuario = await usuarioRepo.findOneBy({ email: data.email });
    if (!usuario) throw new Error('Credenciales incorrectas');

    const passwordOk = await bcrypt.compare(data.password, usuario.password);
    if (!passwordOk) throw new Error('Credenciales incorrectas');

    const token = (jwt.sign as Function)(
      { id: usuario.id, email: usuario.email, rol: usuario.rol },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
    );

    return { token, rol: usuario.rol, nombre: usuario.nombre };
  }
};