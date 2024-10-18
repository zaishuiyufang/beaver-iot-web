/**
 * 构建时注入的环境变量
 */
interface ImportMetaEnv {
    /**
     * 应用运行的模式
     * @param development 本地开发环境
     * @param production  CI 构建环境
     */
    readonly MODE: 'development' | 'production';
    /** 应用类型 */
    // readonly APP_TYPE: AppType;
    /** 应用版本 */
    readonly APP_VERSION: string;
    /** 应用接口 Origin */
    readonly APP_API_ORIGIN: string;
    /** 应用 OAuth Client ID */
    readonly APP_OAUTH_CLIENT_ID: string;
    /** 应用 OAuth Client Secret */
    readonly APP_OAUTH_CLIENT_SECRET: string;
    /** 应用打包时间戳 */
    // readonly BUILD_TIMESTAMP: number;
    /** 应用打包分支 */
    // readonly GIT_BRANCH?: string;
    /** 应用打包时的 commit hash */
    // readonly LATEST_COMMIT_HASH?: string;
}
// 定义一个模块类型
type ModuleType = {
    [key: string]: () => Promise<any>;
};
interface ImportMeta {
    readonly env: ImportMetaEnv;
    readonly glob: (pattern: string, options?: Record<string, any>) => ModuleType;
}

interface Window {
    $metaEnv: {
        /** 构建时间 */
        buildTime?: string | Date;
        /** 构建时的 Commit Hash */
        latestGitHash?: string;
    };
}
