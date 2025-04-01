import { Controller, Get, Post, Body, Param, Delete, Request, UseGuards, ParseIntPipe, Patch } from '@nestjs/common'
import { CreateWishlistDto } from './dto/create-wishlist.dto'
import { WishlistsService } from './services/wishlists.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { GetUser } from '../auth/decorators/get-user.decorator'
import { User } from '../users/entities/user.entity'
import { Wishlist } from './entities/wishlist.entity'
import { UpdateWishlistDto } from './dto/update-wishlist.dto'

@Controller('wishlists')
@UseGuards(JwtAuthGuard)
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Get()
  findAll(): Promise<Wishlist[]> {
    return this.wishlistsService.findAll()
  }

  @Post()
  create(@GetUser() user: User, @Body() createWishlistDto: CreateWishlistDto): Promise<Wishlist> {
    return this.wishlistsService.create(user.id, createWishlistDto)
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Wishlist> {
    return this.wishlistsService.findOne({ id })
  }

  @Patch(':id')
  update(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWishlistDto: UpdateWishlistDto
  ): Promise<Wishlist> {
    return this.wishlistsService.updateOne({ id }, user.id, updateWishlistDto)
  }

  @Delete(':id')
  remove(@GetUser() user: User, @Param('id', ParseIntPipe) id: number): Promise<Wishlist> {
    return this.wishlistsService.removeOne({ id }, user.id)
  }
}
