import { LinkOutlined } from '@ant-design/icons';
import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import { AvatarDropdown, AvatarName, Footer } from '@/components';
import '@ant-design/v5-patch-for-react-19';
import type { RequestConfig, RunTimeLayoutConfig } from '@umijs/max';
import { history, Link } from '@umijs/max';
import defaultSettings from '../config/defaultSettings';
import UnAccessible from './pages/403';
import { errorConfig } from './requestErrorConfig';
import { goHome, goLogin, LOGIN_PATH } from './utils/index';

const isDev = process.env.REACT_APP_ENV === 'dev';

// 注入 COMMIT_HASH、APP_MODE
window.COMMIT_HASH = process.env.COMMIT_HASH;
window.APP_MODE = process.env.APP_MODE;

async function queryCurrentUser(): Promise<{
  code: number;
  data: {
    name: string;
    avatar: string;
    userid: string;
    access: string;
  };
}> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: {
          name: 'Admin',
          avatar: 'https://avatars.githubusercontent.com/u/8186664?v=4',
          userid: '00000001',
          access: 'admin',
        },
      });
    }, 300);
  });
}

/**
 * @see https://umijs.org/docs/api/runtime-config#getinitialstate
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: any;
  loading?: boolean;
  fetchUserInfo?: () => Promise<any | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      const msg = await queryCurrentUser();
      return msg.data;
    } catch (_error) {
      goHome();
    }
    return undefined;
  };
  // 如果不是登录页面，执行
  const { location } = history;
  if (![LOGIN_PATH].includes(location.pathname)) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: defaultSettings as Partial<LayoutSettings>,
    };
  }
  return {
    fetchUserInfo,
    settings: defaultSettings as Partial<LayoutSettings>,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({
  initialState,
  setInitialState: _setInitialState,
}) => {
  return {
    // actionsRender: () => [
    //   <Question key="doc" />,
    //   <SelectLang key="SelectLang" />,
    // ],
    avatarProps: {
      src: '/images/user.svg',
      title: <AvatarName />,
      render: (_, avatarChildren) => {
        return <AvatarDropdown>{avatarChildren}</AvatarDropdown>;
      },
    },
    waterMarkProps: {
      content: initialState?.currentUser?.name,
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      // 强制置顶
      window?.document?.getElementById('root')?.scrollIntoView(true);

      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== LOGIN_PATH) {
        goLogin();
      }
    },

    links: isDev
      ? [
          <Link key="openapi" to="/umi/plugin/openapi" target="_blank">
            <LinkOutlined />
            <span>OpenAPI 文档</span>
          </Link>,
        ]
      : [],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    unAccessible: <UnAccessible />,

    childrenRender: (children) => {
      // if (initialState?.loading) return <PageLoading />;
      return (
        <>
          {children}
          {/* {isDev && (
            <SettingDrawer
              disableUrlParams
              enableDarkTheme
              settings={initialState?.settings}
              onSettingChange={(settings) => {
                setInitialState((preInitialState) => ({
                  ...preInitialState,
                  settings,
                }));
              }}
            />
          )} */}
        </>
      );
    },
    onMenuHeaderClick: () => {
      goHome();
    },
    ...initialState?.settings,
  };
};

export const request: RequestConfig = {
  ...errorConfig,
};
