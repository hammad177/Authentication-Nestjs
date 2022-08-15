import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtUtils } from './JwtUtils.service';

@Module({
  imports: [JwtModule.register({})],
  providers: [JwtUtils],
  exports: [JwtUtils],
})
export class UtilsModule {}
