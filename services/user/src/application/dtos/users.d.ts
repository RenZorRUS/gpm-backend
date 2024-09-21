import type { Gender } from '@prisma/client';

export interface IChangeUserDto {
  readonly firstName: string;
  readonly lastName: string;
  readonly middleName: string | null;
  readonly password?: string;
  readonly email: string;
  readonly phone: string | null;
  readonly gender: Gender | null;
  readonly dateOfBirth: Date | null;
}

export interface ICreateUserDto extends IChangeUserDto {
  readonly password: string;
}

export interface IUserDto {
  readonly id: bigint;
  readonly firstName: string;
  readonly lastName: string;
  readonly middleName: string | null;
  readonly email: string;
  readonly phone: string | null;
  readonly gender: Gender | null;
  readonly dateOfBirth: Date | null;
  readonly isActive: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
