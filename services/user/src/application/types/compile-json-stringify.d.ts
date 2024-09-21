/** Docs: https://www.npmjs.com/package/compile-json-stringify */
declare module 'compile-json-stringify' {
  export type DataType =
    | 'null'
    | 'string'
    | 'number'
    | 'boolean'
    | 'array'
    | 'object'
    | 'date'
    | 'any';

  export interface IBaseJsonSchema {
    readonly type?: DataType;
    readonly items?: IBaseJsonSchema | IBaseJsonSchema[];
    readonly properties?: Record<string, IBaseJsonSchema>;
  }

  export interface IJsonSchema extends IBaseJsonSchema {
    readonly additionalProperties?: boolean;
    readonly strict?: boolean;
    readonly debug?: boolean;
  }

  export type CompiledStringify<TData> = (data: TData) => string;

  export default function compileJsonStringify<TData>(
    schema: IJsonSchema,
  ): CompiledStringify<TData>;
}
