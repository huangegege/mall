import { Entity, PrimaryGeneratedColumn, Column, BeforeUpdate } from 'typeorm';

@Entity('category')
export class CategoryEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  parentId: number;

  @Column()
  name: string;

  @Column({default: true})
  status: boolean;

  @Column({default: 0})
  sortOrder: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createTime: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updateTime: Date;

  @BeforeUpdate()
  updateTimeStamp() {
    this.updateTime = new Date();
  }
}
