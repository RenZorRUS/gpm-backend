import type { PrismaClient } from '@prisma/client';
import type {
  IFindManyDto,
  IFindManyOptions,
} from 'src/application/dtos/common';

export interface IFindOneModelOptions<TWhereInput, TSelectInput> {
  /** Conditions that should be applied to the query in order to filter the records. */
  readonly where: TWhereInput;
  /** Limits fields of the model that should be returned in the response. */
  readonly select?: TSelectInput;
}

export interface IFindManyModelOptions<TWhereInput, TSelectInput>
  extends IFindManyOptions<TWhereInput> {
  /** Limits fields of the model that should be returned in the response. */
  readonly select?: TSelectInput;
}

export interface IUpdateModelOptions<TUpdateInput, TWhereInput, TSelectInput>
  extends IFindOneModelOptions<TWhereInput, TSelectInput> {
  /** Object with key-value pairs of fields to update and their new values. */
  readonly data: TUpdateInput;
}

export interface ICreateModelOptions<TCreateInput, TSelectInput> {
  /** Object with key-value pairs of fields to create entity. */
  readonly data: TCreateInput;
  /** Limits fields of the model that should be returned in the response. */
  readonly select?: TSelectInput;
}

export interface IBaseRepository<
  TWhereUniqueInput,
  TCreateInput,
  TWhereInput,
  TSelectInput,
  TUpdateInput,
  TModel,
> {
  findManyAsync(
    options: IFindManyModelOptions<TWhereInput, TSelectInput>,
  ): Promise<IFindManyDto<TModel>>;

  updateAsync(
    options: IUpdateModelOptions<TUpdateInput, TWhereUniqueInput, TSelectInput>,
  ): Promise<TModel>;

  findAsync(
    options: IFindOneModelOptions<TWhereInput, TSelectInput>,
  ): Promise<TModel | null>;

  findOrThrowAsync(
    options: IFindOneModelOptions<TWhereInput, TSelectInput>,
  ): Promise<TModel>;

  countByAsync(where: TWhereInput): Promise<number>;

  checkExistsAsync(where: TWhereInput): Promise<boolean>;

  deleteAsync(where: TWhereUniqueInput): Promise<void>;

  createAsync(
    options: ICreateModelOptions<TCreateInput, TSelectInput>,
  ): Promise<TModel>;

  runQueriesInTransactionAsync: PrismaClient['$transaction'];
}
