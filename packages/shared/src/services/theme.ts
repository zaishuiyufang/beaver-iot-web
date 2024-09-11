/**
 * 系统主题切换服务
 *
 * 注意：
 * 1. 通常情况下请勿直接调用该服务中的相关方法，业务中可通过 /hooks/useTheme.ts 来使用
 * 2. 基础组件的主题默认加载远程样式表，后续若有私有化部署需求，需将样式表下载到本地处理
 */
// import { version } from 'ysd-iot';
// import { libCdnUrl } from '../config';
import iotStorage from '../utils/storage';
import eventEmitter from '../utils/event-emitter';
import { loadStylesheet } from '../utils/tools';
// import variables from '../styles/themes/variables.json';

/**
 * 主题类型
 * @param light 浅色主题（默认）
 * @param dark 深色主题
 */
export type ThemeType = 'light' | 'dark';

/**
 * 组件库主题类型
 * @param default 浅色主题（默认）
 * @param dark 深色主题
 */
export type AntdThemeType = 'default' | 'dark';

/** 主题列表 */
type ThemeListType = Record<
    ThemeType,
    {
        /** Label */
        label?: string;

        /** 国际化文案 key */
        intlKey?: string;

        /** Icon Name */
        icon: string;

        /** 资源地址 */
        source?: string;
    }
>;

// 缓存 key（注意：使用 iotStorage 会自动拼接 msiot. 前缀）
const CACHE_KEY = 'theme';
// 主题变更监听事件名
const THEME_CHANGE_TOPIC = 'iot:theme:change';
// 注意：1. 若为私有化部署，baseUri 需更换为本地绝对地址；2. 使用 IOT 项目的 CDN
// const themeBaseUri = `${libCdnUrl}/ysd-iot/${version}`;

/**
 * 系统主题列表
 */
export const themes: ThemeListType = {
    light: {
        // label: '浅色', // Todo: 国际化处理
        icon: 'icon-sun',
        // source: `${themeBaseUri}/ysd-ui.css`,
    },
    dark: {
        // label: '深色', // Todo: 国际化处理
        icon: 'icon-moon',
        // source: `${themeBaseUri}/ysd-ui-dark.css`,
    },
};

/**
 * 主题相关样式变量（只读）
 *
 * 注意：不建议直接读取主题变量，推荐使用 `getCSSVariableValue` 获取变量
 */
// export const themeVariables = Object.freeze(variables);

/**
 * 判断浏览器当前是否为黑暗模式
 */
const isBrowserDarkMode = ((): boolean => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
})();

// 默认系统主题
// 首次进入系统时，根据当前是否为深色模式来决定默认主题（Todo: 和产品确定具体逻辑）
const DEFAULT_THEME_TYPE = isBrowserDarkMode ? 'dark' : 'light';

/**
 * 判断浏览器是否支持 css 变量
 */
const isCSSVariablesSupported = ((): boolean => {
    const dummyElement = document.createElement('div');
    dummyElement.style.setProperty('--test', 'test');

    return dummyElement.style.getPropertyValue('--test') === 'test';
})();

/**
 * 变更全局 CSS 变量
 * @param type 主题类型
 */
const changeCSSVariables = async (type: ThemeType) => {
    const html = document.querySelector('html');

    html?.setAttribute('data-theme', type);

    if (isCSSVariablesSupported) return;

    // 变更主题相关 css variables
    // 参考文档：https://jhildenbiddle.github.io/css-vars-ponyfill
    const cssVars = (await import('css-vars-ponyfill')).default;
    const variables = (await import('../styles/themes/variables.json')).default;

    cssVars({
        watch: true,
        onlyLegacy: true,
        variables: variables[type],
    });
};

/**
 * 变更系统主题
 * @param type 主题类型
 * @param isPersist 是否在 localStorage 持久化存储
 * @returns true 成功，false 失败
 *
 * Todo: 调整主题切换方案
 */
export const changeTheme = async (type: ThemeType, isPersist = true): Promise<boolean> => {
    const { source } = themes[type];
    const elem = document.querySelector(`link[href='${source}']`);

    if (elem) {
        await changeCSSVariables(type);

        // 触发 onThemeChange 回调
        eventEmitter.publish(THEME_CHANGE_TOPIC, type, elem);
        if (isPersist) iotStorage.setItem(CACHE_KEY, type);
        return true;
    }

    let currentElem: HTMLLinkElement;
    try {
        if (!source) return false;
        currentElem = await loadStylesheet(source, { insertBefore: true });
    } catch (e) {
        // eslint-disable-next-line no-console
        console.error('主题资源加载失败', e);
        if (source) {
            const targetElem = document.querySelector(`link[href='${source}']`);
            targetElem?.parentNode?.removeChild(targetElem);
        }

        return false;
    }

    await changeCSSVariables(type);

    // 移除其他基础组件主题样式
    Object.keys(themes).forEach(theme => {
        const data = themes[theme as ThemeType];
        if (theme === type || !data.source) return;

        const targetElem = document.querySelector(`link[href='${data.source}']`);
        targetElem?.parentNode?.removeChild(targetElem);
    });

    // 触发 onThemeChange 监听
    eventEmitter.publish(THEME_CHANGE_TOPIC, type, currentElem);
    if (isPersist) iotStorage.setItem(CACHE_KEY, type);
    return true;
};

/**
 * 初始化系统主题
 *
 * 优先根据缓存中的主题类型变更当前主题，若无缓存则默认为 light 主题
 */
export const initTheme = () => {
    const type = iotStorage.getItem<ThemeType>(CACHE_KEY) || DEFAULT_THEME_TYPE;

    changeTheme(type);
};

/**
 * 获取当前系统主题类型
 */
export const getCurrentTheme = (): ThemeType => {
    let type = iotStorage.getItem<ThemeType>(CACHE_KEY);

    if (!type) {
        const theme = Object.keys(themes).find(theme => {
            const data = themes[theme as ThemeType];
            const elem = document.querySelector(`link[href='${data.source}']`);

            return !!elem;
        });

        if (!theme) {
            throw Error('当前未加载任何系统主题');
        }

        type = theme as ThemeType;
    }

    return type;
};

/**
 * 根据传入的 CSS 变量名获取对应值
 * @param vars CSS 变量名或变量名数组
 * @returns 返回对应 CSS 变量值
 */
export const getCSSVariableValue = <T extends string | string[]>(
    vars: T,
): T extends string[] ? Record<string, string> : string => {
    const rootStyle = window.getComputedStyle(document.documentElement);

    if (typeof vars === 'string') {
        const value = rootStyle.getPropertyValue(vars).trim();
        return value as T extends string[] ? Record<string, string> : string;
    }

    const result = {} as Record<string, string>;
    vars.forEach(item => {
        const value = rootStyle.getPropertyValue(item).trim();
        result[item as T[number]] = value;
    });

    return result as T extends string[] ? Record<string, string> : string;
};

/**
 * 移除系统主题变更监听
 * @param callback 主题变更时的回调函数（若 callback 未传，则移除所有监听）
 */
export const removeThemeChange = (
    callback?: (type: ThemeType, element: HTMLLinkElement) => void,
) => {
    eventEmitter.unsubscribe(THEME_CHANGE_TOPIC, callback);
};

/**
 * 添加系统主题变更监听
 * @param callback 主题变更时的回调函数
 * @returns 返回移除监听函数
 */
export const onThemeChange = (callback: (type: ThemeType, element: HTMLLinkElement) => void) => {
    eventEmitter.subscribe(THEME_CHANGE_TOPIC, callback);

    return () => removeThemeChange(callback);
};
