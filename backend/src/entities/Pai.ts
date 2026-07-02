import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
  ManyToOne, JoinColumn, OneToMany
} from 'typeorm';
import { Persona } from './Persona';
import { Usuario } from './Usuario';
import { Area } from './Area';

@Entity('pai')
export class Pai {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Persona)
  @JoinColumn({ name: 'persona_id' })
  persona: Persona;

  @Column()
  anio: number;

  @Column({ type: 'date' })
  fecha_inicio: Date;

  @Column({ type: 'date', nullable: true })
  fecha_revision: Date;

  @Column({ length: 50, default: 'borrador' })
  estado: string;

  @Column({ type: 'text', nullable: true })
  observaciones_generales: string;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'creado_por_id' })
  creado_por: Usuario;

  @OneToMany(() => Area, area => area.pai, { cascade: true })
  areas: Area[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}