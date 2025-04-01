import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'
import { PayloadUser } from '../interfaces/payload-user.interface'
import { UsersService } from '../../users/services/users.service'
import { User } from '../../users/entities/user.entity'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET')!
    })
  }

  async validate(payload: PayloadUser): Promise<User> {
    const user = await this.usersService.findByUsername(payload.username)
    if (!user) throw new UnauthorizedException('Ошибка авторизации')
    return user
  }
}
