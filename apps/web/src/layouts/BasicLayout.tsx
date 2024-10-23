import { useMemo, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useRequest } from 'ahooks';
import { CircularProgress, Stack, Skeleton } from '@mui/material';
import { useI18n } from '@milesight/shared/src/hooks';
import iotStorage, { TOKEN_CACHE_KEY } from '@milesight/shared/src/utils/storage';
import routes from '@/routes/routes';
import { useUserStore } from '@/stores';
import { globalAPI, awaitWrap, getResponseData, isRequestSuccess } from '@/services/http';
import { Sidebar, RouteLoadingIndicator } from '@/components';

function BasicLayout() {
    const { lang } = useI18n();
    const navigate = useNavigate();
    const [loading, setLoading] = useState<null | boolean>(null);
    const setUserInfo = useUserStore(state => state.setUserInfo);
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
    // const token = iotStorage.getItem(TOKEN_CACHE_KEY);

    // TODO: 获取用户信息&鉴权&跳转逻辑
    useRequest(
        async () => {
            // if (!token) return;
            // setLoading(true);
            // const [error, resp] = await awaitWrap(globalAPI.getUserInfo());
            // setLoading(false);
            // if (error || !isRequestSuccess(resp)) return;
            // const data = getResponseData(resp);
            // console.log('get userinfo', data);
            // setUserInfo(data as Record<string, any>);
            // return data;

            await new Promise(resolve => {
                setTimeout(() => {
                    setLoading(false);
                    resolve(null);
                }, 500);
            });
        },
        {
            debounceWait: 300,
        },
    );

    // TODO: 判断 localStorage 中若无缓存 token 则直接跳转登录页
    // if (!token) {
    //     navigate('/auth/login');
    //     return null;
    // }

    return (
        <section className="ms-layout">
            <RouteLoadingIndicator />
            {loading !== false ? (
                // <CircularProgress sx={{ marginX: 'auto', alignSelf: 'center' }} />
                <Stack direction="row" spacing={1} sx={{ flex: 1 }}>
                    <Skeleton variant="rectangular" width={64} height="100%" />
                    <Stack spacing={1} sx={{ flex: 1 }}>
                        <Skeleton variant="rectangular" animation="wave" height={45} />
                        <Skeleton variant="rectangular" animation="wave" sx={{ flex: 1 }} />
                    </Stack>
                </Stack>
            ) : (
                <>
                    <Sidebar menus={menus} />
                    <main className="ms-layout-right">
                        <Outlet />
                    </main>
                </>
            )}
        </section>
    );
}

export default BasicLayout;
