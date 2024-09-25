/**
 * 系统主题相关 Hook
 */
import { useLayoutEffect } from 'react';
import { useColorScheme, type CssVarsThemeOptions } from '@mui/material/styles';
import { theme } from '../services';

export default () => {
    const { mode, setMode } = useColorScheme();
    const currentMode = theme.getCurrentTheme();

    /**
     * 组件样式自定义
     * https://mui.com/material-ui/customization/theme-components/
     */
    const components: CssVarsThemeOptions['components'] = {
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
    };

    useLayoutEffect(() => {
        if (mode === currentMode) return;
        setMode(currentMode);
    }, [currentMode, mode, setMode]);

    return {
        /** 当前主题 */
        theme: mode,

        /** 主题 CSS 变量选择器 */
        colorSchemeSelector: theme.THEME_COLOR_SCHEMA_SELECTOR,

        /** 组件样式 */
        components,

        /** MUI 主题配置 */
        muiPalettes: theme.getMuiSchemes(),

        /** 切换主题 */
        setTheme: setMode,
    };
};
