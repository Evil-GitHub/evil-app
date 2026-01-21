import { history } from '@umijs/max';
import type { AppMode } from './types';

const APP_MODE = process.env.APP_MODE as AppMode;
const MAIN_APP_HOME_PATH = process.env.MAIN_APP_HOME_PATH || '/';

export const isMicroApp = () => APP_MODE === 'microservice';

/**
 * SPA 内部跳转
 */
export const push = (path: string) => {
  history.push(path);
};

/**
 * 跳转主应用（微服务）
 */
export const jumpToMainApp = (path = '/') => {
  const { origin } = window.location;
  window.location.href = `${origin}${path}`;
};

/**
 * 智能跳转：
 * - 微服务：全量刷新到主应用
 * - 单机：前端路由
 */
export const smartNavigate = (path: string) => {
  if (isMicroApp()) {
    jumpToMainApp(path);
    return;
  }

  push(path);
};

export const getMainHomePath = () => MAIN_APP_HOME_PATH;

/**
 * 跳转登录页
 */

export const LOGIN_PATH = '/user/login';

export const goLogin = () => {
  if (isMicroApp()) {
    jumpToMainApp(LOGIN_PATH);
    return;
  }

  push(LOGIN_PATH);
};

/**
 * 退出登录
 */
export const logout = async () => {
  try {
    // 1. 清理本地状态
    localStorage.clear();
    sessionStorage.clear();

    // 2. 可选：通知主应用（微服务场景）
    window.dispatchEvent(new Event('app:logout'));
  } finally {
    goLogin();
  }
};

export const goHome = () => {
  smartNavigate(getMainHomePath());
};
