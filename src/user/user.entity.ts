import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate } from 'typeorm';
import { IsEmail } from 'class-validator';
import * as crypto from 'crypto';

@Entity('user')
export class UserEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({default: ''})
  username: string;

  @Column({default: ''})
  @IsEmail()
  email: string;

  @Column({default: ''})
  password: string;

  @BeforeInsert()
  hashPassword() {
    if (this.password) {
      this.password = crypto.createHmac('sha256', this.password).digest('hex');
    }
  }

  @Column({default: ''})
  phone: string;

  @Column({default: ''})
  question: string;

  @Column({default: ''})
  answer: string;

  @Column({default: 1})
  role: number;

  @Column({default: ''})
  openid: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createTime: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updateTime: Date;

  @BeforeUpdate()
  updateTimeStamp() {
    this.updateTime = new Date();
  }
}
