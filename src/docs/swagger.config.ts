import {SwaggerConfig} from './swgger.interface';

/**
 * Configuration for the swagger UI (found at /api).
 * Change this to suit your app!
 */
export const SWAGGER_CONFIG: SwaggerConfig = {
  title: 'auth service',
  description: ' api specs',
  version: '1.0',
  tags: ['health', 'users'],
};
