import { IsNumber, IsBoolean, IsOptional } from 'class-validator'

export class CreateOfferDto {
  @IsNumber()
  amount: number

  @IsBoolean()
  @IsOptional()
  hidden?: boolean

  @IsNumber()
  itemId: number
}
