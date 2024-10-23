import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface UserStore {
    /**
     * 用户信息
     *
     * TODO: 类型待补充
     */
    userInfo?: null | Record<string, any>;

    /**
     * 更新用户信息
     *
     * @param userInfo 用户信息
     */
    setUserInfo: (userInfo: UserStore['userInfo']) => void;
}

const useUserStore = create(
    immer<UserStore>(set => ({
        userInfo: null,

        setUserInfo: userInfo => set({ userInfo }),
    })),
);

export default useUserStore;
