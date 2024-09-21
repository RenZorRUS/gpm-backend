import type { IStatusService } from 'src/application/services/status.service';
import type { IStatusDto } from 'src/application/dtos/status';
import type { IEnvConfig } from 'src/application/types/global';

/** Contains logic related with user service status */
export default class StatusService implements IStatusService {
  constructor(private readonly envConfig: IEnvConfig) {}

  public getStatus(): IStatusDto {
    return {
      title: this.envConfig.APP_TITLE,
      description: this.envConfig.APP_DESCRIPTION,
      version: this.envConfig.APP_VERSION,
      status: 'ok',
    };
  }
}
