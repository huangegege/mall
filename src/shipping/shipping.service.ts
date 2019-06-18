import { ShippingEntity } from './shipping.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ShippingService {
  constructor(
    @InjectRepository(ShippingEntity)
    private readonly shippingEntity: Repository<ShippingEntity>
  ) {}
}
