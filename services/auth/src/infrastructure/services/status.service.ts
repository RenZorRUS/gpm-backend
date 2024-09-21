import type { IStatusService } from 'src/application/services/status.service';
import type { IStatusDto } from 'src/application/dtos/status';
import type { IEnvConfig } from 'src/application/types/global';

export default class StatusService implements IStatusService {
  private statusDto: IStatusDto;

  constructor({ APP_DESCRIPTION, APP_VERSION, APP_TITLE }: IEnvConfig) {
    this.statusDto = {
      description: APP_DESCRIPTION,
      version: APP_VERSION,
      title: APP_TITLE,
      status: 'ok',
    };
  }

  public getStatus(): IStatusDto {
    return this.statusDto;
  }
}
