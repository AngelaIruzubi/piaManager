import { AppDataSource } from '../config/database';
import { Usuario } from '../entities/Usuario';
import bcrypt from 'bcryptjs';
import { CrearUsuarioDto, ActualizarUsuarioDto } from '../dtos/usuario.dto';

const repo = AppDataSource.getRepository(Usuario);

export const usuarioService = {

  async getAll() {
    const usuarios = await repo.find({
      where: { activo: true },
      order: { apellidos: 'ASC' }
    });
    // Nunca devolvemos la contraseña
    return usuarios.map(({ password, ...u }) => u);
  },

  async getById(id: number) {
    const usuario = await repo.findOneBy({ id });
    if (!usuario) throw new Error('Usuario no encontrado');
    const { password, ...resultado } = usuario;
    return resultado;
  },
  async crear(data: CrearUsuarioDto) {
  const existe = await repo.findOneBy({ email: data.email });
  if (existe) throw new Error('El email ya está registrado');

  const hash = await bcrypt.hash(data.password, 10);
  const usuario = repo.create({
    ...data,
    password: hash,
    activo: true,
  });
  const guardado = await repo.save(usuario);
  const { password, ...resultado } = guardado;
  return resultado;
},

  async actualizar(id: number, data: ActualizarUsuarioDto) {
    const usuario = await repo.findOneBy({ id });
    if (!usuario) throw new Error('Usuario no encontrado');
    Object.assign(usuario, data);
    const guardado = await repo.save(usuario);
    const { password, ...resultado } = guardado;
    return resultado;
  },

  async darDeBaja(id: number) {
    const usuario = await repo.findOneBy({ id });
    if (!usuario) throw new Error('Usuario no encontrado');
    if (!usuario.activo) throw new Error('El usuario ya está dado de baja');
    usuario.activo = false;
    usuario.fecha_baja = new Date();
    const guardado = await repo.save(usuario);
    const { password, ...resultado } = guardado;
    return resultado;
  }
};