/**
 * 国际化多语言服务
 *
 * 注意：通常情况下请勿直接调用该服务中的相关方法，业务中可通过 /hooks/useI18n.ts 来使用
 */
/* eslint-disable camelcase */
import intl from 'react-intl-universal';
import moment from 'moment';
import { isEmpty } from 'lodash-es';
import { zhCN, enUS, type Localization } from '@mui/material/locale';
import i18nHelper, { LANGUAGE } from '@milesight/locales';
import iotStorage from '../utils/storage';
import eventEmitter from '../utils/event-emitter';

// Problem with moment locales: https://github.com/vitejs/vite/discussions/7492
import 'moment/dist/locale/zh-cn';
// import 'moment/locale/it';
// import 'moment/locale/pt';
// import 'moment/locale/de';
// import 'moment/locale/fr';
// import 'moment/locale/th';
// import 'moment/locale/nl';
// import 'moment/locale/es';
// import 'moment/locale/tr';
// import 'moment/locale/he';
// import 'moment/locale/ar';
// import 'moment/locale/ru';
// import 'moment/locale/pt-br';

// import type { WeekStartWithType } from '../utils/time/interface';
/**
 * 周开始时间类型
 */
type WeekStartWithType = 'SUNDAY' | 'MONDAY' | 'SATURDAY';

export type LangType = keyof typeof LANGUAGE;

type LangListType = Partial<
    Record<
        LangType,
        {
            /** 语言 key */
            key: LangType;

            /** 接口数据映射值 */
            value: string;

            /** 语言说明 */
            label: string;

            /** 文案包 */
            locale?: Record<string, string> | Record<string, string>[];

            /** antd 对应语言包资源（非 false 表示已加载） */
            antdLocale?: any;

            /** MUI 对应语言包资源 */
            muiLocale?: Localization;

            /** moment 对应语言包资源（非 false 表示已加载） */
            momentLocale?: any;
        }
    >
>;

// 缓存 key（注意：使用 iotStorage 会自动拼接 msiot. 前缀）
const CACHE_KEY = 'lang';
// 语言变更监听事件名
const LANG_CHANGE_TOPIC = 'iot:lang:change';
export const DEFAULT_LANGUAGE = LANGUAGE.EN;

/**
 * 语言列表
 */
export const langs: LangListType = {
    EN: {
        key: LANGUAGE.EN,
        value: i18nHelper.getComponentLanguage(LANGUAGE.EN, 'moment'),
        label: '',
        muiLocale: enUS,
        // antdLocale: en_US,
    },
    CN: {
        key: LANGUAGE.CN,
        value: i18nHelper.getComponentLanguage(LANGUAGE.CN, 'moment'),
        label: '',
        muiLocale: zhCN,
        // antdLocale: zh_CN,
    },
};

/**
 * 代理intl相关方法，解决国际化文案加载未完成时出现的控制台警告
 * @returns {Function} - loadI18nComplete 国际化文案加载完成
 */
const { loadI18nComplete } = (() => {
    let isLoadFinished = false;

    /**
     * 重写intl相关方法
     */
    const patchIntl = () => {
        const originalIntlGet = intl.get;
        const originalIntlGetHTML = intl.getHTML;

        // @ts-ignore
        intl.get = (...params) => {
            const { locales, currentLocale } = intl.getInitOptions() || {};
            const locale = locales && currentLocale && locales[currentLocale];

            if (!isLoadFinished && !locale) return '';

            return originalIntlGet.apply(intl, params);
        };

        // @ts-ignore
        intl.getHTML = (...params) => {
            const { locales, currentLocale } = intl.getInitOptions() || {};
            const locale = locales && currentLocale && locales[currentLocale];

            if (!isLoadFinished && !locale) return '';

            return originalIntlGetHTML.apply(intl, params);
        };
    };
    /**
     * 语言包加载完成
     */
    const loadI18nComplete = () => {
        isLoadFinished = true;
    };

    patchIntl();

    return {
        loadI18nComplete,
    };
})();

/**
 * 国际化初始化
 */
export const initI18n = async (platform: AppType, defaultLang?: LangType) => {
    let lang = iotStorage.getItem<LangType>(CACHE_KEY) || defaultLang;

    if (!lang || !langs[lang]) {
        let { language } = navigator;

        // 兼容 en en-US
        // 将浏览器语言格式转换成 我们自定义的统一的格式
        language = language.replace('-', '_').toLocaleUpperCase();

        /**
         * 匹配中文 zh / zh_cn / zh_tw 等字符，统一处理为 cn
         * 注意：当前系统中无「繁体中文」，若后续要支持，则下方赋值需做调整
         */
        if (/^zh(_\w+)?/i.test(language)) {
            language = LANGUAGE.CN;
        }

        lang = langs[language as LangType] ? (language as LangType) : DEFAULT_LANGUAGE;
    }

    await changeLang(lang, platform);
    loadI18nComplete();
};

/**
 * 切换语言
 * @param lang 语言
 * @param platform 平台
 * @params weekStartWith 周开始时间
 * @returns true 成功，false 失败
 */
export const changeLang = async (
    lang: LangType,
    platform: AppType = 'web',
    weekStartWith?: WeekStartWithType,
): Promise<boolean> => {
    const momentLang = i18nHelper.getComponentLanguage(lang, 'moment');
    let locale = langs[lang]?.locale;
    if (!locale || isEmpty(locale)) {
        let locales: Record<string, string>[] = [];

        try {
            locales = await i18nHelper.getLoadedLocales(platform, lang);
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error('国际化文案加载失败', lang, platform, e);
            return false;
        }

        locale = locales.reduce((acc, item) => ({ ...acc, ...item }), {});
    }

    await intl.init({
        currentLocale: lang,
        // Todo: 已加载的其他语言文案是否要一起注入？
        locales: { [lang]: locale },
        escapeHtml: false,
    });

    moment.locale(momentLang, {
        ...getMomentWeekStartAndIntl(weekStartWith),
    });

    if (langs[lang]) langs[lang]!.locale = locale;

    eventEmitter.publish(LANG_CHANGE_TOPIC, lang);
    iotStorage.setItem(CACHE_KEY, lang);

    const html = document.querySelector('html');
    html?.setAttribute('lang', getCurrentMomentLang());

    return true;
};

/**
 * 获取当前语言
 */
export const getCurrentLang = (): LangType => {
    const lang = iotStorage.getItem<LangType>(CACHE_KEY);
    return lang || DEFAULT_LANGUAGE;
};

/**
 * 获取当前语言映射的 Moment 语言
 */
export const getCurrentMomentLang = () => {
    const lang = getCurrentLang();
    return i18nHelper.getComponentLanguage(lang, 'moment');
};

/**
 * 返回 moment 周开始时间、12 小时制国际化处理
 */
export const getMomentWeekStartAndIntl = (weekStartWith?: WeekStartWithType) => {
    /**
     * 周开始时间处理
     */
    const dowMap: Record<WeekStartWithType, number> = {
        SUNDAY: 0,
        MONDAY: 1,
        SATURDAY: 6,
    };
    // 默认周开始时间为周日
    let dowVal = 0;
    if (weekStartWith && dowMap?.[weekStartWith]) {
        dowVal = dowMap[weekStartWith];
    }

    // 返回 moment 配置
    return {
        week: {
            dow: dowVal,
        },
        /**
         * 12 小时制国际化处理
         */
        meridiem: (hours: number) => {
            return hours < 12 ? intl.get('common.time.morning') : intl.get('common.time.afternoon');
        },
    };
};

/**
 * 接口错误码与文案 key 映射表
 */
export const errorKeyMaps = i18nHelper.getErrorMapKeys() as Record<string, string>;

/**
 * 监听系统语言变更
 * @param callback 主题变更时的回调函数
 * @returns 返回移除监听函数
 */
export const onLangChange = (callback: (type: LangType) => void) => {
    eventEmitter.subscribe(LANG_CHANGE_TOPIC, callback);

    return () => removeLangChange(callback);
};

/**
 * 移除系统语言变更监听
 */
export const removeLangChange = (callback: (type: LangType) => void) => {
    eventEmitter.unsubscribe(LANG_CHANGE_TOPIC, callback);
};
