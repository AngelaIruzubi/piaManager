import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
  ManyToOne, JoinColumn, OneToMany
} from 'typeorm';
import { Area } from './Area';
import { Medio } from './Medio';
import { Seguimiento } from './Seguimiento';
import { ObjetivoPictograma } from './ObjetivoPictograma';

@Entity('objetivos')
export class Objetivo {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Area, area => area.objetivos)
  @JoinColumn({ name: 'area_id' })
  area: Area;

  @Column({ type: 'text' })
  descripcion: string;

  @Column({ length: 50 })
  plazo: string;

  @Column({ length: 50, default: 'pendiente' })
  estado: string;

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

  @OneToMany(() => ObjetivoPictograma, pictograma => pictograma.objetivo, { cascade: true })
  pictogramas: ObjetivoPictograma[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}