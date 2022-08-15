import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UtilsModule } from './utils/utils.module';

@Module({
  imports: [AuthModule, PrismaModule, UtilsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
