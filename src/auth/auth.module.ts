import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Profile, ProfileSchema, User, UserSchema } from './schema/auth.schema';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Auth0Strategy } from './strategy/jwt.auth0.strategy';
import { PassportModule } from '@nestjs/passport';
import { Auth0MangementProvider } from 'src/auth0/auth.management.provider';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get<string>('JWT_SECRET'),
        };
      },
      inject: [ConfigService],
    }),
    // PassportModule.register({ defaultStrategy: 'jwt' }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Profile.name, schema: ProfileSchema }]),
  ],
  controllers: [AuthController],
  providers: [
    Auth0MangementProvider,
    AuthService,
    // JwtStrategy,
    Auth0Strategy,
  ],
  // exports: [Auth0Strategy],
})
export class AuthModule {}
