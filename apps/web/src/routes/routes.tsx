import intl from 'react-intl-universal';
import { Outlet, RouteObject } from 'react-router-dom';

type RouteObjectType = RouteObject & {
    /** 自定义路由元数据 */
    handle?: {
        title?: string;

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
        path: '/home',
        handle: {
            title: 'Home',
            // get title() {
            //     return intl.get('menu.dashboard');
            // },
        },
        async lazy() {
            const { default: Component } = await import('@/pages/home');
            return { Component };
        },
    },
    {
        path: '/dashboard',
        handle: {
            title: 'Dashboard',
        },
        async lazy() {
            const { default: Component } = await import('@/pages/dashboard');
            return { Component };
        },
    },
    {
        path: '/about',
        handle: {
            title: 'About',
        },
        async lazy() {
            const { default: Component } = await import('@/pages/about');
            return { Component };
        },
    },
    {
        path: '/demo',
        // element: <Demo />,
        handle: {
            title: 'Demo',
        },
        async lazy() {
            const { default: Component } = await import('@/pages/demo');
            return { Component };
        },
    },
    {
        path: '/auth',
        element: <Outlet />,
        children: [
            {
                index: true,
                path: 'login',
                handle: {
                    title: 'Login',
                },
                async lazy() {
                    const { default: Component } = await import('@/pages/auth/login');
                    return { Component };
                },
            },
            {
                path: 'register',
                handle: {
                    title: 'Register',
                },
                async lazy() {
                    const { default: Component } = await import('@/pages/auth/register');
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
