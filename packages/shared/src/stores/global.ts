import { unstable_batchedUpdates as unstableBatchedUpdates } from 'react-dom';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { onLangChange, LangType } from '../services/i18n';

interface GlobalStore {
    /** 系统语言 */
    lang?: LangType;
}

const useGlobalStore = create(
    immer<GlobalStore>(() => ({
        // lang 初始化时不设置默认值，以便文案加载完毕后可触发页面更新
        lang: undefined,
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
