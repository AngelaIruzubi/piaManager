import 'reflect-metadata';
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

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: true,
  entities: [Usuario,Catalogo, Persona, Asignacion, Pai, Area, Objetivo, Medio, Seguimiento],
});