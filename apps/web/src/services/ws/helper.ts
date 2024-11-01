import { EVENT_TYPE } from './constant';

/** dashboard 订阅的主题包装函数 */
export const getExChangeTopic = (topic: string) => `${EVENT_TYPE.EXCHANGE}:${topic}`;

/** 从主题中分离出类型和原始主题 */
export const splitExchangeTopic = (topics: string[]) => {
    // 从主题中提取出Exchange类型
    return topics.reduce(
        (bucket, topic) => {
            const [type, data] = topic.split(':');

            bucket[type] = bucket[type] || [];
            bucket[type].push(data);

            return bucket;
        },
        {} as Record<string, string[]>,
    );
};

/**
 * 推送的消息转换
 * @param message - 推送的消息
 * @returns - 转换后的消息
 */
export const transform = (message: string) => {
    try {
        return [null, JSON.parse(message)];
    } catch (e) {
        return [e, message];
    }
};
