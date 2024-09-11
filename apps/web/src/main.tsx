import React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { i18n } from '@milesight/shared/src/services';
import routes from '@/routes';
import '@/styles/index.less';

const router = createBrowserRouter(routes, { basename: '/' });
const root = createRoot(document.getElementById('root')!);

// 国际化初始化
i18n.initI18n('web');

// 系统主题初始化
// initTheme();

root.render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>,
);
