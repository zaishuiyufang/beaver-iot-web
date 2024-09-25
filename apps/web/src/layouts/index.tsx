import { useMatches } from 'react-router';
import { CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useI18n, useTheme } from '@milesight/shared/src/hooks';
import { ConfirmProvider } from '@/components';
import BasicLayout from './BasicLayout';
import BlankLayout from './BlankLayout';

const DEFAULT_LAYOUT = 'basic';
const layouts: Record<string, React.ReactNode> = {
    basic: <BasicLayout />,
    blank: <BlankLayout />,
};

function Layout() {
    const routeMatches = useMatches();
    const { muiLocale } = useI18n();
    const { muiPalettes, components, colorSchemeSelector } = useTheme();
    const muiTheme = createTheme(
        {
            colorSchemes: { light: muiPalettes.light, dark: muiPalettes.dark },
            cssVariables: {
                colorSchemeSelector,
            },
            components,
        },
        muiLocale!,
    );
    const route = routeMatches[routeMatches.length - 1];
    let { layout = '' } = (route?.handle || {}) as Record<string, any>;

    if (!layout || !layouts[layout]) {
        layout = DEFAULT_LAYOUT;
    }

    return (
        <ThemeProvider theme={muiTheme}>
            <CssBaseline />
            <ConfirmProvider>{layouts[layout]}</ConfirmProvider>
        </ThemeProvider>
    );
}

export default Layout;
