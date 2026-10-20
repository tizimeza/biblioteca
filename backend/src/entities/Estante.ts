import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Libro } from './Libro';

@Entity('estantes')
export class Estante {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true, length: 50 })
  codigo!: string;

  @Column({ length: 150 })
  ubicacion!: string;

  @OneToMany(() => Libro, (libro) => libro.estante)
  libros!: Libro[];
}
