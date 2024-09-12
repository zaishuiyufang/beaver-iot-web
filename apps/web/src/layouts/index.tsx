import { useLocation } from 'react-router';
import { CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useI18n, useTheme } from '@milesight/shared/src/hooks';

import BasicLayout from './BasicLayout';
import BlankLayout from './BlankLayout';

function Layout() {
    const location = useLocation();
    const { muiLocale } = useI18n();
    const { muiPalettes, colorSchemeSelector } = useTheme();
    const muiTheme = createTheme(
        {
            colorSchemes: { light: muiPalettes.light, dark: muiPalettes.dark },
            cssVariables: {
                colorSchemeSelector,
            },
        },
        muiLocale!,
    );

    // Todo: lang 为 undefined 时，说明文案还未加载完成，此时需全局 loading 等待
    // console.log({ lang, muiLocale });

    if (['/auth/login', '/auth/register', '/403', '/404', '/500'].includes(location.pathname)) {
        return (
            <ThemeProvider theme={muiTheme}>
                <CssBaseline />
                <BlankLayout />
            </ThemeProvider>
        );
    }

    return (
        <ThemeProvider theme={muiTheme}>
            <CssBaseline />
            <BasicLayout />
        </ThemeProvider>
    );
}

export default Layout;
