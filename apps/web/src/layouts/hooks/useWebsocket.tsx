import { useEffect, useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import eventEmitter from '@milesight/shared/src/utils/event-emitter';
import { REFRESH_TOKEN_TOPIC } from '@milesight/shared/src/config';
import iotStorage, { TOKEN_CACHE_KEY } from '@milesight/shared/src/utils/storage';
import { useUserStore } from '@/stores';
import ws from '@/services/ws';

export const useWebsocket = () => {
    const { userInfo } = useUserStore(useShallow(state => ({ userInfo: state.userInfo })));
    const isLogin = useMemo(() => Object.keys(userInfo || {}).length > 0, [userInfo]);

    /** 连接WS */
    const connectSocket = () => {
        const data = iotStorage.getItem(TOKEN_CACHE_KEY);
        const token = data?.access_token;
        const url = `/websocket?Authorization=Bearer ${token}`;

        ws.connect(url);
        return () => {
            ws.destroy();
        };
    };
    useEffect(() => {
        if (!isLogin) return;

        // 登录后，首次连接
        return connectSocket();
    }, [isLogin]);

    useEffect(() => {
        // 刷新token时，重新连接
        const cb = () => {
            ws?.close();
            connectSocket();
        };
        eventEmitter.subscribe(REFRESH_TOKEN_TOPIC, cb);
        return () => {
            eventEmitter.unsubscribe(REFRESH_TOKEN_TOPIC, cb);
        };
    }, []);
};
