import { execSync } from 'child_process';
import { ESBuildOptions } from 'vite';
import { staticImportedScan, CustomChunk } from '../plugins';

/**
 * 拼接生成运行时变量
 * @param vars 变量对象
 */
export const getViteEnvVarsConfig = (vars: Record<string, any>) => {
    let hash = '';
    let branch = '';
    try {
        branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf-8' }).trim();
        hash = execSync(`git log -1 --format="%H" ${branch}`, { encoding: 'utf-8' }).trim();
    } catch (e: any) {
        console.error(
            '🚫 Unable to get the latest commit hash. Please ensure that the current directory is the root directory of the Git repository and that a branch exists:',
            e?.message,
        );
    }

    const result: Record<string, any> = {
        'import.meta.env.BUILD_TIMESTAMP': Date.now(),
        'import.meta.env.GIT_BRANCH': JSON.stringify(branch || ''),
        'import.meta.env.LATEST_COMMIT_HASH': JSON.stringify(hash || ''),
    };

    Object.keys(vars).forEach(key => {
        result[`import.meta.env.${key}`] = JSON.stringify(vars[key]);
    });

    return result;
};

/**
 * 获取通用构建配置
 */
export const getViteBuildConfig = () => {
    return {
        // sourcemap: 'hidden',
        commonjsOptions: {
            transformMixedEsModules: true,
        },
        terserOptions: {
            compress: {
                drop_debugger: true,
                pure_funcs: ['console.log', 'console.info'],
            },
        },
        rollupOptions: {
            output: {
                assetFileNames: assetInfo => {
                    const info = assetInfo.name.split('.');
                    let extType = info[info.length - 1];
                    if (/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/i.test(assetInfo.name)) {
                        extType = 'media';
                    } else if (/\.(png|jpe?g|gif|svg)(\?.*)?$/.test(assetInfo.name)) {
                        extType = 'img';
                    } else if (/\.(woff2?|eot|ttf|otf)(\?.*)?$/i.test(assetInfo.name)) {
                        extType = 'font';
                    }
                    return `assets/${extType}/[name]-[hash][extname]`;
                },
                chunkFileNames: 'assets/js/[name]-[hash].js',
                entryFileNames: 'assets/js/[name]-[hash].js',
            },
        },
    };
};

/**
 * 获取通用 Esbuild 配置
 */
export const getViteEsbuildConfig = () => {
    const config: ESBuildOptions = {
        drop: ['debugger'],
        pure: ['console.log', 'console.info'],
    };
    return config;
};

// 公共 Lib
const baseLibs = [
    'react',
    'qs',
    'ahooks',
    'axios',
    'immer',
    'lodash-es',
    'moment',
    'ysd-iot',
    'zustand',
];

/**
 * 通用 Vite 分包策略
 */
export const customChunkSplit: CustomChunk = ({ id }, { getModuleInfo }) => {
    // CSS 分包
    if (/\.(css|less)/.test(id)) {
        if (/src\/styles\/index\.less/.test(id)) {
            return 'style-common';
        }

        if (/shared\/src\//.test(id)) {
            return 'style-shared';
        }

        return 'style-pages';
    }

    // 国际化文案分包
    if (/packages\/locales\//.test(id)) {
        const match = /\/lang\/(.+)\//.exec(id);
        const lang = match && match[1];

        if (lang) return `i18n-${lang}`;

        return `i18n-helper`;
    }

    if (baseLibs.some(key => id.includes(key))) {
        return 'vendor-base';
    }

    if (/packages\/shared\//.test(id)) {
        if (staticImportedScan(id, getModuleInfo, new Map(), [])) {
            return 'shared';
        }
    }
};
