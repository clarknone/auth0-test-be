import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class CreateAuthDto {}

export class SignUpDto {
  @IsNotEmpty()
  @IsString()
  fullname: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsPhoneNumber('NG')
  phone: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class SignInDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class RefreshTokenDto {
  @IsNotEmpty()
  refreshToken: string;
}

export class ForgotPasswordDto {
  @IsNotEmpty()
  email: string;
}

export class EditProfileDto {
  @IsNotEmpty()
  @IsString()
  fullname: string; 
  
  @IsOptional()
  @IsString()
  phone?: string;
}

export class ResetPasswordDto {
  @IsNotEmpty()
  user: string;

  @IsNumber()
  @IsNotEmpty()
  code: string;

  @IsNotEmpty()
  password: string;
}
