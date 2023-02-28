import {
  Controller,
  Post,
  Body,
  BadRequestException,
  UseGuards,
  Get,
  Put,
} from '@nestjs/common';
import { isInstance } from 'class-validator';
import { AuthService } from './auth.service';
import { GetAuthUser } from './decorators/user.decorators';
import {
  EditProfileDto,
  ForgotPasswordDto,
  RefreshTokenDto,
  ResetPasswordDto,
  SignInDto,
  SignUpDto,
} from './dto/create-auth.dto';
import { JwtAuthGuard } from '../helper/guard/auth.guard';
import { IAuthUser, IProfileUser } from './interfaces/auth.interface';
import { IErrorResponse } from './interfaces/response.interface';
import { JwtAdminGuard } from 'src/helper/guard/admin.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() data: SignUpDto): Promise<IAuthUser> {
    return this.authService.signup(data);
  }

  @Post('login')
  async login(@Body() data: SignInDto): Promise<IAuthUser> {
    return this.authService.signin(data);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@GetAuthUser() user: IAuthUser) {
    return this.authService.logout(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  profile(@GetAuthUser() user: IAuthUser): Promise<IProfileUser> {
    return this.authService.profile(user);
  }
  
  @UseGuards(JwtAuthGuard,JwtAdminGuard)
  @Get('profile/admin')
  profileAdmin(@GetAuthUser() user: IAuthUser): Promise<IProfileUser> {
    return this.authService.profile(user);
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile')
  updateProfile(
    @GetAuthUser() user: IAuthUser,
    @Body() data: EditProfileDto,
  ): Promise<IProfileUser> {
    return this.authService.editProfile(user, data);
  }

  @UseGuards(JwtAuthGuard)
  @Get('test')
  testAuth0(@GetAuthUser() user: IAuthUser): Promise<IProfileUser> {
    return this.authService.profile(user);
  }

  @Post('refresh')
  refresh(@Body() data: RefreshTokenDto) {
    return this.authService.refreshToken(data);
  }

  @UseGuards(JwtAuthGuard)
  @Post('verify/email')
  verifyEmail(@GetAuthUser() user: IAuthUser) {
    return this.authService.verifyEmail(user);
  }

  @Post('forgotpassword')
  forgotPassword(@Body() data: ForgotPasswordDto) {
    return this.authService.forgotPassword(data);
  }

  @Post('resetpassword')
  resetPassword(@Body() data: ResetPasswordDto) {
    return this.authService.resetPassword(data);
  }
}
