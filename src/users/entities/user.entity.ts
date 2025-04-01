import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { Wish } from '../../wishes/entities/wish.entity'
import { Offer } from '../../offers/entities/offer.entity'
import { Wishlist } from '../../wishlists/entities/wishlist.entity'
import {Exclude} from "class-transformer";

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true, length: 30 })
  username: string

  @Column({ length: 200, default: 'Пока ничего не рассказал о себе' })
  about: string

  @Column({ default: 'https://i.pravatar.cc/300' })
  avatar: string

  @Column({ unique: true })
  email: string

  @Column()
  @Exclude()
  password: string

  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[]

  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[]

  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
  wishlists: Wishlist[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
