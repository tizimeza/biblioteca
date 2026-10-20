import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Libro } from './Libro';

@Entity('sagas')
export class Saga {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true, length: 150 })
  nombre!: string;

  @OneToMany(() => Libro, (libro) => libro.saga)
  libros!: Libro[];
}
