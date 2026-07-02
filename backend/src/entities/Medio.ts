import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
  ManyToOne, JoinColumn
} from 'typeorm';
import { Objetivo } from './Objetivo';

@Entity('medios')
export class Medio {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Objetivo, objetivo => objetivo.medios)
  @JoinColumn({ name: 'objetivo_id' })
  objetivo: Objetivo;

  @Column({ length: 50 })
  tipo: string;

  @Column({ type: 'text' })
  descripcion: string;

  @Column({ length: 200, nullable: true })
  responsable: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}