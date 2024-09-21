import type {
  IChangeUserDto,
  ICreateUserDto,
} from 'src/application/dtos/users';
import type { IUserValidator } from 'src/application/validators/user.validator';
import type { Prisma, PrismaPromise, User } from '@prisma/client';
import type { IUserRepository } from 'src/application/repositories/user.repository';
import NotFoundError from 'src/application/errors/not-found.error';
import ValidationError from 'src/application/errors/validation.error';
import { USER_ERROR } from 'src/domain/constants/errors';

export default class UserValidator implements IUserValidator {
  private static readonly createDtoValidationFields: Prisma.UserSelect = {
    isEmailVerified: true,
    isPhoneVerified: true,
    isActive: true,
  };

  constructor(private readonly userRepository: IUserRepository) {}

  public async validateCreationDto(data: ICreateUserDto): Promise<void> {
    const [userWithEmail, userWithPhone] =
      await this.findUsersByUniqueFieldsAsync(data);

    if (userWithEmail) {
      UserValidator.verifyCreateUserDtoEmail(userWithEmail);
    }

    if (userWithPhone) {
      UserValidator.verifyCreateUserDtoPhone(userWithPhone);
    }
  }

  public async validateUpdateDto(
    userId: bigint,
    data: IChangeUserDto,
  ): Promise<void> {
    await this.checkUserExistenceByIdAsync(userId);

    const [userWithEmail, userWithPhone] =
      await this.findUsersByUniqueFieldsAsync(data);

    if (userWithEmail && userWithEmail.id !== userId) {
      UserValidator.verifyCreateUserDtoEmail(userWithEmail);
    }

    if (userWithPhone && userWithPhone.id !== userId) {
      UserValidator.verifyCreateUserDtoPhone(userWithPhone);
    }
  }

  public async checkUserExistenceByIdAsync(userId: bigint): Promise<void> {
    const isUserExists = await this.userRepository.checkExistsAsync({
      id: userId,
    });

    if (!isUserExists) {
      throw new NotFoundError(`User with ID: ${userId} not found!`);
    }
  }

  private findUsersByUniqueFieldsAsync(
    data: IChangeUserDto,
  ): Promise<(User | null)[]> {
    const queries = [
      this.userRepository.findAsync({
        select: UserValidator.createDtoValidationFields,
        where: { email: data.email },
      }) as PrismaPromise<User | null>,
    ];

    if (data.phone) {
      queries.push(
        this.userRepository.findAsync({
          select: UserValidator.createDtoValidationFields,
          where: { phone: data.phone },
        }) as PrismaPromise<User | null>,
      );
    }

    return this.userRepository.runQueriesInTransactionAsync(queries);
  }

  private static verifyCreateUserDtoEmail(user: User): void {
    if (!user.isActive) {
      throw new ValidationError(USER_ERROR.EMAIL_INACTIVE);
    } else if (user.isEmailVerified) {
      throw new ValidationError(USER_ERROR.EMAIL_ALREADY_EXISTS);
    } else if (!user.isEmailVerified) {
      throw new ValidationError(USER_ERROR.AWAITING_EMAIL_CONFIRMATION);
    }
  }

  private static verifyCreateUserDtoPhone(user: User): void {
    if (!user.isActive) {
      throw new ValidationError(USER_ERROR.PHONE_INACTIVE);
    } else if (user.isPhoneVerified) {
      throw new ValidationError(USER_ERROR.PHONE_ALREADY_EXISTS);
    } else if (!user.isPhoneVerified) {
      throw new ValidationError(USER_ERROR.AWAITING_PHONE_CONFIRMATION);
    }
  }
}
