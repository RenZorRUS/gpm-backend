import type { IChangeUserDto } from 'src/application/dtos/users';

export interface IUserValidator {
  validateCreationDto(data: IChangeUserDto): Promise<void>;
  validateUpdateDto(userId: bigint, data: IChangeUserDto): Promise<void>;
  checkUserExistenceByIdAsync(userId: bigint): Promise<void>;
}
