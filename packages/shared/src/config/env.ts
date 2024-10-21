// import { isLocalIP } from '../utils/tools';

// const { protocol, origin, hostname } = window.location;

// 全局暴露构建时间、构建 Hash 信息，以便快速排查问题
window.$metaEnv = {
    buildTime: window.__BUILD_TIMESTAMP__ ? new Date(window.__BUILD_TIMESTAMP__) : '',
    latestGitHash: window.__LATEST_COMMIT_HASH__,
};

/** 应用运行的模式 */
export const mode = import.meta.env.MODE;

/** 应用接口 Origin */
export const apiOrigin = window.__APP_API_ORIGIN__;

/**
 * 应用版本号
 */
export const appVersion = window.__APP_VERSION__ || '';

/** OAuth Client ID */
export const oauthClientID = window.__APP_OAUTH_CLIENT_ID__;

/** OAuth Client Secret */
export const oauthClientSecret = window.__APP_OAUTH_CLIENT_SECRET__;
