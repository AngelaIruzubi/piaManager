import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
  ManyToOne, JoinColumn, OneToMany
} from 'typeorm';
import { Area } from './Area';
import { Medio } from './Medio';
import { Seguimiento } from './Seguimiento';

export enum PlazoObjetivo {
  CORTO = 'corto',
  MEDIO = 'medio',
  LARGO = 'largo',
}

export enum EstadoObjetivo {
  PENDIENTE = 'pendiente',
  EN_PROCESO = 'en_proceso',
  CONSEGUIDO = 'conseguido',
  NO_TRABAJADO = 'no_trabajado',
}

@Entity('objetivos')
export class Objetivo {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Area, area => area.objetivos)
  @JoinColumn({ name: 'area_id' })
  area: Area;

  @Column({ type: 'text' })
  descripcion: string;

  @Column({ type: 'enum', enum: PlazoObjetivo })
  plazo: PlazoObjetivo;

  @Column({ type: 'enum', enum: EstadoObjetivo, default: EstadoObjetivo.PENDIENTE })
  estado: EstadoObjetivo;

  @Column({ type: 'date', nullable: true })
  fecha_inicio: Date;

  @Column({ type: 'date', nullable: true })
  fecha_prevista: Date;

  @Column({ type: 'date', nullable: true })
  fecha_consecucion: Date;

  @OneToMany(() => Medio, medio => medio.objetivo, { cascade: true })
  medios: Medio[];

  @OneToMany(() => Seguimiento, seguimiento => seguimiento.objetivo, { cascade: true })
  seguimientos: Seguimiento[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}