import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FindOptionsWhere, Repository } from 'typeorm'
import { Wish } from '../entities/wish.entity'
import { CreateWishDto } from '../dto/create-wish.dto'
import { UpdateWishDto } from '../dto/update-wish.dto'
import { plainToInstance } from 'class-transformer'
import { User } from '../../users/entities/user.entity'

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>
  ) {}

  async create(userId: number, createWishDto: CreateWishDto): Promise<Wish> {
    const wish = this.wishesRepository.create({ ...createWishDto, owner: { id: userId } })
    await this.wishesRepository.save(wish)
    return this.findOne({ id: wish.id })
  }

  async findOne(queryFilter: FindOptionsWhere<Wish>): Promise<Wish> {
    const wish = await this.wishesRepository.findOne({
      where: queryFilter,
      relations: ['owner', 'offers', 'offers.user']
    })

    if (!wish) throw new NotFoundException('Подарок не найден')

    return plainToInstance(Wish, wish)
  }

  async findLast(): Promise<Wish[]> {
    const wishes = await this.wishesRepository.find({
      order: { createdAt: 'DESC' },
      relations: ['owner', 'offers', 'offers.user'],
      take: 40
    })

    return plainToInstance(Wish, wishes)
  }

  async findTop(): Promise<Wish[]> {
    const wishes = await this.wishesRepository.find({
      order: { copied: 'DESC' },
      relations: ['owner', 'offers', 'offers.user'],
      take: 20
    })

    return plainToInstance(Wish, wishes)
  }

  async updateOne(queryFilter: FindOptionsWhere<Wish>, userId: number, updateData: UpdateWishDto): Promise<Wish> {
    const wish = await this.findOne(queryFilter)

    if (wish.owner.id !== userId) {
      throw new BadRequestException('Вы не можете редактировать чужой подарок')
    }

    if (updateData.price !== undefined && wish.offers.length > 0) {
      throw new BadRequestException('Нельзя изменять стоимость, если уже есть желающие скинуться')
    }

    await this.wishesRepository.update(queryFilter, updateData)

    return this.findOne(queryFilter)
  }

  async removeOne(queryFilter: FindOptionsWhere<Wish>, userId: number): Promise<Wish> {
    const wish = await this.findOne(queryFilter)

    if (wish.owner.id !== userId) {
      throw new BadRequestException('Вы не можете удалить чужой подарок')
    }

    await this.wishesRepository.delete(queryFilter)

    return wish
  }

  async copy(queryFilter: FindOptionsWhere<Wish>, user: User): Promise<Wish> {
    const wish = await this.findOne(queryFilter)
    if (!wish) {
      throw new NotFoundException('Подарок не найден')
    }

    const copiedWish = this.wishesRepository.create({
      name: wish.name,
      link: wish.link,
      image: wish.image,
      price: wish.price,
      description: wish.description,
      owner: user
    })

    await this.wishesRepository.update(queryFilter, { copied: wish.copied + 1 })

    const newWish = await this.wishesRepository.save(copiedWish)

    return plainToInstance(Wish, newWish)
  }
}
