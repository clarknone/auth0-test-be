import { IAuthGuard, PassportStrategy } from '@nestjs/passport';
import { Types } from 'mongoose';
import { ExtractJwt, Strategy } from 'passport-jwt';

export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(params: IAuthGuard | any) {
    if (params?.id) {
      params.id = new Types.ObjectId(params.id);
    }
    return params;
  }
}
