export interface IErrorDto {
  /** Error name */
  readonly name: string;
  /** Error message */
  readonly message: string;
}

export interface IPaginationQuery {
  /** The maximum number of records to return. */
  readonly limit?: number;
  /** The number of records to skip before returning the first record. */
  readonly offset?: number;
}

export interface IPaginationResponse<TModel> {
  /** The array of records that match the query. */
  readonly data: TModel[];
  /** The number of records to skip before returning the first record. */
  readonly offset: number;
  /** The maximum number of records to return. */
  readonly limit: number;
  /** The total number of records that match the query. */
  readonly total: number;
}

export interface IFindManyDto<TModel> {
  /** The total number of records that match the query. */
  readonly total: number;
  /** The array of records that match the query limit and offset. */
  readonly data: TModel[];
}

export interface IFindManyOptions<TWhereInput> {
  /** The maximum number of records to return. */
  readonly limit: number;
  /** The number of records to skip before returning the first record. */
  readonly offset: number;
  /** Conditions that should be applied to the query in order to filter the records. */
  readonly where?: TWhereInput;
}
