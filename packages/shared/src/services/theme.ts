import { type PaletteMode } from '@mui/material/styles';
import iotStorage from '../utils/storage';

// 缓存 key（注意：使用 iotStorage 会自动拼接 msiot. 前缀）
export const THEME_CACHE_KEY = 'theme';
/** 主题 CSS 变量选择器 */
export const THEME_COLOR_SCHEMA_SELECTOR = 'data-theme';

/**
 * 判断浏览器当前是否为黑暗模式
 */
const isDarkMode = ((): boolean => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
})();

// 默认系统主题
// 首次进入系统时，根据当前是否为深色模式来决定默认主题
const DEFAULT_THEME_MODE = isDarkMode ? 'dark' : 'light';

/**
 * 初始化系统主题
 *
 * 优先根据缓存中的主题类型变更当前主题，若无缓存则默认为 light 主题
 */
export const initTheme = () => {
    const type = iotStorage.getItem<PaletteMode>(THEME_CACHE_KEY) || DEFAULT_THEME_MODE;
    const html = document.querySelector('html');

    html?.setAttribute('data-theme', type);
};

/**
 * 获取当前系统主题类型
 */
export const getCurrentTheme = (): PaletteMode => {
    const mode = iotStorage.getItem<PaletteMode>(THEME_CACHE_KEY);

    return mode || DEFAULT_THEME_MODE;
};

/**
 * 获取 MUI 主题配置
 */
export const getMuiSchemes = () => {
    return {
        light: {
            palette: {
                primary: {
                    main: '#3491FA',
                    light: '#5EAFFF',
                    dark: '#226FD4',
                },
                secondary: {
                    main: '#1261BE',
                    light: '#3380CC',
                    dark: '#064699',
                },
                error: {
                    main: '#F13535',
                    light: '#FF6661',
                    dark: '#CC2328',
                },
                warning: {
                    main: '#F7BA1E',
                    light: '#FFD147',
                    dark: '#D1940F',
                },
                info: {
                    main: '#3491FA',
                    light: '#5EAFFF',
                    dark: '#226FD4',
                },
                success: {
                    main: '#1EBA62',
                    light: '#40C776',
                    dark: '#10944E',
                },
                background: {
                    default: '#F7F8FA',
                },
            },
        },
        dark: {
            palette: {
                primary: {
                    main: '#5eafff',
                    light: '#3491FA',
                    dark: '#87C7FF',
                },
                secondary: {
                    main: '#3380cc',
                    light: '#1261BE',
                    dark: '#599DD9',
                },
                error: {
                    main: '#FF6661',
                    light: '#F13535',
                    dark: '#FF928A',
                },
                warning: {
                    main: '#ffd147',
                    light: '#F7BA1E',
                    dark: '#FFE070',
                },
                info: {
                    main: '#5eafff',
                    light: '#3491FA',
                    dark: '#87C7FF',
                },
                success: {
                    main: '#40C776',
                    light: '#1EBA62',
                    dark: '#66D48E',
                },
                background: {
                    default: '#000000',
                },
            },
        },
    };
};
