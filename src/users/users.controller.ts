import { Controller, Get, Post, Body, Param, Patch, UseGuards } from '@nestjs/common'
import { UsersService } from './services/users.service'
import { User } from './entities/user.entity'
import { GetUser } from '../auth/decorators/get-user.decorator'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { UpdateUserDto } from './dto/update-user.dto'
import { Wish } from '../wishes/entities/wish.entity'
import { FindUserDto } from './dto/find-user.dto'

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getProfile(@GetUser() user: User): Promise<User> {
    return this.usersService.findOne({ id: user.id }, true)
  }

  @Patch('me')
  async updateProfile(@GetUser() user: User, @Body() updateData: UpdateUserDto): Promise<User> {
    return this.usersService.updateOne({ id: user.id }, updateData, true)
  }

  @Get('me/wishes')
  async getProfileWishes(@GetUser() user: User): Promise<Wish[]> {
    return this.usersService.getUserWishes({ id: user.id })
  }

  @Post('find')
  findMany(@Body() { query }: FindUserDto) {
    return this.usersService.findMany(query)
  }

  @Get(':username')
  getUser(@Param('username') username: string) {
    return this.usersService.findOne({ username })
  }

  @Get(':username/wishes')
  async getUserWishes(@Param('username') username: string): Promise<Wish[]> {
    return this.usersService.getUserWishes({ username })
  }
}
