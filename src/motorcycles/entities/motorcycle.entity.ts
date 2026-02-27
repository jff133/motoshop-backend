import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Category } from '../../categories/entities/category.entity';

@Entity('motorcycles')
export class Motorcycle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  brand: string;

  @Column()
  model: string;

  @Column()
  year: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('text')
  description: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column()
  engineCapacity: number; // в см³

  @Column()
  engineType: string; // Бензин, Электро и т.д.

  @Column()
  power: number; // в л.с.

  @Column('int')
  mileage: number; // пробег в км

  @Column({ default: true })
  inStock: boolean;

  @Column({ nullable: true })
  color: string;

  @ManyToOne(() => Category, category => category.motorcycles)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column()
  categoryId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
