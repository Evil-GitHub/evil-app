import { join } from 'node:path';
import { defineConfig } from '@umijs/max';
import defaultSettings, { isMicroservice } from './defaultSettings';
import proxy from './proxy';

import routes from './routes';

const PUBLIC_PATH: string = '/';

const {
  REACT_APP_ENV = 'dev',
  APP_MODE = 'standalone',
  FRONTEND_BRANCH_NAME,
  VERSION,
  MAIN_APP_HOME_PATH = '/',
  OPENAPI_ADDRESS,
  REQUEST_ADDRESS,
  MICRO_OPENAPI_ADDRESS,
  MICRO_REQUEST_ADDRESS,
  STANDALONE_OPENAPI_ADDRESS,
  STANDALONE_REQUEST_ADDRESS,
} = process.env;

const isDev = REACT_APP_ENV === 'dev';

// microservice 微服务版本 、standalone 单机版
const FINAL_APP_MODE =
  APP_MODE === 'microservice' ? 'microservice' : 'standalone';

const pickByMode = (standalone?: string, micro?: string) => {
  return FINAL_APP_MODE === 'microservice' ? micro : standalone;
};

const FINAL_OPENAPI_ADDRESS =
  OPENAPI_ADDRESS ||
  pickByMode(STANDALONE_OPENAPI_ADDRESS, MICRO_OPENAPI_ADDRESS);

const FINAL_REQUEST_ADDRESS =
  REQUEST_ADDRESS ||
  pickByMode(STANDALONE_REQUEST_ADDRESS, MICRO_REQUEST_ADDRESS);

export { FINAL_REQUEST_ADDRESS };

export default defineConfig({
  define: {
    'process.env.FRONTEND_BRANCH_NAME': FRONTEND_BRANCH_NAME,
    'process.env.COMMIT_HASH': VERSION,
    'process.env.REACT_APP_ENV': REACT_APP_ENV,
    'process.env.APP_MODE': FINAL_APP_MODE,
    'process.env.MAIN_APP_HOME_PATH': MAIN_APP_HOME_PATH,
    'process.env.OPENAPI_ADDRESS': FINAL_OPENAPI_ADDRESS,
    'process.env.REQUEST_ADDRESS': FINAL_REQUEST_ADDRESS,
  },
  base: '/',
  hash: true,
  publicPath: PUBLIC_PATH,
  alias: {
    config: __dirname,
  },
  clickToComponent: {},

  routes,
  theme: {},
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV as keyof typeof proxy],
  fastRefresh: true,
  model: {},
  initialState: {},

  title: defaultSettings.title,
  layout: {
    locale: true,
    ...defaultSettings,
  },

  moment2dayjs: {
    preset: 'antd',
    plugins: ['duration'],
  },

  locale: {
    // default zh-CN
    default: 'zh-CN',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
  },

  antd: {
    appConfig: {},
    configProvider: {
      theme: {
        cssVar: true,
        token: {
          fontFamily: 'AlibabaSans, sans-serif',
          colorPrimary: defaultSettings.colorPrimary,
          borderRadiusLG: 4,
          borderRadius: 4,
          borderRadiusXS: 4,
          colorLink: defaultSettings.colorPrimary,
          blue: defaultSettings.colorPrimary,
        },
      },
    },
  },

  request: {},

  access: {},
  /**
   * @name <head> 中额外的 script
   * @description 配置 <head> 中额外的 script
   */
  headScripts: [{ src: join(PUBLIC_PATH, 'scripts/loading.js'), async: true }],
  //================ pro 插件配置 =================
  presets: ['umi-presets-pro'],

  openAPI: [
    {
      requestLibPath: "import { request } from '@umijs/max'",
      // 或者使用在线的版本
      schemaPath: `${FINAL_OPENAPI_ADDRESS}/v3/api-docs`,
      // schemaPath: join(__dirname, "oneapi.json"),
      mock: false,
    },
  ],
  mock: {
    include: ['mock/**/*', 'src/pages/**/_mock.ts'],
  },
  qiankun: isMicroservice ? { slave: {} } : undefined,
  /**
   * @name 是否开启 mako
   * @description 使用 mako 极速研发
   * @doc https://umijs.org/docs/api/config#mako
   */
  mako: {},
  esbuildMinifyIIFE: true,
  requestRecord: {},
  exportStatic: {},
});
