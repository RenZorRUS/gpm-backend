import type { IStatusService } from 'src/application/services/status.service';
import type { IStatusDto } from 'src/application/dtos/status';

export default class StatusController {
  constructor(private readonly statusService: IStatusService) {}

  public getStatus(): IStatusDto {
    return this.statusService.getStatus();
  }
}
