import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FindOptionsWhere, Repository } from 'typeorm'
import { Offer } from '../entities/offer.entity'
import { Wish } from '../../wishes/entities/wish.entity'
import { CreateOfferDto } from '../dto/create-offer.dto'
import { User } from '../../users/entities/user.entity'
import { UpdateOfferDto } from '../dto/update-offer.dto'
import { plainToInstance } from 'class-transformer'

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offersRepository: Repository<Offer>,
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>
  ) {}

  async create(user: User, createOfferDto: CreateOfferDto): Promise<Offer> {
    const item = await this.wishesRepository.findOne({
      where: { id: createOfferDto.itemId },
      relations: ['offers']
    })

    if (!item) throw new NotFoundException('Подарок не найден')

    const totalOffers = item.offers.reduce((sum, offer) => sum + offer.amount, 0)
    if (totalOffers + createOfferDto.amount > item.price) {
      throw new BadRequestException('Сумма превышает стоимость подарка')
    }

    const offer = this.offersRepository.create({
      amount: createOfferDto.amount,
      hidden: createOfferDto.hidden || false,
      user,
      item
    })

    const newOffer = await this.offersRepository.save(offer)

    return plainToInstance(Offer, newOffer)
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

  // ???
  async updateOne(queryFilter: FindOptionsWhere<Offer>, updateData: UpdateOfferDto) {
    // return this.offersRepository.update(queryFilter, updateData)
    const offer = await this.offersRepository.findOne({ where: queryFilter })

    if (!offer) {
      throw new NotFoundException('Предложение не найдено')
    }

    await this.offersRepository.update(queryFilter, updateData)
    return this.offersRepository.findOne({ where: queryFilter, relations: ['user', 'item'] })
  }

  async removeOne(queryFilter: FindOptionsWhere<Offer>): Promise<void> {
    await this.offersRepository.delete(queryFilter)
  }
}
