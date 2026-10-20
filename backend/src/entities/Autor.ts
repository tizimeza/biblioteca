import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Libro } from './Libro';

@Entity('autores')
export class Autor {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 150 })
  nombre!: string;

  @Column({ type: 'varchar', nullable: true, length: 100 })
  nacionalidad!: string | null;

  @OneToMany(() => Libro, (libro) => libro.autor)
  libros!: Libro[];
}
