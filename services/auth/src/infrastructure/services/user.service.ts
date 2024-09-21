import type { IUserMapper } from 'src/application/mappers/user.mapper';
import type { IHttpClient } from 'src/application/clients/http.client';
import type { IUserDto } from 'src/application/dtos/users';
import type { ILogger } from 'src/application/loggers/logger';
import type {
  FindUserOptions,
  IUserService,
} from 'src/application/services/user.service';
import InternalServerError from 'src/application/errors/internal.server.error';
import { HTTP_HEADER, MIME_TYPE } from 'src/domain/constants/http';
import { USER_ERROR } from 'src/domain/constants/errors';

export default class UserService implements IUserService {
  private static readonly FIND_USER_BY_PATH = '/api/v1/users/find';
  private static readonly JSON_HEADERS = {
    [HTTP_HEADER.CONTENT_TYPE]: MIME_TYPE.JSON,
  };

  constructor(
    private readonly userHttpClient: IHttpClient,
    private readonly userMapper: IUserMapper,
    private readonly logger: ILogger,
  ) {}

  public async findByOrThrowAsync(options: FindUserOptions): Promise<IUserDto> {
    const { data, error } = await this.userHttpClient.postAsync<IUserDto>({
      body: this.userMapper.serializeUserDto(options),
      path: UserService.FIND_USER_BY_PATH,
      headers: UserService.JSON_HEADERS,
    });

    if (error) {
      throw error;
    }

    if (typeof data === 'string') {
      this.logger.error(
        `Failed to parse data: ${data} from POST: ${UserService.FIND_USER_BY_PATH}`,
      );
      throw new InternalServerError(USER_ERROR.FAILED_TO_PARSE_USER);
    }

    return data!;
  }
}
