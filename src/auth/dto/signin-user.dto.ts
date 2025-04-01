import { IsString } from 'class-validator'

export class SigninUserDto {
  @IsString()
  username: string

  @IsString()
  password: string
}
