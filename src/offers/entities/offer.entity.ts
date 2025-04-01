import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { User } from '../../users/entities/user.entity'
import { Wish } from '../../wishes/entities/wish.entity'

@Entity('offers')
export class Offer {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => User, (user) => user.offers, { onDelete: 'CASCADE' })
  user: User

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number

  @Column({ default: false })
  hidden: boolean

  @ManyToOne(() => Wish, (wish) => wish.offers, { onDelete: 'CASCADE' })
  item: Wish

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
