import { OrderService } from './order.service';
import { Controller, Get, Post } from '@nestjs/common';

@Controller('order')
export class OrderController {
  constructor(private readonly orderSevice: OrderService) {}
}
