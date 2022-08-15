import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      datasources: {
        db: {
          url: 'mysql://test:test123@localhost:3306/recipe_app',
        },
      },
    });
  }
  async onModuleInit() {
    this.$connect();
  }

  async onModuleDestroy() {
    this.$disconnect();
  }
}
