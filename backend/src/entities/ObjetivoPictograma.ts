import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, ManyToOne, JoinColumn
} from 'typeorm';
import { Objetivo } from './Objetivo';

@Entity('objetivo_pictogramas')
export class ObjetivoPictograma {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Objetivo)
  @JoinColumn({ name: 'objetivo_id' })
  objetivo: Objetivo;

  @Column()
  arasaac_id: number;

  @Column({ length: 200 })
  keyword: string;

  @CreateDateColumn()
  created_at: Date;
}