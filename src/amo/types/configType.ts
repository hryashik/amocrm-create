import { InitIntegrationType } from './initInegration';

export type ConfigType = InitIntegrationType & {
   access_token: string,
   refresh_token: string
}