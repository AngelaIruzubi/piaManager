import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, ManyToOne, JoinColumn
} from 'typeorm';
import { Objetivo } from './Objetivo';
import { Usuario } from './Usuario';

@Entity('seguimientos')
export class Seguimiento {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Objetivo, objetivo => objetivo.seguimientos)
  @JoinColumn({ name: 'objetivo_id' })
  objetivo: Objetivo;

  @Column({ type: 'date' })
  fecha: Date;

  @Column({ type: 'int' })
  porcentaje_logro: number;

  @Column({ type: 'text' })
  observacion: string;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'registrado_por_id' })
  registrado_por: Usuario;

  @CreateDateColumn()
  created_at: Date;
}