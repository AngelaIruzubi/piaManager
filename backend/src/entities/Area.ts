import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
  ManyToOne, JoinColumn, OneToMany
} from 'typeorm';
import { Pai } from './Pai';
import { Objetivo } from './Objetivo';

@Entity('areas')
export class Area {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Pai, pai => pai.areas)
  @JoinColumn({ name: 'pai_id' })
  pai: Pai;

  @Column({ length: 50 })
  tipo: string;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @OneToMany(() => Objetivo, objetivo => objetivo.area, { cascade: true })
  objetivos: Objetivo[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}