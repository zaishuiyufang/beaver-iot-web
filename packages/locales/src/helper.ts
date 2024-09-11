import { LANGUAGE } from './types';
import errorKeysMap from './error_keys_map.json';
import type { LanguageComponentType, AppType } from './types';

interface OptInterface {
    defaultLanguage: keyof typeof LANGUAGE;
}

const languages = Object.values(LANGUAGE);
/** 各个端依赖的语言包 */
const appLocalModules: Record<AppType, string[]> = {
    web: [
        'global',
    ],
};

const componentMapLanguage = {
    moment: {
        [LANGUAGE.EN]: 'en',
        [LANGUAGE.CN]: 'zh-cn',
        [LANGUAGE.IT]: 'it',
        [LANGUAGE.DE]: 'de',
        [LANGUAGE.PT]: 'pt',
        [LANGUAGE.FR]: 'fr',

        [LANGUAGE.NL]: 'nl',
        [LANGUAGE.TH]: 'th',

        [LANGUAGE.ES]: 'es',

        [LANGUAGE.TR]: 'tr',
        [LANGUAGE.HE]: 'he',
        [LANGUAGE.AR]: 'en',
        [LANGUAGE.RU]: 'ru',
        [LANGUAGE.PT_BR]: 'pt-br',
    },
    antd: {
        [LANGUAGE.EN]: 'en_US',
        [LANGUAGE.CN]: 'zh_CN',
        [LANGUAGE.IT]: 'it_IT',
        [LANGUAGE.DE]: 'de_DE',
        [LANGUAGE.PT]: 'pt_PT',
        [LANGUAGE.FR]: 'fr_FR',
        [LANGUAGE.NL]: 'nl_NL',
        [LANGUAGE.TH]: 'th_TH',
        [LANGUAGE.ES]: 'es_ES',
        [LANGUAGE.TR]: 'tr_TR',
        [LANGUAGE.HE]: 'he_IL',
        [LANGUAGE.AR]: 'ar_EG',
        [LANGUAGE.RU]: 'ru_RU',
        [LANGUAGE.PT_BR]: 'pt_BR',
    },
    mui: {
        [LANGUAGE.EN]: 'enUS',
        [LANGUAGE.CN]: 'zhCN',
        [LANGUAGE.IT]: 'itIT',
        [LANGUAGE.DE]: 'deDE',
        [LANGUAGE.PT]: 'ptPT',
        [LANGUAGE.FR]: 'frFR',
        [LANGUAGE.NL]: 'nlNL',
        [LANGUAGE.TH]: 'thTH',
        [LANGUAGE.ES]: 'esES',
        [LANGUAGE.TR]: 'trTR',
        [LANGUAGE.HE]: 'heIL',
        [LANGUAGE.AR]: 'arEG',
        [LANGUAGE.RU]: 'ruRU',
        [LANGUAGE.PT_BR]: 'ptBR',
    },
};

export class LocaleHelper {
    opt: OptInterface;
    constructor(opt: OptInterface) {
        this.opt = opt;
    }

    init(opt?: OptInterface) {
        if (opt && JSON.stringify(opt) !== '{}') {
            this.opt = Object.assign(this.opt, opt);
        }
    }

    /**
     * 获取第三方库语言包映射字符串，若无匹配则返回 EN
     */
    getComponentLanguage(lang: OptInterface['defaultLanguage'], type: LanguageComponentType) {
        const localMapping = componentMapLanguage[type];

        if (languages.includes(lang as LANGUAGE)) {
            return localMapping[lang];
        }

        return localMapping[LANGUAGE.EN];
    }

    /** 设置当前界面语言 */
    setLanguage(lang: LANGUAGE, onOk?: () => void, fieldLanguageName = 'lang') {
        localStorage.setItem(fieldLanguageName, lang);
        if (typeof onOk === 'function') {
            onOk();
            return;
        }
        window.location.reload();
    }

    getLanguages(): LANGUAGE[] {
        return languages;
    }

    /**
     * 加载指定模块对应的语言包
     * @param {String} moduleName 模块名字，必须与对应的语言包文件名相同
     * @param {String} lang 语言字符
     */
    private async loadLocaleByModule(
        moduleName: string,
        lang?: Lowercase<OptInterface['defaultLanguage']> | OptInterface['defaultLanguage'],
    ): Promise<Record<string, string>> {
        const currentLang = lang ? lang.toLocaleLowerCase() : this.opt.defaultLanguage;
        let res;

        try {
            res = await import(`./lang/${currentLang}/${moduleName}.json`);
        } catch (e) {
            res = await import(`./lang/en/${moduleName}.json`);
        }

        return res.default;
    }

    /**
     * 加载语言包，并获取语言包json文件资源
     * @param {String} appName 获取某端的语言包资源
     * @param {String} lang 语言字符
     */
    getLoadedLocales(
        appName: AppType,
        lang?: Lowercase<OptInterface['defaultLanguage']> | OptInterface['defaultLanguage'],
    ) {
        return Promise.all(
            appLocalModules[appName].map(moduleName => this.loadLocaleByModule(moduleName, lang)),
        );
    }

    /**
     * 获取接口错误信息与文案 key 的映射表
     */
    getErrorMapKeys(): typeof errorKeysMap {
        return errorKeysMap;
    }
}
