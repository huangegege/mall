import { CartService } from './cart.service';
import { Controller, Get, Post } from '@nestjs/common';

@Controller('cart')
export class CartController {
  constructor(private readonly cartSevice: CartService) {}
}
