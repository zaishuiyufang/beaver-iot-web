import type { Rule } from '@ysd-iot/es/Form';

import { isMatches, isMinValue, isPort } from './asserts';
import getErrorMessage, { EErrorMessages, intlInstanceGenerator } from './getErrorMessage';
import {
    checkEmail,
    checkLength,
    checkLettersAndNum,
    checkMinValue,
    checkMobilePhone,
    checkNumber,
    checkPostalCode,
    checkRangeLength,
    checkStartWithNormalChar,
    checkUrl,
} from './validator';

// 导出所有的单条 validator
export * from './validator';

export type TChecker = () => Rule[];

/**
 * validator 初始化辅助函数
 * 当前仅用于挂载 intl 对象，后续可根据需要进行扩展
 */
export const init = intlInstanceGenerator;

// 以下是组合校验 -------
/**
 * Remark/Comments备注，正常是在 textarea
 * 对应 EErrorMessages.comments
 *
 * 最小1位，最大1024位
 * 支持任意字符。
 */
export const commentsChecker: TChecker = () => [
    {
        min: 1,
        max: 1024,
        validator: checkRangeLength,
    },
];

/**
 * Street/Address - 单行地址类
 *
 * 最小1位，最大255位
 * 支持任意字符。
 */
export const streetAddressChecker: TChecker = () => [
    {
        min: 1,
        max: 255,
        validator: checkRangeLength,
    },
];

/**
 * City/State/province - 国家城市
 * 最小1位，最大127位
 * 支持任意字符。
 */
export const cityChecker: TChecker = () => [
    {
        min: 1,
        max: 127,
        validator: checkRangeLength,
    },
];

/**
 * 生成一组 Email 的校验规则
 * 格式要求：
 * 只允许大小写英文字母、数字 和字符：@符号 下划线_ 中划线 -  加号+，英文句号. ，且必须由 大小写字母 或 数字 或 下划线_ 开头，.和-后面或者@前面一定要跟上A-Z，a-z，0-9，_
 * 必须符合邮箱格式XXX@XXX.XX
 */
export const emailCheckers: TChecker = () => {
    return [
        {
            min: 5,
            max: 255,
            validator: checkRangeLength,
        },
        {
            validator: checkStartWithNormalChar,
        },
        {
            validator: checkEmail,
        },
    ];
};

/**
 * mobilePhoneChecker 和 postalCodeChecker 共享的 validator
 */
const commonValidators: TChecker = () => [
    {
        min: 1,
        max: 31,
        validator: checkRangeLength,
    },
    {
        validator(rule, value) {
            if (value && /[^a-zA-Z0-9\(\)\.\-+\*#\s]/.test(value)) {
                return Promise.reject(rule.message);
            }

            return Promise.resolve();
        },
        message: getErrorMessage(EErrorMessages.numLetterSpaceSimpleSpecial),
    },
];

/**
 * Mobile Number/Phone Number/Fax- 电话号码类
 *
 * 最小1位，最大31位
 * 允许输入数字，字母，空格和字符：().-+*#
 */
export const mobilePhoneChecker: TChecker = () => {
    return [
        ...commonValidators(),
        {
            validator: checkMobilePhone,
        },
    ];
};

/**
 * Zip/Postal Code- 邮政编码类
 *
 * 最小1位，最大31位
 * 允许输入数字，字母，空格和字符：().-+*#
 */
export const postalCodeChecker: TChecker = () => {
    return [
        ...commonValidators(),
        {
            validator: checkPostalCode,
        },
    ];
};

/**
 * Name - 名称类，非用户名
 *
 * 最小1位，最大127位
 * 支持输入任意字符，不支持输入纯空格。（提交后用Trim（）去掉最前和最后的空格）
 */
export const normalNameChecker: TChecker = () => {
    return [
        {
            min: 1,
            max: 127,
            validator: checkRangeLength,
        },
    ];
};

/**
 * First Name
 *
 * 最小1位，最大63位
 * 任意字符
 */
export const firstNameChecker: TChecker = () => {
    return [
        {
            min: 1,
            max: 63,
            validator: checkRangeLength,
        },
    ];
};

/**
 * Last Name
 *
 * 最小1位，最大63位
 * 任意字符
 */
export const lastNameChecker: TChecker = firstNameChecker;

/**
 * Company Name
 *
 * 与 normalNameChecker 规则一样
 */
export const companyNameChecker: TChecker = normalNameChecker;

/**
 * Company ID （智慧办公产品的标识ID）
 */
export const companyIdChecker: TChecker = () => [
    {
        validator(rule, value) {
            if (value && !/^\d{2}[a-zA-Z]{5}[A-Z]{2}[a-zA-Z0-9]{2}$/.test(value)) {
                return Promise.reject(rule.message);
            }

            return Promise.resolve();
        },
        message: getErrorMessage(EErrorMessages.companyId),
    },
];

/**
 * SN（Yeastar所有产品通用规范）
 */
export const SNChecker: TChecker = () => [
    {
        validator: checkLettersAndNum,
    },
    {
        enum: [12, 16],
        validator: checkLength,
        message: getErrorMessage(EErrorMessages.sn),
    },
];

/**
 * 金额输入
 *
 * 小数点前最大10位，小数点后2位
 */
export const moneyChecker: TChecker = () => [
    {
        // 只能是数值
        validator: checkNumber,
    },
    {
        // 只能是正数
        min: 0,
        validator: checkMinValue,
    },
    {
        // 校验整数位
        len: 10,
        validator(rule, value) {
            const message =
                rule?.message ||
                getErrorMessage(EErrorMessages.amountMaxLength, {
                    0: rule.len,
                });

            try {
                // @ts-ignore rule is possibly 'undefined'
                if (value && isMinValue(value, Math.pow(10, rule.len - 1))) {
                    return Promise.reject(message);
                }
            } catch (e) {
                return Promise.reject(message);
            }

            return Promise.resolve();
        },
    },
    {
        // 校验小数位
        len: 2,
        validator(rule, value) {
            const message =
                rule?.message ||
                getErrorMessage(EErrorMessages.amountDecimalsMaxLength, {
                    0: rule.len,
                });

            try {
                // @ts-ignore rule is possibly 'undefined'
                if (value % 1 !== 0 && isMatches(value, new RegExp(`\\.\\d{${rule.len + 1},}$`))) {
                    return Promise.reject(message);
                }
            } catch (e) {
                return Promise.reject(message);
            }

            return Promise.resolve();
        },
    },
];

/**
 * 域名/服务器地址
 *
 * 最小3位，最大255位
 * 任意字符
 */
export const hostChecker: TChecker = () => {
    return [
        {
            min: 3,
            max: 255,
            validator: checkRangeLength,
        },
    ];
};
/**
 * 端口号
 *
 * 最小1位，最大5位
 * 1-65535范围内的整数,纯数字
 */
export const portChecker: TChecker = () => {
    return [
        {
            min: 1,
            max: 5,
            validator(rule, value) {
                const message = rule?.message || getErrorMessage(EErrorMessages.port);

                try {
                    if (value && !isPort(value)) {
                        return Promise.reject(message);
                    }
                } catch (e) {
                    return Promise.reject(message);
                }

                return Promise.resolve();
            },
        },
    ];
};
/**
 * userName
 *
 * 最小5位，最大255位
 * 至少包含大小写英文字母，支持除了空格外的任意字符，不支持除英文外的多语言
 */
 export const userNameChecker: TChecker = () => {
    return [
        {
            min: 5,
            max: 255,
            validator(rule, value) {
                const message = rule?.message || getErrorMessage(EErrorMessages.username);

                try {
                    if (
                        value &&
                        !isMatches(
                            value,
                            /^(?=.*[A-Z])(?=.*[a-z])[\u0020-\u007E]{5,255}$/,
                        )
                    ) {
                        return Promise.reject(message);
                    }
                } catch (e) {
                    return Promise.reject(message);
                }

                return Promise.resolve();
            },
        },
    ];
};

/**
 * 密码
 *
 * 最小8位，最大63位
 * 至少包含大小写英文字母，支持除了空格外的任意字符，不支持除英文外的多语言
 */
export const passwordChecker: TChecker = () => {
    return [
        {
            min: 8,
            max: 63,
            validator(rule, value) {
                const message = rule?.message || getErrorMessage(EErrorMessages.password);

                try {
                    if (
                        value &&
                        !isMatches(
                            value,
                            /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])[\u0021-\u007E]{8,63}$/,
                        )
                    ) {
                        return Promise.reject(message);
                    }
                } catch (e) {
                    return Promise.reject(message);
                }

                return Promise.resolve();
            },
        },
    ];
};

/**
 * url合法性
 *
 */
export const urlChecker: TChecker = () => {
    return [
        {
            min: 1,
            max: 127,
            validator: checkRangeLength,
        },
        {
            validator: checkUrl,
        },
    ];
};
