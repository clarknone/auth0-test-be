import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { isEmail, isMobilePhone } from 'class-validator';
import { HydratedDocument, Types } from 'mongoose';
import * as crypto from 'crypto';
// export type UserDocument = User | Document;
export type UserDocument = HydratedDocument<User>;
export type ResetTokenDocument = HydratedDocument<ResetToken>;
export type ProfileDocument = HydratedDocument<Profile>;

@Schema({ timestamps: true })
export class User {
  @Prop({ type: String, required: [true, 'Full Name is required'] })
  fullname: string;

  @Prop({
    type: String,
    transform: (val: string) => (val ? val.toLocaleLowerCase() : val),
    required: [true, 'Email is required'],
    validate: [
      { validator: isEmail, message: (val) => 'please enter a valid email' },
    ],
  })
  email: string;

  @Prop({
    type: String,
    validate: [
      {
        validator: isMobilePhone,
        message: (val) => 'please enter a valid phone Number',
      },
    ],
  })
  phone: string;

  @Prop({ type: String, required: [true, 'Password is required'] })
  password: string;

  @Prop({ type: String })
  avatar: string;

  @Prop({ type: String })
  authId: string;

  @Prop({ type: String, default: crypto.randomUUID })
  uuid: string;

  @Prop({ type: String })
  location: string;

  @Prop({ type: Number, default: 0 })
  type: number;

  @Prop({ type: Number, default: 0 })
  attempt: number;

  @Prop({ type: Boolean, default: false })
  isActive: boolean;

  @Prop({ type: String })
  refreshToken: string;

  @Prop({ type: String })
  unitId: string;

  @Prop({ type: Date })
  last_attempt: Date;
}

@Schema({ timestamps: true })
export class Profile {
  @Prop({ type: String })
  fullname: string;
  
  @Prop({ type: String })
  phone: string;

  @Prop({ type: String })
  authId: string;
}

@Schema({ timestamps: true })
export class ResetToken {
  @Prop({ type: Types.ObjectId, ref: 'User', unique: true })
  user: User;

  @Prop({ type: Number, required: true })
  code: number;

  @Prop({ type: Number, default: 0 })
  attempt: number;

  @Prop({ type: String, default: 'password', enum: ['password'] })
  type: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
export const ProfileSchema = SchemaFactory.createForClass(Profile);
export const ResetTokenSchema = SchemaFactory.createForClass(ResetToken);
