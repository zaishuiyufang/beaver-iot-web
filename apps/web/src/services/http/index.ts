export { isRequestSuccess, getResponseData, awaitWrap } from './client';

export {
    default as deviceAPI,
    type DeviceDetail,
    type DeviceEntity,
    type DeviceAPISchema,
} from './device';

export { default as entityAPI, type EntityAPISchema } from './entity';
export { default as integrationAPI, type IntegrationAPISchema } from './integration';
export { default as globalAPI, type GlobalAPISchema } from './global';
