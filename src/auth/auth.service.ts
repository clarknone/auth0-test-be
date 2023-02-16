import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  EditProfileDto,
  ForgotPasswordDto,
  RefreshTokenDto,
  ResetPasswordDto,
  SignInDto,
  SignUpDto,
} from './dto/create-auth.dto';
import { IAuthUser, IProfileUser } from './interfaces/auth.interface';
import { IErrorResponse } from './interfaces/response.interface';
import {
  Profile,
  ProfileDocument,
  User,
  UserDocument,
} from './schema/auth.schema';
import * as bcrypt from 'bcrypt';
import { parseDBError } from 'src/helper/main';
import { ServiceException } from 'src/helper/exceptions/exceptions/service.layer.exception';
import { JwtService } from '@nestjs/jwt';
import { bruteForceCheck } from './helpers/services/auth.helper';
import { Auth0MangementProvider } from 'src/auth0/auth.management.provider';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private UserSchema: Model<UserDocument>,
    @InjectModel(Profile.name) private ProfileSchema: Model<ProfileDocument>,
    private jwtService: JwtService,
    private auth0Management: Auth0MangementProvider,
  ) {}

  async signup(data: SignUpDto): Promise<IAuthUser> {
    return this.UserSchema.find({ email: data.email })
      .then(async (users) => {
        if (users.length) {
          throw new ServiceException({ error: 'email already exist' });
        }
        const user = new this.UserSchema({ ...data });
        const password = await bcrypt.hash(user.password, 10);
        user.password = password;
        await user.save();
        return this.signUser(user);
      })
      .catch((e) => {
        throw new ServiceException({ error: parseDBError(e) });
      });
  }

  async signin(data: SignInDto): Promise<IAuthUser> {
    return this.UserSchema.findOne({ email: data.email })
      .then(async (user) => {
        if (!user) {
          throw new ServiceException({ error: 'User not found' });
        }
        if (!(await bruteForceCheck(user))) {
          throw new ServiceException({
            error: 'Too many attempts, Try again in five minutes',
          });
        }

        if (await bcrypt.compare(data.password, user.password)) {
          user.attempt = 0;
          await user.save();
          return this.signUser(user);
        }
        throw new ServiceException({ error: 'incorrect password' });
      })
      .catch((e) => {
        throw new ServiceException({ error: parseDBError(e) });
      });
  }

  async profile(data: IAuthUser): Promise<IProfileUser> {
    return this.ProfileSchema.findOne({ authId: data.user })
      .then(async (user) => {
        if (!user) {
          throw new ServiceException({ error: 'User not found' });
        }
        return user;
      })
      .catch((e) => {
        throw new ServiceException({ error: parseDBError(e) });
      });
  }

  async editProfile(
    authUser: IAuthUser,
    data: EditProfileDto,
  ): Promise<IProfileUser> {
    return this.ProfileSchema.findOneAndUpdate(
      { authId: authUser.user },
      data,
      {
        new: true,
        upsert: true,
      },
    )
      .then(async (user) => {
        return this.auth0Management
          .updateUser(
            { id: user.authId },
            { given_name: user.fullname, phone_number: user.phone },
          )
          .then((res) => {
            // console.log('profile editeed', { res });
            return user;
          })
          .catch((e) => {
            // console.log({ e });
            throw new ServiceException({ error: parseDBError(e) });
          });
      })
      .catch((e) => {
        // console.log({ name: 'main', e });
        throw new ServiceException({ error: parseDBError(e) });
      });
  }

  async refreshToken(data: RefreshTokenDto): Promise<IAuthUser> {
    return this.UserSchema.findOne({ refreshToken: data.refreshToken })
      .then((user) => {
        console.log(user);
        if (!user) {
          throw new ServiceException({
            error: 'invalid refresh token',
            status: 401,
          });
        }
        if (!user.isActive) {
          throw new ServiceException({ error: 'session expired', status: 401 });
        }
        return this.signUser(user);
      })
      .catch((e) => {
        throw new ServiceException({ error: parseDBError(e) });
      });
  }

  async forgotPassword(data: ForgotPasswordDto) {}
  async resetPassword(data: ResetPasswordDto) {}

  async logout(authUser: IAuthUser): Promise<void> {
    this.UserSchema.findByIdAndUpdate(authUser.id, { isActive: false }).catch(
      (e) => {
        throw new ServiceException({ error: parseDBError(e) });
      },
    );
  }

  async signUser(user: UserDocument, save = true): Promise<IAuthUser> {
    const token: string = this.jwtService.sign(
      {
        email: user.email,
        type: user.type,
        id: user._id,
      },
      { expiresIn: '45hr' },
      // { expiresIn: '15min' },
    );

    const refreshToken: string = this.jwtService.sign(
      {
        email: user.email,
        id: user._id,
      },
      { expiresIn: '3d' },
    );

    const authUser: IAuthUser = {
      token,
      refreshToken,
      email: user.email,
      id: user._id,
      user: user.email,
      isVerified: !!user.unitId,
      type: user.type,
      fullName: user.fullname,
    };
    user.refreshToken = refreshToken;
    user.isActive = true;
    save && (await user.save());

    return authUser;
  }
}
