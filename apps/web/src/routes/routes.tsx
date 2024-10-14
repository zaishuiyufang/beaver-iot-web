import intl from 'react-intl-universal';
import { Outlet, RouteObject } from 'react-router-dom';
import {
    DashboardCustomizeIcon,
    DevicesOtherIcon,
    SettingsIcon,
} from '@milesight/shared/src/components';

type RouteObjectType = RouteObject & {
    /** 自定义路由元数据 */
    handle?: {
        title?: string;

        /** 菜单图标 */
        icon?: React.ReactNode;

        /**
         * 布局类型，默认为 `basic`
         *
         * 注意：此处类型应为 LayoutType，但会出现推断错误，故暂定义为 string
         */
        layout?: string;

        /** 是否无需登录便可访问，默认 `false` (需要登录) */
        authFree?: boolean;
    };

    /** 子路由 */
    children?: RouteObjectType[];
};

const routes: RouteObjectType[] = [
    {
        path: '/dashboard',
        handle: {
            title: 'Dashboard',
            icon: <DashboardCustomizeIcon />,
        },
        async lazy() {
            const { default: Component } = await import('@/pages/dashboard');
            return { Component };
        },
    },
    {
        path: '/device',
        element: <Outlet />,
        handle: {
            title: 'Device',
            icon: <DevicesOtherIcon />,
        },
        children: [
            {
                index: true,
                async lazy() {
                    const { default: Component } = await import('@/pages/device');
                    return { Component };
                },
            },
            {
                index: true,
                path: 'detail/:deviceId',
                handle: {
                    title: 'Detail',
                },
                async lazy() {
                    const { default: Component } = await import('@/pages/device/views/detail');
                    return { Component };
                },
            },
        ],
    },
    {
        path: '/setting',
        element: <Outlet />,
        handle: {
            title: 'Setting',
            icon: <SettingsIcon />,
        },
        children: [
            {
                index: true,
                async lazy() {
                    const { default: Component } = await import('@/pages/setting');
                    return { Component };
                },
            },
            {
                path: 'integration/:integrationId',
                handle: {
                    title: 'Integration',
                },
                async lazy() {
                    const { default: Component } = await import(
                        '@/pages/setting/views/integration-detail'
                    );
                    return { Component };
                },
            },
        ],
    },
    {
        path: '/auth',
        handle: {
            layout: 'blank',
        },
        element: <Outlet />,
        children: [
            {
                index: true,
                path: 'login',
                handle: {
                    title: 'Login',
                    layout: 'blank',
                },
                async lazy() {
                    const { default: Component } = await import('@/pages/auth/views/login');
                    return { Component };
                },
            },
            {
                path: 'register',
                handle: {
                    title: 'Register',
                    layout: 'blank',
                },
                async lazy() {
                    const { default: Component } = await import('@/pages/auth/views/register');
                    return { Component };
                },
            },
        ],
    },
    {
        path: '*',
        handle: {
            title: '404',
            layout: 'blank',
            authFree: true,
        },
        async lazy() {
            const { default: Component } = await import('@/pages/404');
            return { Component };
        },
    },
];

export default routes;
