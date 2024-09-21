import type { IEmailPublisher } from 'src/application/publishers/email.publisher';
import type { IUserRepository } from 'src/application/repositories/user.repository';
import type { IUserMapper } from 'src/application/mappers/user.mapper';
import type { IUserValidator } from 'src/application/validators/user.validator';
import type { ICryptoService } from 'src/application/services/crypto.service';
import type { IAuthService } from 'src/application/services/auth.service';
import type { ICreateUserDto } from 'src/application/dtos/users';
import type { Gender, PrismaClient, User } from '@prisma/client';
import { jest } from '@jest/globals';
import { fakerEN_US } from '@faker-js/faker';

export const createAuthServiceMock = (): jest.Mocked<IAuthService> => ({
  validateAuthTokensOrThrowAsync:
    jest.fn<IAuthService['validateAuthTokensOrThrowAsync']>(),
});

export const createCryptoServiceMock = (): jest.Mocked<ICryptoService> => ({
  hashPassword: jest.fn<ICryptoService['hashPassword']>(),
  verifyPassword: jest.fn<ICryptoService['verifyPassword']>(),
  generateVerificationToken:
    jest.fn<ICryptoService['generateVerificationToken']>(),
});

export const createEmailPublisherMock = (): jest.Mocked<IEmailPublisher> => ({
  publishVerificationEmailAsync:
    jest.fn<IEmailPublisher['publishVerificationEmailAsync']>(),
});

export const createUserRepositoryMock = (): jest.Mocked<IUserRepository> =>
  ({
    findManyAsync: jest.fn<IUserRepository['findManyAsync']>(),
    updateAsync: jest.fn<IUserRepository['updateAsync']>(),
    findAsync: jest.fn<IUserRepository['findAsync']>(),
    findOrThrowAsync: jest.fn<IUserRepository['findOrThrowAsync']>(),
    countByAsync: jest.fn<IUserRepository['countByAsync']>(),
    checkExistsAsync: jest.fn<IUserRepository['checkExistsAsync']>(),
    deleteAsync: jest.fn<IUserRepository['deleteAsync']>(),
    createAsync: jest.fn<IUserRepository['createAsync']>(),
    runQueriesInTransactionAsync: jest.fn<PrismaClient['$transaction']>(),
  }) as unknown as jest.Mocked<IUserRepository>;

export const createUserMapperMock = (): jest.Mocked<IUserMapper> => ({
  mapToCreateDto: jest.fn<IUserMapper['mapToCreateDto']>(),
});

export const createUserValidatorMock = (): jest.Mocked<IUserValidator> => ({
  validateCreationDto: jest.fn<IUserValidator['validateCreationDto']>(),
  validateUpdateDto: jest.fn<IUserValidator['validateUpdateDto']>(),
  checkUserExistenceByIdAsync:
    jest.fn<IUserValidator['checkUserExistenceByIdAsync']>(),
});

export const buildCreateUserDto = (): ICreateUserDto => ({
  firstName: fakerEN_US.person.firstName(),
  lastName: fakerEN_US.person.lastName(),
  middleName: fakerEN_US.person.middleName(),
  password: fakerEN_US.internet.password(),
  email: fakerEN_US.internet.email(),
  phone: fakerEN_US.phone.number(),
  gender: fakerEN_US.person.sexType().toUpperCase() as Gender,
  dateOfBirth: fakerEN_US.date.birthdate(),
});

export const buildUserEntity = (data: Partial<User> = {}): User => ({
  id: data.id ?? fakerEN_US.number.bigInt(),
  firstName: data.firstName ?? fakerEN_US.person.firstName(),
  lastName: data.lastName ?? fakerEN_US.person.lastName(),
  middleName: data.middleName ?? fakerEN_US.person.middleName(),
  passwordHash: data.passwordHash ?? fakerEN_US.internet.password(),
  email: data.email ?? fakerEN_US.internet.email(),
  phone: data.phone ?? fakerEN_US.phone.number(),
  gender: data.gender ?? (fakerEN_US.person.sexType().toUpperCase() as Gender),
  dateOfBirth: data.dateOfBirth ?? fakerEN_US.date.birthdate(),
  isActive: data.isActive ?? fakerEN_US.datatype.boolean(),
  isEmailVerified: data.isEmailVerified ?? fakerEN_US.datatype.boolean(),
  emailActivationToken:
    data.emailActivationToken ?? fakerEN_US.internet.password(),
  emailActivationTokenExpiration:
    data.emailActivationTokenExpiration ?? fakerEN_US.date.recent(),
  isPhoneVerified: data.isPhoneVerified ?? fakerEN_US.datatype.boolean(),
  phoneActivationCode:
    data.phoneActivationCode ?? fakerEN_US.internet.password(),
  phoneActivationCodeExpiration:
    data.phoneActivationCodeExpiration ?? fakerEN_US.date.recent(),
  createdAt: data.createdAt ?? fakerEN_US.date.recent(),
  updatedAt: data.updatedAt ?? fakerEN_US.date.recent(),
  deletedAt: data.deletedAt ?? fakerEN_US.date.recent(),
});
