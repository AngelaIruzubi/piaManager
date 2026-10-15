import 'reflect-metadata';
import path from 'path';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { Usuario } from '../entities/Usuario';
import { Persona } from '../entities/Persona';
import { Asignacion } from '../entities/Asignacion';
import { Pai } from '../entities/Pai';
import { Area } from '../entities/Area';
import { Objetivo } from '../entities/Objetivo';
import { Medio } from '../entities/Medio';
import { Seguimiento } from '../entities/Seguimiento';
import { Catalogo } from '../entities/Catalogo';
import { ObjetivoPictograma } from '../entities/ObjetivoPictograma';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // El esquema ya no se modifica solo al arrancar: cada cambio es una migración versionada en git
  synchronize: false,
  migrations: [path.join(__dirname, '../migrations/*.{ts,js}')],
  migrationsRun: true, // al arrancar se aplican las migraciones pendientes
  logging: process.env.DB_LOGGING === 'true' ? true : ['error', 'migration'],
  entities: [Usuario,Catalogo, Persona, Asignacion, Pai, Area, Objetivo, Medio, Seguimiento, ObjetivoPictograma],
});