import type {
  IFindManyOptions,
  IPaginationResponse,
} from 'src/application/dtos/common';
import type { IChangeUserDto, IUserDto } from 'src/application/dtos/users';

export interface IUserService {
  findManyByAsync(
    options: IFindManyOptions<IUserDto>,
  ): Promise<IPaginationResponse<IUserDto>>;

  updateByIdAsync(id: bigint, data: Partial<IChangeUserDto>): Promise<IUserDto>;

  findByAsync(options: Partial<IUserDto>): Promise<IUserDto>;

  findByIdAsync(userId: bigint): Promise<IUserDto>;

  createAsync(data: IChangeUserDto): Promise<IUserDto>;

  deleteByIdAsync(userId: bigint): Promise<void>;
}
