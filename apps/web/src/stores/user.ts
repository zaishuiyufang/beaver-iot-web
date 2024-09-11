import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface UserStore {
    /** 是否登录 */
    isLogin: boolean;

    /** 用户信息 */
    userInfo: Record<string, any>;
}

const useUserStore = create(
    immer<UserStore>(() => ({
        isLogin: false,

        userInfo: {},
    })),
);

export default useUserStore;
