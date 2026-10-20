import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Libro } from './Libro';

@Entity('generos')
export class Genero {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true, length: 100 })
  nombre!: string;

  @OneToMany(() => Libro, (libro) => libro.genero)
  libros!: Libro[];
}
