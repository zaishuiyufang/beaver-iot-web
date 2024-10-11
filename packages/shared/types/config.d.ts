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
    readonly APP_TYPE: AppType;
    /** 应用版本 */
    readonly APP_VERSION: string;
    /** 应用接口 Origin */
    readonly APP_API_ORIGIN: string;
    /** 应用打包时间戳 */
    readonly BUILD_TIMESTAMP: number;
    /** 应用打包分支 */
    readonly GIT_BRANCH?: string;
    /** 应用打包时的 commit hash */
    readonly LATEST_COMMIT_HASH?: string;
}
interface ImportMeta {
    readonly env: ImportMetaEnv;
}

interface Window {
    $metaEnv: {
        /** 构建时间 */
        buildTime?: string | Date;
        /** 构建时的 Commit Hash */
        latestGitHash?: string;
    };
}
