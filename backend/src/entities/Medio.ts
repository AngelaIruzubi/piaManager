import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
  ManyToOne, JoinColumn
} from 'typeorm';
import { Objetivo } from './Objetivo';

export enum TipoMedio {
  MATERIAL = 'material',
  PERSONA_APOYO = 'persona_apoyo',
  TECNICA = 'tecnica',
  ADAPTACION_ENTORNO = 'adaptacion_entorno',
}

@Entity('medios')
export class Medio {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Objetivo, objetivo => objetivo.medios)
  @JoinColumn({ name: 'objetivo_id' })
  objetivo: Objetivo;

  @Column({ type: 'enum', enum: TipoMedio })
  tipo: TipoMedio;

  @Column({ type: 'text' })
  descripcion: string;

  @Column({ length: 200, nullable: true })
  responsable: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}