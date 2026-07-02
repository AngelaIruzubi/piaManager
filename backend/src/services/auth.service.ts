import bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/database';
import { Usuario } from '../entities/Usuario';
import { RegisterDto, LoginDto } from '../dtos/auth.dto';

const usuarioRepo = AppDataSource.getRepository(Usuario);

export const authService = {

  async register(data: RegisterDto) {
    // Comprobar si el email ya existe
    const existe = await usuarioRepo.findOneBy({ email: data.email });
    if (existe) throw new Error('El email ya está registrado');

    // Encriptar la contraseña
    const hash = await bcrypt.hash(data.password, 10);

    // Crear y guardar el usuario
    const usuario = usuarioRepo.create({
        nombre: data.nombre,
        apellidos: data.apellidos,
        email: data.email,
        password: hash,
        rol: data.rol as any,
        });
    await usuarioRepo.save(usuario);

    // Devolver sin la contraseña
    const { password, ...resultado } = usuario;
    return resultado;
  },

  async login(data: LoginDto) {
    // Buscar el usuario por email
    const usuario = await usuarioRepo.findOneBy({ email: data.email });
    if (!usuario) throw new Error('Credenciales incorrectas');

    // Verificar la contraseña
    const passwordOk = await bcrypt.compare(data.password, usuario.password);
    if (!passwordOk) throw new Error('Credenciales incorrectas');

    // Generar el JWT
    const token = (jwt.sign as Function)(
  { id: usuario.id, email: usuario.email, rol: usuario.rol },
  process.env.JWT_SECRET!,
  { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
);

    return { token, rol: usuario.rol, nombre: usuario.nombre };
  }
};