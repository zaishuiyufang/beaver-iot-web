import { EventEmitter } from '@milesight/shared/src/utils/event-emitter';
import { withPromiseResolvers } from '@milesight/shared/src/utils/tools';
import { splitExchangeTopic, transform } from './helper';
import { EVENT_TYPE, WS_READY_STATE } from './constant';
import type { CallbackType, IEventEmitter, WsEvent } from './types';

class WebSocketClient {
    private url = ''; // ws地址
    private ws: WebSocket | null = null; // ws实例
    private readonly subscribeEvent: EventEmitter<IEventEmitter> = new EventEmitter(); // 事件总线

    /**
     * 是否正常连接
     */
    get isConnected(): boolean {
        return this.ws?.readyState === WS_READY_STATE.OPEN;
    }

    /**
     * 连接方法
     * @param url ws地址
     */
    connect(url: string) {
        if (!url) return Promise.reject(new Error('url is required'));

        const ws = new window.WebSocket(url);
        this.url = url;
        this.ws = ws;

        const { resolve, reject, promise } = withPromiseResolvers<void>();

        // ws连接成功
        ws.onopen = () => {
            resolve();
            this.emit();
        };
        // ws连接失败
        ws.onerror = e => {
            reject(e);
        };
        // ws接收到消息
        ws.onmessage = e => {
            const message = e.data;

            const [error, data] = transform(message);
            if (error) return;

            // 处理订阅事件
            const { event_type: eventType, payload } = (data as WsEvent) || {};
            const { entity_key: topics } = payload || {};
            topics.forEach(topic => this.subscribeEvent.publish(`${eventType}:${topic}`, data));
        };

        return promise;
    }

    /**
     * 订阅主题
     * @param {string} topic - 主题
     * @param {Function} cb - 订阅的回调
     * @returns 订阅成功后返回一个函数，用于取消本次订阅
     */
    subscribe(topic: string, cb: CallbackType) {
        // 是否已经订阅过
        const isSubscribed = this.subscribeEvent.subscribe(topic, cb);

        if (!isSubscribed) {
            this.emit();
        }

        return this.unsubscribe.bind(this, topic, cb);
    }

    /**
     * 取消订阅
     * @param {string} topic - 主题
     * @param {Function} cb - 订阅的回调
     */
    unsubscribe(topic: string, cb?: CallbackType) {
        this.subscribeEvent.unsubscribe(topic, cb);

        const subscriber = this.subscribeEvent.getSubscriber(topic);
        if (!subscriber) {
            this.emit();
        }
    }

    /**
     * 重连
     */
    reconnect() {
        this.ws?.close();
        // TODO token过期处理
        this.connect.call(this, this.url);
    }

    /**
     * 销毁
     */
    destroy() {
        this.subscribeEvent.destroy();
        this.ws?.close();
    }

    /**
     * 向后台发送消息订阅，目前只支持`Exchange`类型
     */
    private emit() {
        if (!this.isConnected) return;

        const topics = this.subscribeEvent.getTopics();
        // 从主题中提取出`Exchange`类型
        const { Exchange } = splitExchangeTopic(topics);

        // 发送订阅请求
        const data: WsEvent = {
            event_type: EVENT_TYPE.EXCHANGE,
            payload: {
                entity_key: Exchange || [],
            },
        };
        this.ws?.send(JSON.stringify(data));
    }
}

export default new WebSocketClient();

// /**
//  * @example MQTT主题订阅示例
//  */
// import { useMemo, useEffect, useCallback } from 'react';
// import ws, { getExChangeTopic } from '@/services/ws';

// export const App = () => {
//     const topic = useMemo(() => entityKey && getExChangeTopic(entityKey), [entityKey]);

//     // 订阅 WS 主题
//     useEffect(() => {
//         if (!topic) return;

//         const handler = () => {
//             // TODO: 处理逻辑
//         };
//         // 订阅主题时会返回取消订阅的函数，所以直接返回即可在卸载时取消订阅
//         return ws.subscribe(topic, handler);
//     }, [topic]);
// };
