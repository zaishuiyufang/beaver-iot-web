import react from '@vitejs/plugin-react';
import * as path from 'path';
import { defineConfig } from 'vite';
import vitePluginImport from 'vite-plugin-imp';
import stylelint from 'vite-plugin-stylelint';
import progress from 'vite-plugin-progress';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { parseEnvVariables, getViteEnvVarsConfig } from '@milesight/scripts';
import { version } from './package.json';

const isProd = process.env.NODE_ENV === 'production';
const projectRoot = path.join(__dirname, '../../');
const { WEB_DEV_PORT, WEB_API_ORIGIN, OAUTH_CLIENT_ID, OAUTH_CLIENT_SECRET } = parseEnvVariables([
    path.join(projectRoot, '.env'),
    path.join(projectRoot, '.env.local'),
    path.join(__dirname, '.env'),
    path.join(__dirname, '.env.local'),
]);
const runtimeVariables = getViteEnvVarsConfig({
    APP_TYPE: 'web',
    APP_VERSION: version,
    APP_API_ORIGIN: WEB_API_ORIGIN,
    APP_OAUTH_CLIENT_ID: OAUTH_CLIENT_ID,
    APP_OAUTH_CLIENT_SECRET: OAUTH_CLIENT_SECRET,
});
const DEFAULT_LESS_INJECT_MODULES = [
    '@import "@milesight/shared/src/styles/variables.less";',
    '@import "@milesight/shared/src/styles/mixins.less";',
];

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        nodePolyfills({
            include: ['buffer', 'process'],
            globals: {
                Buffer: true,
                process: true,
            },
        }),
        stylelint({
            fix: true,
            cacheLocation: path.join(__dirname, 'node_modules/.cache/.stylelintcache'),
            emitWarning: !isProd,
        }),
        /**
         * 优化构建速度，减少在编译时的 Tree-Shaking 检查及资源处理
         */
        vitePluginImport({
            libList: [
                {
                    libName: '@mui/material',
                    libDirectory: '',
                    camel2DashComponentName: false,
                },
                {
                    libName: '@mui/icons-material',
                    libDirectory: '',
                    camel2DashComponentName: false,
                },
            ],
        }),
        react(),
        progress(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'), // src 路径别名
        },
    },

    define: runtimeVariables,

    css: {
        preprocessorOptions: {
            less: {
                javascriptEnabled: true,
                additionalData: DEFAULT_LESS_INJECT_MODULES.join('\n'),
            },
        },
        devSourcemap: true,
    },

    esbuild: {
        drop: ['debugger'],
        pure: ['console.log', 'console.info'],
    },

    build: {
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
    },

    server: {
        host: '0.0.0.0',
        port: WEB_DEV_PORT,
        open: true,
    },
});
