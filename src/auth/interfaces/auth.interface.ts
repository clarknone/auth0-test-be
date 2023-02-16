import { Types } from 'mongoose';

export interface IAuthUser {
  token: string;
  refreshToken: string;
  email: string;
  type: number;
  fullName?: string;
  user: string;
  id: Types.ObjectId;
  isVerified:boolean,
}

export interface IProfileUser {
  fullname?: string;
  phone?: string;
}
