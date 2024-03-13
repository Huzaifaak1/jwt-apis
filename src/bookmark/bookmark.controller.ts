import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { GetUser } from 'src/decorator/get-user.decorator';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';


@Controller('bookmark')
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {
  }

  
  @Post('')
  @UseGuards(AuthGuard('jwt'))
  addBookmark(@GetUser() user: User,@Body() createBookmarkDto : CreateBookmarkDto){
      return this.bookmarkService.addBookmark(user,createBookmarkDto);
  }

  @Get('/article')
  @UseGuards(AuthGuard('jwt'))
  getArticlesOfUser(@GetUser() user : User){
    return this.bookmarkService.getArticlesOfUser(user?.id);
  }


}
