export type Gender = 'FEMALE' | 'MALE';

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
