import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Category } from '../../categories/entities/category.entity';

@Entity('parts')
export class Part {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  partNumber: string; // оригинальный номер запчасти

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('text')
  description: string;

  @Column({ nullable: true })
  imageUrl: string;

  @ManyToOne(() => Category, category => category.parts)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column()
  categoryId: number;

  @Column({ nullable: true })
  manufacturer: string;

  @Column({ default: true })
  inStock: boolean;

  @Column('int')
  quantity: number; // количество на складе

  @Column({ nullable: true })
  compatibleModels: string; // совместимые модели мотоциклов (можно хранить как JSON или строку)

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
