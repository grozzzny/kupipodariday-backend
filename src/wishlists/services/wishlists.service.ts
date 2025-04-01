import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FindOptionsWhere, In, Repository } from 'typeorm'
import { Wishlist } from '../entities/wishlist.entity'
import { Wish } from '../../wishes/entities/wish.entity'
import { CreateWishlistDto } from '../dto/create-wishlist.dto'
import { UpdateWishlistDto } from '../dto/update-wishlist.dto'
import { plainToInstance } from 'class-transformer'

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistsRepository: Repository<Wishlist>,
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>
  ) {}

  async create(userId: number, createWishlistDto: CreateWishlistDto): Promise<Wishlist> {
    const wishes = await this.wishesRepository.findBy({ id: In(createWishlistDto.itemsId) })
    if (wishes.length !== createWishlistDto.itemsId.length) {
      throw new BadRequestException('Один или несколько подарков не найдены')
    }

    const wishlist = this.wishlistsRepository.create({
      ...createWishlistDto,
      owner: { id: userId },
      items: wishes
    })

    await this.wishlistsRepository.save(wishlist)

    return this.findOne({ id: wishlist.id })
  }

  async findOne(queryFilter: FindOptionsWhere<Wishlist>): Promise<Wishlist> {
    const wishlist = await this.wishlistsRepository.findOne({
      where: queryFilter,
      relations: ['owner', 'items']
    })
    if (!wishlist) throw new NotFoundException('Список не найден')

    return plainToInstance(Wishlist, wishlist)
  }

  async findAll(): Promise<Wishlist[]> {
    const wishlist = await this.wishlistsRepository.find({ relations: ['owner', 'items'] })
    return plainToInstance(Wishlist, wishlist)
  }

  async updateOne(queryFilter: FindOptionsWhere<Wishlist>, userId: number, updateData: UpdateWishlistDto) {
    const wishlist = await this.wishlistsRepository.findOne({ where: queryFilter, relations: ['items', 'owner'] })

    if (!wishlist) {
      throw new NotFoundException(`Список не найден`)
    }

    if (wishlist.owner.id !== userId) {
      throw new BadRequestException('Вы не можете редактировать чужой список')
    }

    if (updateData.itemsId) {
      wishlist.items = await this.wishesRepository.findBy({ id: In(updateData.itemsId) })
    }

    Object.assign(wishlist, updateData)

    await this.wishlistsRepository.save(wishlist)

    return plainToInstance(Wishlist, wishlist)
  }

  async removeOne(queryFilter: FindOptionsWhere<Wishlist>, userId: number): Promise<Wishlist> {
    const wishlist = await this.findOne(queryFilter)
    if (wishlist.owner.id !== userId) {
      throw new BadRequestException('Вы не можете удалить чужой список')
    }

    await this.wishlistsRepository.delete(queryFilter)

    return plainToInstance(Wishlist, wishlist)
  }
}
