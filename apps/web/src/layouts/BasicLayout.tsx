import { useMemo } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useI18n } from '@milesight/shared/src/hooks';
import routes from '@/routes/routes';
import { Sidebar } from '@/components';

function BasicLayout() {
    const { lang } = useI18n();
    const menus = useMemo(() => {
        return routes
            .filter(route => route.path && route.handle?.layout !== 'blank')
            .map(route => ({
                name: route.handle?.title || '',
                path: route.path || '',
                icon: route.handle?.icon,
            }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lang]);

    return (
        <section className="ms-layout">
            <Sidebar menus={menus} />
            <main className="ms-layout-right">
                <Outlet />
            </main>
        </section>
    );
}

export default BasicLayout;
