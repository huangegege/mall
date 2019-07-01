import { Entity, PrimaryGeneratedColumn, Column, BeforeUpdate } from 'typeorm';

@Entity('product')
export class ProductEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  categoryId: number;

  @Column()
  name: string;

  @Column()
  subtitle: string;

  @Column()
  mainImage: string;

  @Column({default: ''})
  subImages: string;

  @Column('text')
  detail: string;

  @Column()
  price: number;

  @Column()
  stock: number;

  @Column({default: 1})
  status: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createTime: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updateTime: Date;

  @BeforeUpdate()
  updateTimeStamp() {
    this.updateTime = new Date();
  }
}
