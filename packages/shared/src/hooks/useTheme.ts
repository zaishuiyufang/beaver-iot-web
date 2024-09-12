/**
 * 系统主题相关 Hook
 */
import { useLayoutEffect } from 'react';
import { useColorScheme } from '@mui/material/styles';
import { theme } from '../services';

export default () => {
    const { mode, setMode } = useColorScheme();
    const currentMode = theme.getCurrentTheme();

    useLayoutEffect(() => {
        if (mode === currentMode) return;
        setMode(currentMode);
    }, [currentMode, mode, setMode]);

    return {
        /** 当前主题 */
        theme: mode,

        /** 主题 CSS 变量选择器 */
        colorSchemeSelector: theme.THEME_COLOR_SCHEMA_SELECTOR,

        /** MUI 主题配置 */
        muiPalettes: theme.getMuiSchemes(),

        /** 切换主题 */
        setTheme: setMode,
    };
};
