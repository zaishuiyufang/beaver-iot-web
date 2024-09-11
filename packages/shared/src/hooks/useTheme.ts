/**
 * 系统主题相关 Hook
 */
import { useMemo, useCallback } from 'react';
import {
    themes,
    // themeVariables,
    changeTheme,
    getCSSVariableValue,
    AntdThemeType,
} from '../services/theme';
import { useSharedGlobalStore } from '../stores';

export default () => {
    const theme = useSharedGlobalStore(state => state.theme);
    const antdTheme: AntdThemeType = useMemo(() => {
        return theme === 'dark' ? theme : 'default';
    }, [theme]);

    return {
        /** 当前主题 */
        theme,

        /** 主题列表 */
        themes,

        /** 组件库主题 */
        antdTheme,

        /** 主题颜色变量表 */
        // themeVariables,

        /** 变更主题 */
        changeTheme,

        /** 根据传入的 CSS 变量名获取对应值 */
        getCSSVariableValue: useCallback<typeof getCSSVariableValue>(
            vars => {
                return getCSSVariableValue(vars);
            },
            // eslint-disable-next-line react-hooks/exhaustive-deps
            [theme],
        ),
    };
};
