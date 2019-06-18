import { ShippingService } from './shipping.service';
import { Controller, Get, Post } from '@nestjs/common';

@Controller('shipping')
export class ShippingController {
  constructor(private readonly shippingSevice: ShippingService) {}
}
