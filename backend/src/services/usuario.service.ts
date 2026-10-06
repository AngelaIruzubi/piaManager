import { ConflictError, ForbiddenError, NotFoundError } from '../errors';
import { AppDataSource } from '../config/database';
import { Usuario } from '../entities/Usuario';
import bcrypt from 'bcryptjs';
import { CrearUsuarioDto, ActualizarUsuarioDto } from '../dtos/usuario.dto';
import { Persona } from '../entities/Persona';

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

  async getEducadores() {
    const usuarios = await repo.find({
      where: { activo: true, rol: 'educador' },
      order: { apellidos: 'ASC' }
    });
    return usuarios.map(({ id, nombre, apellidos }) => ({ id, nombre, apellidos }));
  },

  async getById(id: number) {
    const usuario = await repo.findOneBy({ id });
    if (!usuario) throw new NotFoundError('Usuario no encontrado');
    const { password, ...resultado } = usuario;
    return resultado;
  },
  async crear(data: CrearUsuarioDto) {
  const existe = await repo.findOneBy({ email: data.email });
  if (existe) throw new ConflictError('El email ya está registrado');

  const hash = await bcrypt.hash(data.password, 10);
  const usuario = repo.create({
    ...data,
    rol: 'educador',
    password: hash,
    activo: true,
  });
  const guardado = await repo.save(usuario);
  const { password, ...resultado } = guardado;
  return resultado;
},

  async actualizar(id: number, data: ActualizarUsuarioDto) {
    const usuario = await repo.findOneBy({ id });
    if (!usuario) throw new NotFoundError('Usuario no encontrado');
    Object.assign(usuario, data);
    const guardado = await repo.save(usuario);
    const { password, ...resultado } = guardado;
    return resultado;
  },

  async darDeBaja(id: number, usuarioActualId: number) {
  if (id === usuarioActualId) throw new ForbiddenError('No puedes dar de baja tu propia cuenta');

  const usuario = await repo.findOneBy({ id });
  if (!usuario) throw new NotFoundError('Usuario no encontrado');
  if (!usuario.activo) throw new ConflictError('El usuario ya está dado de baja');

  // El centro nunca puede quedarse sin nadie que gestione el equipo
  if (usuario.rol === 'coordinador') {
    const coordinadoresActivos = await repo.countBy({ rol: 'coordinador', activo: true });
    if (coordinadoresActivos <= 1) {
      throw new ConflictError('No se puede dar de baja al último coordinador activo');
    }
  }

  // Verificar si tiene personas asignadas activas
  const personaRepo = AppDataSource.getRepository(Persona);
  const personasAsignadas = await personaRepo.find({
    where: { profesional_referencia: { id }, activo: true }
  });

  if (personasAsignadas.length > 0) {
    throw new ConflictError(
      `No se puede dar de baja. Tiene ${personasAsignadas.length} persona/s asignada/s. Reasígnalas primero.`
    );
  }

  usuario.activo = false;
  usuario.fecha_baja = new Date();
  const guardado = await repo.save(usuario);
  const { password, ...resultado } = guardado;
  return resultado;
}
};