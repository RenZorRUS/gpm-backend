import type { IUserDto } from 'src/application/dtos/users';
import type { ILoginDto } from 'src/application/dtos/auth';
import { fakerEN_US } from '@faker-js/faker';

export const buildUserDto = (): IUserDto => ({
  id: fakerEN_US.number.int() as unknown as bigint,
  firstName: fakerEN_US.person.firstName(),
  lastName: fakerEN_US.person.lastName(),
  middleName: fakerEN_US.person.middleName(),
  email: fakerEN_US.internet.email(),
  phone: fakerEN_US.phone.number({ style: 'international' }),
  gender: fakerEN_US.person.sex().toUpperCase() as IUserDto['gender'],
  dateOfBirth: fakerEN_US.date.birthdate(),
  isActive: fakerEN_US.datatype.boolean(),
  createdAt: fakerEN_US.date.recent(),
  updatedAt: fakerEN_US.date.recent(),
});

export const buildLoginDto = (isByEmail = true): ILoginDto => ({
  password: fakerEN_US.internet.password(),
  email: isByEmail ? fakerEN_US.internet.email() : undefined,
  phone: !isByEmail ? fakerEN_US.phone.number() : undefined,
});
