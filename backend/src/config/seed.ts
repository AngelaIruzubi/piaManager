import { AppDataSource } from './database';
import { Catalogo } from '../entities/Catalogo';
import { Usuario } from '../entities/Usuario';
import bcrypt from 'bcryptjs';

const datos = [
  // Roles
  { tipo: 'ROL', codigo: 'educador', descripcion: 'Educador del centro' },
  { tipo: 'ROL', codigo: 'coordinador', descripcion: 'Coordinador del centro' },
  // Estados objetivo
  { tipo: 'ESTADO_OBJETIVO', codigo: 'pendiente', descripcion: 'Pendiente de iniciar' },
  { tipo: 'ESTADO_OBJETIVO', codigo: 'en_proceso', descripcion: 'En proceso' },
  { tipo: 'ESTADO_OBJETIVO', codigo: 'conseguido', descripcion: 'Objetivo conseguido' },
  { tipo: 'ESTADO_OBJETIVO', codigo: 'no_trabajado', descripcion: 'No se pudo trabajar' },
  // Plazos
  { tipo: 'PLAZO', codigo: 'corto', descripcion: 'Plazo corto' },
  { tipo: 'PLAZO', codigo: 'medio', descripcion: 'Plazo medio' },
  { tipo: 'PLAZO', codigo: 'largo', descripcion: 'Plazo largo' },
  // Tipos de área
  { tipo: 'TIPO_AREA', codigo: 'autonomia', descripcion: 'Autonomía Personal y Vida Diaria' },
  { tipo: 'TIPO_AREA', codigo: 'cognitiva', descripcion: 'Cognitiva y Comunicativa' },
  { tipo: 'TIPO_AREA', codigo: 'social', descripcion: 'Social y Relacional' },
  { tipo: 'TIPO_AREA', codigo: 'ocupacional', descripcion: 'Ocupacional y Funcional' },
  { tipo: 'TIPO_AREA', codigo: 'salud', descripcion: 'Salud y Bienestar Físico' },
  // Tipos de medio
  { tipo: 'TIPO_MEDIO', codigo: 'material', descripcion: 'Material' },
  { tipo: 'TIPO_MEDIO', codigo: 'persona_apoyo', descripcion: 'Persona de apoyo' },
  { tipo: 'TIPO_MEDIO', codigo: 'tecnica', descripcion: 'Técnica' },
  { tipo: 'TIPO_MEDIO', codigo: 'adaptacion', descripcion: 'Adaptación del entorno' },
];

AppDataSource.initialize().then(async () => {

  // Catálogos
  const catalogoRepo = AppDataSource.getRepository(Catalogo);
  for (const dato of datos) {
    const existe = await catalogoRepo.findOneBy({ tipo: dato.tipo, codigo: dato.codigo });
    if (!existe) {
      await catalogoRepo.save(catalogoRepo.create(dato));
      console.log(`✅ Catálogo: ${dato.tipo} - ${dato.codigo}`);
    } else {
      console.log(`⏭️  Ya existe: ${dato.tipo} - ${dato.codigo}`);
    }
  }

  // Coordinadora inicial
  const usuarioRepo = AppDataSource.getRepository(Usuario);
  const admin = await usuarioRepo.findOneBy({ email: 'admin@pia.com' });
  if (!admin) {
    const hash = await bcrypt.hash('admin123', 10);
    await usuarioRepo.save(usuarioRepo.create({
      nombre: 'Coordinadora',
      apellidos: 'Principal',
      email: 'admin@pia.com',
      password: hash,
      rol: 'coordinador',
      activo: true,
    }));
    console.log('✅ Coordinadora inicial creada: admin@pia.com / admin123');
  } else {
    console.log('⏭️  Coordinadora ya existe');
  }

  console.log('🎉 Seed completado');
  process.exit(0);
}).catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});