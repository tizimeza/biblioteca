import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true, length: 80 })
  username!: string;

  @Column({ length: 255 })
  password!: string;
}
