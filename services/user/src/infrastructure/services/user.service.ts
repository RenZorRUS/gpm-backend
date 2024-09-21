import type { IUserRepository } from 'src/application/repositories/user.repository';
import type { IUserService } from 'src/application/services/user.service';
import type {
  IFindManyOptions,
  IPaginationResponse,
} from 'src/application/dtos/common';
import type {
  IChangeUserDto,
  ICreateUserDto,
  IUserDto,
} from 'src/application/dtos/users';
import type { IUserMapper } from 'src/application/mappers/user.mapper';
import type { IEmailPublisher } from 'src/application/publishers/email.publisher';
import type { IUserValidator } from 'src/application/validators/user.validator';
import type { IEmailMapper } from 'src/application/mappers/email.mapper';
import type { Prisma } from '@prisma/client';

export default class UserService implements IUserService {
  private static readonly selectUserFields: Prisma.UserSelect = {
    id: true,
    firstName: true,
    lastName: true,
    middleName: true,
    email: true,
    phone: true,
    gender: true,
    dateOfBirth: true,
    isActive: true,
    createdAt: true,
    updatedAt: true,
  };

  constructor(
    private readonly emailPublisher: IEmailPublisher,
    private readonly emailMapper: IEmailMapper,
    private readonly userRepository: IUserRepository,
    private readonly userMapper: IUserMapper,
    private readonly userValidator: IUserValidator,
  ) {}

  public async findByAsync(options: Partial<IUserDto>): Promise<IUserDto> {
    const user = await this.userRepository.findOrThrowAsync({
      select: UserService.selectUserFields,
      where: options,
    });

    return user;
  }

  public async findManyByAsync(
    options: IFindManyOptions<IUserDto>,
  ): Promise<IPaginationResponse<IUserDto>> {
    const findOptions = { select: UserService.selectUserFields, ...options };

    const { data, total } =
      await this.userRepository.findManyAsync(findOptions);

    return { data, total, offset: options.offset, limit: options.limit };
  }

  public async findByIdAsync(userId: bigint): Promise<IUserDto> {
    return this.userRepository.findOrThrowAsync({
      where: { id: userId },
      select: UserService.selectUserFields,
    });
  }

  public async updateByIdAsync(
    userId: bigint,
    data: IChangeUserDto,
  ): Promise<IUserDto> {
    await this.userValidator.validateUpdateDto(userId, data);
    return this.userRepository.updateAsync({
      select: UserService.selectUserFields,
      where: { id: userId },
      data,
    });
  }

  public async deleteByIdAsync(userId: bigint): Promise<void> {
    await this.userValidator.checkUserExistenceByIdAsync(userId);
    await this.userRepository.deleteAsync({ id: userId });
  }

  public async createAsync(data: ICreateUserDto): Promise<IUserDto> {
    await this.userValidator.validateCreationDto(data);

    const createDto = await this.userMapper.mapToCreateDto(data);
    const user = await this.userRepository.createAsync({
      select: UserService.selectUserFields,
      data: createDto,
    });

    const emailVerificationMessage =
      this.emailMapper.mapUserToEmailVerificationMessage(user);
    await this.emailPublisher.publishVerificationEmailAsync(
      emailVerificationMessage,
    );

    return user;
  }
}
