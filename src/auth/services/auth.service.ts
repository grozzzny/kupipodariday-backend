import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { UsersService } from '../../users/services/users.service'
import { User } from '../../users/entities/user.entity'
import { CreateUserDto } from '../../users/dto/create-user.dto'
import { SigninUserDto } from '../dto/signin-user.dto'
import { PayloadUser } from '../interfaces/payload-user.interface'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByUsername(username)
    if (user && (await bcrypt.compare(password, user.password))) {
      return user
    }
    return null
  }

  async signup(createUserDto: CreateUserDto) {
    const existingUser = await this.usersService.findOne({ email: createUserDto.email })
    if (existingUser) {
      throw new ConflictException('User with this email already exists')
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10)
    return await this.usersService.create({
      ...createUserDto,
      password: hashedPassword
    })
  }

  async signin(signinUserDto: SigninUserDto) {
    const user = await this.usersService.findByUsername(signinUserDto.username)
    if (!user || !(await bcrypt.compare(signinUserDto.password, user.password))) {
      throw new UnauthorizedException('Не правильный логин или пароль')
    }

    const payload: PayloadUser = { id: user.id, username: user.username, email: user.email }
    return { access_token: this.jwtService.sign(payload) }
  }
}
