import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm'
import { Offer } from '../../offers/entities/offer.entity'
import { User } from '../../users/entities/user.entity'

@Entity('wishes')
export class Wish {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ length: 250 })
  name: string

  @Column()
  link: string

  @Column()
  image: string

  @Column('decimal', { precision: 10, scale: 2 })
  price: number

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  raised: number

  @ManyToOne(() => User, (user) => user.wishes, { onDelete: 'CASCADE' })
  owner: User

  @Column({ length: 1024 })
  description: string

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[]

  @Column({ type: 'int', default: 0 })
  copied: number

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
