import { unstable_batchedUpdates as unstableBatchedUpdates } from 'react-dom';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { onLangChange, LangType } from '../services/i18n';
import { getTimezone, changeDefaultTimezone } from '../services/time';

interface GlobalStore {
    /** 系统语言 */
    lang?: LangType;

    /** 系统时区 */
    timezone?: string;

    /** 更新系统时区 */
    setTimezone: (tz: string) => void;
}

const useGlobalStore = create(
    immer<GlobalStore>(set => ({
        // lang 初始化时不设置默认值，以便文案加载完毕后可触发页面更新
        lang: undefined,

        timezone: getTimezone(),

        setTimezone: (tz: string) => {
            changeDefaultTimezone(tz);
            set(state => {
                state.timezone = tz;
            });
        },
    })),
);

// 监听语言变更
onLangChange(lang => {
    /**
     * Calling actions outside a React event handler in pre React 18
     * https://docs.pmnd.rs/zustand/guides/event-handler-in-pre-react-18
     */
    unstableBatchedUpdates(() => {
        useGlobalStore.setState({ lang });
    });
});

export default useGlobalStore;
