import type { IStatusService } from 'src/application/services/status.service';
import type { IStatusDto } from 'src/application/dtos/status';
import type { IEnvConfig } from 'src/application/types/global';

export default class StatusService implements IStatusService {
  constructor(private readonly envConfig: IEnvConfig) {}

  public getStatus(): IStatusDto {
    return {
      version: this.envConfig.APP_VERSION,
      title: this.envConfig.APP_TITLE,
      description: this.envConfig.APP_DESCRIPTION,
      status: 'ok',
    };
  }
}
