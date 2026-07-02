import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, ManyToOne, JoinColumn
} from 'typeorm';
import { Usuario } from './Usuario';
import { Persona } from './Persona';

@Entity('asignaciones')
export class Asignacion {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Persona)
  @JoinColumn({ name: 'persona_id' })
  persona: Persona;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'educador_id' })
  educador: Usuario;

  @Column({ type: 'date' })
  fecha_inicio: Date;

  @Column({ type: 'date', nullable: true })
  fecha_fin: Date;

  @CreateDateColumn()
  created_at: Date;
}