import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Like, FindOptionsWhere } from 'typeorm'
import { User } from '../entities/user.entity'
import { CreateUserDto } from '../dto/create-user.dto'
import { UpdateUserDto } from '../dto/update-user.dto'
import { plainToInstance } from 'class-transformer'
import Helper from '../../utils/Helper'
import { Wish } from '../../wishes/entities/wish.entity'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(createUserDto)
    await this.usersRepository.save(user)

    return plainToInstance(User, user)
  }

  async findOne(queryFilter: FindOptionsWhere<User>): Promise<User> {
    const user = await this.usersRepository.findOne({ where: queryFilter })
    if (!user) throw new NotFoundException(`Пользователь не найден`)

    return plainToInstance(User, user)
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { username } })
  }

  async getUserWishes(queryFilter: FindOptionsWhere<User>): Promise<Wish[]> {
    const wishes = await this.usersRepository
      .findOne({
        where: queryFilter,
        relations: ['wishes', 'wishes.owner', 'wishes.offers', 'wishes.offers.user']
      })
      .then((user) => user?.wishes || [])

    return plainToInstance(Wish, wishes)
  }

  async findMany(search: string): Promise<User[]> {
    const users = await this.usersRepository.find({
      where: [{ username: Like(`%${search}%`) }, { email: Like(`%${search}%`) }]
    })

    return plainToInstance(User, users)
  }

  async updateOne(queryFilter: FindOptionsWhere<User>, updateData: UpdateUserDto): Promise<User> {
    if (updateData.password) {
      updateData.password = await Helper.hashedPassword(updateData.password)
    }

    await this.usersRepository.update(queryFilter, updateData)

    return this.findOne(queryFilter)
  }
}
