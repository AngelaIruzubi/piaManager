import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
  ManyToOne, JoinColumn, OneToMany
} from 'typeorm';
import { Pai } from './Pai';
import { Objetivo } from './Objetivo';

export enum TipoArea {
  AUTONOMIA = 'autonomia',
  COGNITIVA = 'cognitiva',
  SOCIAL = 'social',
  OCUPACIONAL = 'ocupacional',
  SALUD = 'salud',
}

@Entity('areas')
export class Area {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Pai, pai => pai.areas)
  @JoinColumn({ name: 'pai_id' })
  pai: Pai;

  @Column({ type: 'enum', enum: TipoArea })
  tipo: TipoArea;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @OneToMany(() => Objetivo, objetivo => objetivo.area, { cascade: true })
  objetivos: Objetivo[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}