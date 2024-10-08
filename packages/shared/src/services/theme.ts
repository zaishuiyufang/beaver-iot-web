import { type PaletteMode, type CssVarsThemeOptions } from '@mui/material/styles';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
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
export const DEFAULT_THEME_MODE = isDarkMode ? 'dark' : 'light';

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

type ColorSchemesType = NonNullable<CssVarsThemeOptions['colorSchemes']>;

/**
 * 获取 MUI 主题配置
 */
export const getMuiSchemes = () => {
    const greyColor = {
        50: '#F7F8FA',
        100: '#F2F3F5',
        200: '#E5E6EB',
        300: '#C9CDD4',
        400: '#A9AEB8',
        500: '#86909C',
        600: '#6B7785',
        700: '#4E5969',
        800: '#272E3B',
        900: '#1D2129',
    };
    const lightPalette: Exclude<ColorSchemesType['light'], boolean> = {
        palette: {
            grey: greyColor,
            primary: {
                main: '#3491FA',
                light: '#5EAFFF',
                dark: '#226FD4',
            },
            secondary: {
                main: '#1261BE',
                light: '#3380CC',
                dark: '#064699',
                contrastText: '#FFFFFF',
            },
            error: {
                main: '#F13535',
                light: '#FF6661',
                dark: '#CC2328',
                contrastText: '#FFFFFF',
            },
            warning: {
                main: '#F7BA1E',
                light: '#FFD147',
                dark: '#D1940F',
                contrastText: '#FFFFFF',
            },
            info: {
                main: '#3491FA',
                light: '#5EAFFF',
                dark: '#226FD4',
                contrastText: '#FFFFFF',
            },
            success: {
                main: '#1EBA62',
                light: '#40C776',
                dark: '#10944E',
                contrastText: '#FFFFFF',
            },
            background: {
                default: '#F7F8FA',
            },
            Tooltip: {
                bg: greyColor[800],
            },
        },
    };
    const darkPalette: ColorSchemesType['dark'] = {
        palette: {
            grey: greyColor,
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
            text: {
                disabled: '#C9CDD4',
            },
            Tooltip: {
                bg: '#272E3B',
            },
        },
    };
    return {
        light: lightPalette,
        dark: darkPalette,
    };
};

/**
 * 获取 MUI 组件主题配置
 * @param mode 主题类型
 * @link https://mui.com/material-ui/customization/theme-components/
 */
export const getMuiComponents = (mode: PaletteMode = 'light') => {
    const result: CssVarsThemeOptions['components'] = {
        MuiButtonBase: {
            defaultProps: {
                // No more ripple, on the whole application 💣!
                // disableRipple: true,
            },
            // styleOverrides: {},
        },
        MuiChip: {
            defaultProps: {
                size: 'small',
            },
        },
        MuiTextField: {
            defaultProps: {
                size: 'small',
                margin: 'dense',
                sx: { my: 1.5 },
            },
        },
        MuiTab: {
            defaultProps: {
                disableRipple: true,
            },
        },
        MuiTooltip: {
            defaultProps: {
                arrow: true,
                placement: 'top',
            },
        },
        MuiSvgIcon: {
            defaultProps: {
                fontSize: 'small',
            },
        },
        MuiIconButton: {
            defaultProps: {
                size: 'small',
            },
        },
    };

    return result;
};
