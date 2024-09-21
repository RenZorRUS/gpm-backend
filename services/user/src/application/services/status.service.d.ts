import type { IStatusDto } from 'src/application/dtos/status';

export interface IStatusService {
  getStatus(): IStatusDto;
}
