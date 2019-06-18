import { Entity, PrimaryGeneratedColumn, Column, BeforeUpdate } from 'typeorm';

@Entity('order_item')
export class OrderItemEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  orderNo: number;

  @Column()
  productId: number;

  @Column()
  productName: string;

  @Column()
  productImage: string;

  @Column()
  currentUnitPrice: number;

  @Column()
  quantity: number;

  @Column()
  totalPrice: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createTime: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updateTime: Date;

  @BeforeUpdate()
  updateTimeStamp() {
    this.updateTime = new Date();
  }
}
