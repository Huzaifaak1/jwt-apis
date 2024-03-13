import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal : true
    }),
    PrismaModule,
    UserModule,
    AuthModule,
    BookmarkModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
