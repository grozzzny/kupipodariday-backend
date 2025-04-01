import { IsString, Length, IsArray, IsNumber, IsUrl, IsOptional } from 'class-validator'

export class CreateWishlistDto {
  @IsString()
  @Length(1, 250)
  name: string

  @IsString()
  @Length(0, 1024)
  @IsOptional()
  description?: string

  @IsUrl()
  image: string

  @IsArray()
  @IsNumber({}, { each: true })
  itemsId: number[]
}
