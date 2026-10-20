import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Autor } from './Autor';
import { Estante } from './Estante';
import { Genero } from './Genero';
import { Saga } from './Saga';

@Entity('libros')
export class Libro {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 200 })
  titulo!: string;

  @Column({ type: 'int' })
  anioPublicacion!: number;

  @Column({ type: 'int', nullable: true })
  nroEnSaga!: number | null;

  @ManyToOne(() => Autor, (autor) => autor.libros, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'autorId' })
  autor!: Autor;

  @ManyToOne(() => Genero, (genero) => genero.libros, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'generoId' })
  genero!: Genero;

  @ManyToOne(() => Estante, (estante) => estante.libros, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'estanteId' })
  estante!: Estante;

  @ManyToOne(() => Saga, (saga) => saga.libros, {
    nullable: true,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'sagaId' })
  saga!: Saga | null;
}
