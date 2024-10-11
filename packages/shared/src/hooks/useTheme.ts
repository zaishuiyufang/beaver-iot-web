/**
 * 系统主题相关 Hook
 */
import { useLayoutEffect, useMemo } from 'react';
import { useColorScheme } from '@mui/material/styles';
import { theme } from '../services';

const palettes = theme.getMuiSchemes();

export default () => {
    const { mode, setMode } = useColorScheme();
    const currentMode = theme.getCurrentTheme();

    const components = useMemo(() => {
        const themeType = mode === 'system' ? theme.SYSTEM_THEME_MODE : mode;
        const result = theme.getMuiComponents(themeType);

        return result;
    }, [mode]);

    useLayoutEffect(() => {
        if (mode === currentMode) return;
        setMode(currentMode);
    }, [currentMode, mode, setMode]);

    return {
        /** 当前主题 */
        theme: mode,

        /** 主题 CSS 变量选择器 */
        colorSchemeSelector: theme.THEME_COLOR_SCHEMA_SELECTOR,

        /** 各组件主题配置 */
        components,

        /** MUI 主题配置 */
        muiPalettes: palettes,

        /** 切换主题 */
        setTheme: setMode,

        /** 主题色 - 白 */
        white: theme.white,

        /** 主题色 - 黑 */
        black: theme.black,

        /** 主题色 - 蓝 */
        blue: theme.blue,

        /** 主题色 - 绿 */
        green: theme.green,

        /** 主题色 - 黄 */
        yellow: theme.yellow,

        /** 主题色 - 橙 */
        deepOrange: theme.deepOrange,

        /** 主题色 - 红 */
        red: theme.red,

        /** 主题色 - 灰 */
        grey: theme.grey,
    };
};
