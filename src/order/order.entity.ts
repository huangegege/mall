import { Entity, PrimaryGeneratedColumn, Column, BeforeUpdate } from 'typeorm';

@Entity('order')
export class OrderEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  orderNo: number;

  @Column()
  userId: number;

  @Column()
  shippingId: number;

  @Column()
  payment: number;

  @Column()
  paymentType: number;

  @Column()
  postage: number;

  @Column()
  status: number;

  @Column({type: 'timestamp'})
  paymentTime: Date;

  @Column({type: 'timestamp'})
  sendTime: Date;

  @Column({type: 'timestamp'})
  endTime: Date;

  @Column({type: 'timestamp'})
  closeTime: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createTime: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updateTime: Date;

  @BeforeUpdate()
  updateTimeStamp() {
    this.updateTime = new Date();
  }
}
