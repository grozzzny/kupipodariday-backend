import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { plainToInstance } from 'class-transformer'
import { DataSource, FindOptionsWhere, Repository } from 'typeorm'
import { Offer } from '../entities/offer.entity'
import { Wish } from '../../wishes/entities/wish.entity'
import { CreateOfferDto } from '../dto/create-offer.dto'
import { User } from '../../users/entities/user.entity'

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offersRepository: Repository<Offer>,
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
    private readonly dataSource: DataSource
  ) {}

  async create(user: User, createOfferDto: CreateOfferDto): Promise<Offer> {
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      const item = await queryRunner.manager.findOne(Wish, {
        where: { id: createOfferDto.itemId },
        relations: ['owner', 'offers']
      })

      if (!item) throw new NotFoundException('Подарок не найден')

      if (item.owner.id === user.id) {
        throw new ForbiddenException('Вы не можете платить за собственный подарок')
      }

      const totalOffers = item.offers.reduce((sum, offer) => sum + Number(offer.amount), 0)
      const newTotal = totalOffers + createOfferDto.amount

      if (newTotal > item.price) {
        throw new BadRequestException('Сумма превышает стоимость подарка')
      }

      const offer = queryRunner.manager.create(Offer, {
        amount: createOfferDto.amount,
        hidden: createOfferDto.hidden || false,
        user,
        item
      })

      await queryRunner.manager.update(Wish, { id: item.id }, { raised: newTotal })
      await queryRunner.manager.save(offer)
      await queryRunner.commitTransaction()

      return plainToInstance(Offer, offer)
    } catch (error) {
      await queryRunner.rollbackTransaction()
      throw error
    } finally {
      await queryRunner.release()
    }
  }

  async findAll(): Promise<Offer[]> {
    const offers = await this.offersRepository.find({
      relations: [
        'item',
        'user',
        'user.offers',
        'user.wishes',
        'user.wishlists',
        'user.wishlists.owner',
        'user.wishlists.items'
      ]
    })

    return plainToInstance(Offer, offers)
  }

  async findOne(queryFilter: FindOptionsWhere<Offer>): Promise<Offer> {
    const offer = await this.offersRepository.findOne({
      where: queryFilter,
      relations: [
        'item',
        'user',
        'user.offers',
        'user.wishes',
        'user.wishlists',
        'user.wishlists.owner',
        'user.wishlists.items'
      ]
    })

    if (!offer) throw new NotFoundException('Предложение не найдено')

    return plainToInstance(Offer, offer)
  }
}
