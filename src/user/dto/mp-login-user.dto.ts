import { IsNotEmpty } from 'class-validator';

export class MpLoginUserDto {

  @IsNotEmpty()
  readonly code: string;
}
