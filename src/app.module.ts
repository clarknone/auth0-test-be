import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UnauthorizedExceptionFilter } from './helper/exceptions/filters/permission.exception';
import { ServiceExceptionFilter } from './helper/exceptions/filters/service.exception';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URL),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: ServiceExceptionFilter },
    { provide: APP_FILTER, useClass: UnauthorizedExceptionFilter },
  ],
})
export class AppModule {}
