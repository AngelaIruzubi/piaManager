import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
  ManyToOne, JoinColumn, OneToMany
} from 'typeorm';
import { Usuario } from './Usuario';

@Entity('personas')
export class Persona {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 150 })
  apellidos: string;

  @Column({ type: 'date' })
  fecha_nacimiento: Date;

  @Column({ length: 200 })
  tutor_legal: string;

  @Column({ length: 20 })
  telefono_contacto: string;

  @Column({ length: 500, nullable: true })
  foto_url: string;

  @Column({ default: true })
  activo: boolean;

  @Column({ type: 'date' })
  fecha_alta: Date;

  @Column({ type: 'date', nullable: true })
  fecha_baja: Date;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'profesional_referencia_id' })
  profesional_referencia: Usuario;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}