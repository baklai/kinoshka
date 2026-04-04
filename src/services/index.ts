import { uakino } from '@/services/uakino.service';
import { ServiceType } from '@/types/service.type';

export const DEFAULT_SERVICE = 'uakino';

export const DEFAULT_CATEGORY = 'not selected';

export const SERVICES: Record<string, ServiceType> = {
  uakino
};
