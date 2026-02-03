// config/env.ts

const {
  APP_MODE = 'standalone',
  OPENAPI_ADDRESS,
  REQUEST_ADDRESS,
  MICRO_OPENAPI_ADDRESS,
  MICRO_REQUEST_ADDRESS,
  STANDALONE_OPENAPI_ADDRESS,
  STANDALONE_REQUEST_ADDRESS,
} = process.env;

// microservice / standalone
export const FINAL_APP_MODE =
  APP_MODE === 'microservice' ? 'microservice' : 'standalone';

const pickByMode = (standalone?: string, micro?: string) => {
  return FINAL_APP_MODE === 'microservice' ? micro : standalone;
};

export const FINAL_OPENAPI_ADDRESS =
  OPENAPI_ADDRESS ||
  pickByMode(STANDALONE_OPENAPI_ADDRESS, MICRO_OPENAPI_ADDRESS);

export const FINAL_REQUEST_ADDRESS =
  REQUEST_ADDRESS ||
  pickByMode(STANDALONE_REQUEST_ADDRESS, MICRO_REQUEST_ADDRESS);
