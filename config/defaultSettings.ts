import type { ProLayoutProps } from '@ant-design/pro-components';

export const isMicroservice = process.env.APP_MODE === 'microservice';

/**
 * @name
 */
const Settings: ProLayoutProps & {
  pwa?: boolean;
  logo?: string;
  TOKEN_KEY: string;
} = {
  navTheme: 'light',
  colorPrimary: '#13c2c2',
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  title: 'Evil APP',
  pwa: true,
  logo: '/images/logo.png',
  iconfontUrl: '',
  token: {
    pageContainer: {
      paddingBlockPageContainerContent: 24,
      paddingInlinePageContainerContent: 24,
    },
    sider: {
      colorMenuBackground: '#fff',
      colorTextMenuSelected: '#13c2c2',
      colorTextMenuActive: '#13c2c2',
      colorTextMenuItemHover: '#13c2c2',
    },
  },
  TOKEN_KEY: isMicroservice ? 'RKLINK_CONSOLE_TOKEN' : 'RKLINK_TOKEN',
};

export default Settings;
