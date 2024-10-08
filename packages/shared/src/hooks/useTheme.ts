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
        const themeType = mode === 'system' ? theme.DEFAULT_THEME_MODE : mode;
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
    };
};
