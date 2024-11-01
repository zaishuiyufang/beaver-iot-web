import { useEffect, useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import iotStorage, { TOKEN_CACHE_KEY } from '@milesight/shared/src/utils/storage';
import { useUserStore } from '@/stores';
import ws from '@/services/ws';

export const useWebsocket = () => {
    const { userInfo } = useUserStore(useShallow(state => ({ userInfo: state.userInfo })));
    const isLogin = useMemo(() => Object.keys(userInfo || {}).length > 0, [userInfo]);

    useEffect(() => {
        if (!isLogin) return;

        const data = iotStorage.getItem(TOKEN_CACHE_KEY);
        const token = data?.access_token;
        const url = `/websocket?Authorization=Bearer ${token}`;

        ws.connect(url)
            .then(() => {
                // eslint-disable-next-line no-console
                console.log('ws 创建成功 >>>');
            })
            .catch(err => {
                // eslint-disable-next-line no-console
                console.log('ws 创建失败 >>>', err);
            });

        return () => {
            ws.destroy();
        };
    }, [isLogin]);
};
