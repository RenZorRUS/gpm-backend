import type { ICreateUserDto } from 'src/application/dtos/users';
import type { IUserMapper } from 'src/application/mappers/user.mapper';
import type { ICryptoService } from 'src/application/services/crypto.service';
import type { Prisma } from '@prisma/client';
import type { IEnvConfig } from 'src/application/types/global';
import { addMinutesToDate } from 'src/infrastructure/utilities/date';

export default class UserMapper implements IUserMapper {
  constructor(
    private readonly cryptoService: ICryptoService,
    private readonly envConfig: IEnvConfig,
  ) {}

  public async mapToCreateDto(
    data: ICreateUserDto,
  ): Promise<Prisma.UserCreateInput> {
    const passwordHash = await this.cryptoService.hashPassword(data.password!);
    const emailActivationToken = this.cryptoService.generateVerificationToken();
    const currentDate = new Date();
    const emailActivationTokenExpiration = addMinutesToDate(
      currentDate,
      Number(this.envConfig.EMAIL_ACTIVATION_TOKEN_EXPIRATION_MIN),
    );

    return {
      firstName: data.firstName,
      lastName: data.lastName,
      middleName: data.middleName,
      passwordHash,
      email: data.email,
      phone: data.phone,
      gender: data.gender,
      dateOfBirth: data.dateOfBirth,
      emailActivationToken,
      emailActivationTokenExpiration,
    };
  }
}
