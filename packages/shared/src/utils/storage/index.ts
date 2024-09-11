import { USER_CACHE_PREFIX, DEFAULT_CACHE_PREFIX } from './consts';
import { IotStorage } from './storage';
import { IndexedDBStorage } from './db-storage';

/** localStorage */
const iotLocalStorage = new IotStorage({ storage: window.localStorage });

/** sessionStorage */
const iotSessionStorage = new IotStorage({ storage: window.sessionStorage });

/** indexDB 实例 */
const iotIndexedDBStorage = new IndexedDBStorage(`${DEFAULT_CACHE_PREFIX}db`);

/**
 * 返回用户数据缓存 key
 *
 * 注意：
 * 1. 函数调用时若传入 userId，则会存储在内存中，在后续调用中若未传入则直接使用缓存的 userId
 * 2. 函数依赖 localStorage 中缓存的基础用户数据，若无用户数据，则用户相关的
 * 缓存数据均不可用，故此时 key 返回空字符串。
 */
const getUserCacheKey = (() => {
    let cacheUserId: ApiKey = '';

    return (key: string, userId?: ApiKey) => {
        if (userId) {
            cacheUserId = userId;
            return `${key || ''}.${USER_CACHE_PREFIX}.${userId}`;
        }

        const userInfo =
            cacheUserId && iotLocalStorage.getItem(`${USER_CACHE_PREFIX}.${cacheUserId}`);

        if (userInfo?.userId && userInfo.userId === cacheUserId) {
            return `${key || ''}.${USER_CACHE_PREFIX}.${userInfo.userId}`;
        }

        return '';
    };
})();

export * from './consts';
export { iotLocalStorage, iotSessionStorage, iotIndexedDBStorage, getUserCacheKey };
export default iotLocalStorage;
