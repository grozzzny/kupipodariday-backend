import { Controller, Post, UseGuards, Body } from '@nestjs/common'
import { LocalAuthGuard } from './guards/local-auth.guard'
import { AuthService } from './services/auth.service'
import { SigninUserDto } from './dto/signin-user.dto'
import { CreateUserDto } from '../users/dto/create-user.dto'

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto)
  }

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signin(@Body() signinUserDto: SigninUserDto) {
    return this.authService.signin(signinUserDto)
  }
}
