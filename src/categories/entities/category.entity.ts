import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { Motorcycle } from '../../motorcycles/entities/motorcycle.entity';
import { Part } from '../../parts/entities/part.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Motorcycle, motorcycle => motorcycle.category)
  motorcycles: Motorcycle[];

  @OneToMany(() => Part, part => part.category)
  parts: Part[];
}
