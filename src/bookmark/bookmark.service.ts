import { ForbiddenException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class BookmarkService {
    constructor(private prisma : PrismaService){}

    async addBookmark(user : User, createBookmarkDto : CreateBookmarkDto ){
        if(user){
            const data = await this.prisma.bookmark.create({
                data:{
                    link: createBookmarkDto.link,
                    desc : createBookmarkDto.desc,
                    title : createBookmarkDto.title,
                    user: {connect:{id:user.id}}
                }
            })
            return {
                data : data,
                message : "Successfully added a bookmark",
                status : true
            }
        }
        else{
            throw new ForbiddenException("Please login first");
        }
        
    }

    async getArticlesOfUser(userId : number){
        if(!userId){
            throw new ForbiddenException("Unauthorised! Please login again");
        }
        const data = await this.prisma.bookmark.findMany({
            where:{
                userId : userId               
            },
            include:{
                user : false
            }
        });
        return data;
    }
}
