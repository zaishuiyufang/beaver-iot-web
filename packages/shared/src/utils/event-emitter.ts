export interface ISubscribe {
    topic: string;
    attrs?: { [key: string]: any }; // 暴露给外部类的可修改属性
    callbacks: Function[];
}
/**
 * 发布订阅实现类
 */
export class EventEmitter<T extends ISubscribe = ISubscribe> {
    private subscribeHandles: T[];
    constructor() {
        this.subscribeHandles = [];
    }
    /**
     * 发布
     * @param topic
     * @param args
     * @returns
     */
    publish(topic: T['topic'], ...args: any[]) {
        const subscriber = this.subscribeHandles.find(
            (subscriber: T) => subscriber.topic === topic,
        );
        if (!subscriber) return;
        subscriber.callbacks.forEach((cb) => cb(...args));
    }
    /**
     * 订阅
     * @param topic
     * @param callback
     * @param params
     * @returns
     */
    subscribe(
        topic: T['topic'],
        callback: T['callbacks'][0],
        params?: Omit<T, 'topic' | 'callbacks'>,
    ): void {
        const subscriber = this.subscribeHandles.find(
            (subscriber: T) => subscriber.topic === topic,
        );
        if (subscriber) {
            subscriber.callbacks.push(callback);
            return;
        }
        this.subscribeHandles.push({
            topic,
            ...(params || {}),
            callbacks: [callback],
        } as T);
    }
    /**
     * 取消订阅
     * @param topic
     * @param callback
     * @returns
     */
    unsubscribe(topic: T['topic'], callback?: T['callbacks'][0]): void {
        if (!callback) {
            this.subscribeHandles = this.subscribeHandles.filter(
                (subscribers: T) => subscribers.topic !== topic,
            );
            return;
        }
        this.subscribeHandles = this.subscribeHandles
            .map((subscriber: T) => {
                if (subscriber.topic === topic) {
                    subscriber.callbacks = subscriber.callbacks.filter((cb) => cb !== callback);
                }
                return subscriber;
            })
            .filter((subscriber: T) => subscriber.callbacks?.length);
    }
    /**
     * 修改订阅信息的可变属性值
     * @param topic
     * @param newAttrs
     * @returns
     */
    setAttrs(topic: T['topic'], newAttrs: Required<ISubscribe>['attrs']) {
        const subscriber = this.subscribeHandles.find(
            (subscriber: T) => subscriber.topic === topic,
        );
        if (!subscriber) return;
        const { attrs = {} } = subscriber;
        for (let key in attrs) {
            attrs[key] = newAttrs[key] ?? attrs[key];
        }
    }
    /**
     * 根据主题获取订阅信息
     * @param topic
     * @returns
     */
    getSubscriber(topic: T['topic']): Omit<T, 'callbacks'> | undefined {
        const subscriber = this.subscribeHandles.find(
            (subscriber: T) => subscriber.topic === topic,
        );
        if (!subscriber) return;
        return { ...subscriber };
    }
    /**
     * 获取所有主题
     * @returns
     */
    getTopics() {
        return this.subscribeHandles.map((subscriber: T) => subscriber.topic);
    }
    /**
     * 销毁
     */
    destroy() {
        this.subscribeHandles = [];
    }
}

export default new EventEmitter();
