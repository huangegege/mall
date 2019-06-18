import { Entity, PrimaryGeneratedColumn, Column, BeforeUpdate } from 'typeorm';

@Entity('shipping')
export class ShippingEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  receiverName: string;

  @Column()
  receiverPhone: string;

  @Column()
  receiverMobile: string;

  @Column()
  receiverProvince: string;

  @Column()
  receiverCity: string;

  @Column()
  receiverDistrict: string;

  @Column()
  receiverAddress: string;

  @Column()
  receiverZip: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createTime: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updateTime: Date;

  @BeforeUpdate()
  updateTimeStamp() {
    this.updateTime = new Date();
  }
}
