import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn
} from 'typeorm';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 150 })
  apellidos: string;

  @Column({ unique: true, length: 200 })
  email: string;

  @Column()
  password: string;

  @Column({ length: 50 })
  rol: string;

  @Column({ default: true })
  activo: boolean;

  @Column({ type: 'date', nullable: true })
  fecha_alta: Date;

  @Column({ type: 'date', nullable: true })
  fecha_baja: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}