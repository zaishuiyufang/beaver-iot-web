import {
    isDecimals,
    // isEmail,
    isEmpty,
    isGtValue,
    isHexadecimal,
    isIP,
    isMACAddress,
    isMatches,
    isMaxLength,
    isMaxValue,
    isMinLength,
    isMinValue,
    isMobilePhone,
    isNumeric,
    isPort,
    isPostalCode,
    isRangeLength,
    isRangeValue,
    isURL,
    isAscii,
    isFQDN,
    isInt,
} from './asserts';
import getErrorMessage, { EErrorMessages } from './getErrorMessage';
import type { StoreValue, RuleObject } from './typings';

export type TValidator = (rule: RuleObject, value: StoreValue) => Promise<void | any> | void;

/**
 * 必填项
 * 对应 EErrorMessages.required
 */
export const checkRequired: TValidator = (rule, value) => {
    const message = rule?.message || getErrorMessage(EErrorMessages.required);

    if (rule.required === false) {
        return Promise.resolve();
    }

    try {
        if (!isEmpty(value)) {
            return Promise.resolve();
        }
    } catch (e) {
        // do nothing
    }

    return Promise.reject(message);
};

/**
 * 最小值
 * 对应 EErrorMessages.minValue
 */
export const checkMinValue: TValidator = (rule, value) => {
    const message =
        rule?.message ||
        getErrorMessage(EErrorMessages.minValue, {
            0: rule.min,
        });

    try {
        // @ts-ignore rule is possibly 'undefined'
        if (value && !isMinValue(value, rule.min)) {
            return Promise.reject(message);
        }
    } catch (e) {
        return Promise.reject(message);
    }

    return Promise.resolve();
};

/**
 * 最大值
 * 对应 EErrorMessages.maxValue
 */
export const checkMaxValue: TValidator = (rule, value) => {
    const message =
        rule?.message ||
        getErrorMessage(EErrorMessages.maxValue, {
            0: rule.max,
        });

    try {
        // @ts-ignore rule is possibly 'undefined'
        if (value && !isMaxValue(value, rule.max)) {
            return Promise.reject(message);
        }
    } catch (e) {
        return Promise.reject(message);
    }

    return Promise.resolve();
};
/**
 * 最大最小值
 * 对应 EErrorMessages.rangeValue
 */
export const checkRangeValue: TValidator = (rule, value) => {
    const message =
        rule?.message ||
        getErrorMessage(EErrorMessages.rangeValue, {
            0: rule.min,
            1: rule.max,
        });

    try {
        // @ts-ignore rule is possibly 'undefined'
        if (!isEmpty(value) && !isRangeValue(value, rule.min, rule.max)) {
            return Promise.reject(message);
        }
    } catch (e) {
        return Promise.reject(message);
    }

    return Promise.resolve();
};

/**
 * 检查值是否存在于指定值范围中的一个
 */
export const checkValue: TValidator = (rule, value) => {
    const message =
        rule?.message ||
        getErrorMessage(EErrorMessages.value, {
            // @ts-ignore rule is possibly 'undefined'
            0: rule.enum.join(', '),
        });

    try {
        // @ts-ignore rule is possibly 'undefined'
        if (value && !rule.enum.some(val => isRangeValue(value, val, val))) {
            return Promise.reject(message);
        }
    } catch (e) {
        return Promise.reject(message);
    }

    return Promise.resolve();
};

/**
 * 最小位数
 * 对应 EErrorMessages.minLength
 */
export const checkMinLength: TValidator = (rule, value) => {
    const message =
        rule?.message ||
        getErrorMessage(EErrorMessages.minLength, {
            0: rule.min,
        });

    try {
        // @ts-ignore rule is possibly 'undefined'
        if (value && !isMinLength(value, rule.min)) {
            return Promise.reject(message);
        }
    } catch (e) {
        return Promise.reject(message);
    }

    return Promise.resolve();
};

/**
 * 最大位数
 * 对应 EErrorMessages.maxLength
 */
export const checkMaxLength: TValidator = (rule, value) => {
    const message =
        rule?.message ||
        getErrorMessage(EErrorMessages.maxLength, {
            1: rule.max,
        });

    try {
        // @ts-ignore rule is possibly 'undefined'
        if (value && !isMaxLength(value, rule.max)) {
            return Promise.reject(message);
        }
    } catch (e) {
        return Promise.reject(message);
    }

    return Promise.resolve();
};

/**
 * 最大最小位数
 * 对应 EErrorMessages.rangeLength
 */
export const checkRangeLength: TValidator = (rule, value) => {
    const message =
        rule?.message ||
        getErrorMessage(EErrorMessages.rangeLength, {
            0: rule.min,
            1: rule.max,
        });

    try {
        // @ts-ignore rule is possibly 'undefined'
        if (value && !isRangeLength(value, rule.min, rule.max)) {
            return Promise.reject(message);
        }
    } catch (e) {
        return Promise.reject(message);
    }

    return Promise.resolve();
};

/**
 * 校验长度是否是指定的长度，可以是 len 也可以通过 enum 指定多个 len
 */
export const checkLength: TValidator = (rule, value) => {
    let values;
    if (rule.len) {
        // 单个值
        values = rule.len;
    } else if (rule.enum) {
        // 多个值
        values = rule.enum.join(',');
    }

    const message =
        rule?.message ||
        getErrorMessage(EErrorMessages.length, {
            0: values,
        });

    try {
        if (rule.len) {
            if (value && !isRangeLength(value, rule.len, rule.len)) {
                return Promise.reject(message);
            }
        } else if (rule.enum) {
            if (value && !rule.enum.some((len: number) => isRangeLength(value, len, len))) {
                return Promise.reject(message);
            }
        }
    } catch (e) {
        return Promise.reject(message);
    }

    return Promise.resolve();
};

/**
 * IPv4类 IP地址/掩码/网关
 * 对应 EErrorMessages.ipAddress
 */
export const checkIPAddressV4: TValidator = (rule, value) => {
    const message = rule?.message || getErrorMessage(EErrorMessages.ipAddress);

    try {
        if (value && !isIP(value, 4)) {
            return Promise.reject(message);
        }
    } catch (e) {
        return Promise.reject(message);
    }

    return Promise.resolve();
};

/**
 * IPv6类 IP地址/掩码/网关
 * 对应 EErrorMessages.netmask
 */
export const checkIPAddressV6: TValidator = (rule, value) => {
    const message = rule?.message || getErrorMessage(EErrorMessages.ipv6Address);

    try {
        if (value && !isIP(value, 6)) {
            return Promise.reject(message);
        }
    } catch (e) {
        return Promise.reject(message);
    }

    return Promise.resolve();
};

/**
 * Mac地址
 * 对应 EErrorMessages.mac
 */
export const checkMACAddress: TValidator = (rule, value) => {
    const message = rule?.message || getErrorMessage(EErrorMessages.mac);

    try {
        if (value && !isMACAddress(value)) {
            return Promise.reject(message);
        }
    } catch (e) {
        return Promise.reject(message);
    }

    return Promise.resolve();
};

/**
 * Mobile Number/Phone Number/Fax- 电话号码类
 * 对应 EErrorMessages.phone
 */
export const checkMobilePhone: TValidator = (rule, value) => {
    const message = rule?.message || getErrorMessage(EErrorMessages.phone);

    try {
        if (value && !isMobilePhone(value)) {
            return Promise.reject(message);
        }
    } catch (e) {
        return Promise.reject(message);
    }

    return Promise.resolve();
};

/**
 * 允许+86 中国大陆手机号码
 */
export const checkMobileCNPhone: TValidator = (rule, value) => {
    const message = rule?.message || getErrorMessage(EErrorMessages.cnPhone);

    try {
        if (value && !isMobilePhone(value, 'zh-CN', { loose: false })) {
            return Promise.reject(message);
        }
    } catch (e) {
        return Promise.reject(message);
    }

    return Promise.resolve();
};

/**
 * Zip/Postal Code- 邮政编码类
 */
export const checkPostalCode: TValidator = (rule, value) => {
    const message = rule?.message || getErrorMessage(EErrorMessages.postalCode);

    try {
        if (value && !isPostalCode(value)) {
            return Promise.reject(message);
        }
    } catch (e) {
        return Promise.reject(message);
    }

    return Promise.resolve();
};

/**
 * 十进制数值
 * 对应 EErrorMessages.number
 */
export const checkNumber: TValidator = (rule, value) => {
    const message = rule?.message || getErrorMessage(EErrorMessages.number);

    try {
        if (value && !isNumeric(value)) {
            return Promise.reject(message);
        }
    } catch (e) {
        return Promise.reject(message);
    }

    return Promise.resolve();
};

/**
 * 十进制数值，无0
 * 对应 EErrorMessages.numberNoZero
 */
export const checkNumberNoZero: TValidator = (rule, value) => {
    const message = rule?.message || getErrorMessage(EErrorMessages.numberNoZero);

    try {
        if (value && !(isNumeric(value) && isGtValue(value, 0))) {
            return Promise.reject(message);
        }
    } catch (e) {
        return Promise.reject(message);
    }

    return Promise.resolve();
};

/**
 * 十六进制数值
 * 对应 EErrorMessages.hexNumber
 */
export const checkHexNumber: TValidator = (rule, value) => {
    const message = rule?.message || getErrorMessage(EErrorMessages.hexNumber);

    try {
        if (value && !isHexadecimal(value)) {
            return Promise.reject(message);
        }
    } catch (e) {
        return Promise.reject(message);
    }

    return Promise.resolve();
};

/**
 * 端口：网络端口
 * 对应 EErrorMessages.port
 */
export const checkPort: TValidator = (rule, value) => {
    const message = rule?.message || getErrorMessage(EErrorMessages.port);

    // 若获取到的值为数字，则转换为字符串
    let val = value;
    if (typeof val === 'number') {
        val = String(val);
    }

    try {
        if (value && !isPort(val)) {
            return Promise.reject(message);
        }
    } catch (e) {
        return Promise.reject(message);
    }

    return Promise.resolve();
};
/**
 * Email Address - 邮箱地址
 * 对应 EErrorMessages.email
 */
export const checkEmail: TValidator = (rule, value) => {
    const message = rule?.message || getErrorMessage(EErrorMessages.email);
    const emailReg =
        /^\w+((-\w+)|(\.\w+)|(\+\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.([A-Za-z0-9]+)$/;

    try {
        if (value && !emailReg.test(value)) {
            return Promise.reject(message);
        }
    } catch (e) {
        return Promise.reject(message);
    }

    return Promise.resolve();
};

/**
 * 是否小数
 * 对应 EErrorMessages.decimals
 */
export const checkDecimals: TValidator = (rule, value) => {
    const message = rule?.message || getErrorMessage(EErrorMessages.decimals);

    try {
        if (
            value &&
            !isDecimals(
                value,
                rule.len
                    ? {
                          decimal_digits: `0,${rule.len}`,
                      }
                    : {},
            )
        ) {
            return Promise.reject(message);
        }
    } catch (e) {
        return Promise.reject(message);
    }

    return Promise.resolve();
};

/**
 * 不支持小数，小数则报错 Promise.reject
 * 对应 EErrorMessages.number， 要求输入纯数字
 */
export const checkNoDecimals: TValidator = (rule, value) => {
    const message = rule?.message || getErrorMessage(EErrorMessages.number);

    try {
        if (
            value &&
            isDecimals(
                value,
                rule.len
                    ? {
                          decimal_digits: `0,${rule.len}`,
                      }
                    : {},
            )
        ) {
            return Promise.reject(message);
        }
    } catch (e) {
        return Promise.reject(message);
    }

    return Promise.resolve();
};

/**
 * 支持大小写字母
 * 对应 EErrorMessages.letters
 */
export const checkLetters: TValidator = (rule, value) => {
    const message = rule?.message || getErrorMessage(EErrorMessages.letters);

    try {
        if (value && !isMatches(value, /^[a-zA-Z]+$/)) {
            return Promise.reject(message);
        }
    } catch (e) {
        return Promise.reject(message);
    }

    return Promise.resolve();
};

/**
 * 支持数字和大小写字母
 * 对应 EErrorMessages.lettersAndNum
 */
export const checkLettersAndNum: TValidator = (rule, value) => {
    const message = rule?.message || getErrorMessage(EErrorMessages.lettersAndNum);

    try {
        if (value && !isMatches(value.toString(), /^[a-zA-Z0-9]+$/)) {
            return Promise.reject(message);
        }
    } catch (e) {
        return Promise.reject(message);
    }

    return Promise.resolve();
};

/**
 * 至少包含一个小写字母
 */
export const checkAtLeastOneLowercaseLetter: TValidator = (rule, value) => {
    const message = rule?.message || getErrorMessage(EErrorMessages.atLeastOneLowercaseLetter);

    try {
        if (value && !isMatches(value, /[a-z]/)) {
            return Promise.reject(message);
        }
    } catch (e) {
        return Promise.reject(message);
    }

    return Promise.resolve();
};

/**
 * 至少包含一个大写字母
 */
export const checkAtLeastOneUppercaseLetter: TValidator = (rule, value) => {
    const message = rule?.message || getErrorMessage(EErrorMessages.atLeastOneUppercaseLetter);

    try {
        if (value && !isMatches(value, /[A-Z]/)) {
            return Promise.reject(message);
        }
    } catch (e) {
        return Promise.reject(message);
    }

    return Promise.resolve();
};

/**
 * 至少包含一个数字
 */
export const checkAtLeastOneNum: TValidator = (rule, value) => {
    const message = rule?.message || getErrorMessage(EErrorMessages.atLeastOneNum);

    try {
        if (value && !isMatches(value, /[0-9]/)) {
            return Promise.reject(message);
        }
    } catch (e) {
        return Promise.reject(message);
    }

    return Promise.resolve();
};

/**
 * 不支持有空格
 */
export const checkHasWhitespace: TValidator = (rule, value) => {
    const message = rule?.message || getErrorMessage(EErrorMessages.notIncludeWhitespace);

    try {
        if (value && isMatches(value, /[\s\r\n\t]/)) {
            return Promise.reject(message);
        }
    } catch (e) {
        return Promise.reject(message);
    }

    return Promise.resolve();
};

/**
 * 必须以 a-zA-Z0-9_ 开头
 */
export const checkStartWithNormalChar: TValidator = (rule, value) => {
    const message = rule?.message || getErrorMessage(EErrorMessages.startWithNormalChar);

    try {
        if (value && !isMatches(value, /^[a-z-A-Z0-9_]/)) {
            return Promise.reject(message);
        }
    } catch (e) {
        return Promise.reject(message);
    }

    return Promise.resolve();
};

/**
 * Url Address - URL地址
 * 对应 EErrorMessages.url
 */
export const checkUrl: TValidator = (rule, value) => {
    const message = rule?.message || getErrorMessage(EErrorMessages.url);

    try {
        if (value && !isURL(value)) {
            return Promise.reject(message);
        }
    } catch (e) {
        return Promise.reject(message);
    }

    return Promise.resolve();
};

/**
 * 数字的最大值检验
 */
export const checkNumericMaxValue: TValidator = (rule, value) => {
    const { max } = rule;
    const message =
        rule?.message ||
        getErrorMessage(EErrorMessages.maxValue, {
            0: max,
        });

    try {
        if (
            value &&
            !Number.isNaN(Number(value)) &&
            (max || max === 0) &&
            !Number.isNaN(Number(max)) &&
            value > max
        ) {
            return Promise.reject(message);
        }
    } catch (e) {
        return Promise.reject(message);
    }

    return Promise.resolve();
};

/**
 * 数字的最小值检验
 */
export const checkNumericMinValue: TValidator = (rule, value) => {
    const { min } = rule;
    const message =
        rule?.message ||
        getErrorMessage(EErrorMessages.minValue, {
            0: min,
        });

    try {
        if (
            value &&
            !Number.isNaN(Number(value)) &&
            (min || min === 0) &&
            !Number.isNaN(Number(min)) &&
            value < min
        ) {
            return Promise.reject(message);
        }
    } catch (e) {
        return Promise.reject(message);
    }

    return Promise.resolve();
};

/**
 * 不含空格的ASCII字符
 */
export const checkNoIncludesSpaceAscii: TValidator = (rule, value) => {
    const message = rule?.message || getErrorMessage(EErrorMessages.noIncludesSpaceAscii);

    try {
        if (value && (!isAscii(value) || value?.includes(' '))) {
            return Promise.reject(message);
        }
    } catch (e) {
        return Promise.reject(message);
    }

    return Promise.resolve();
};

/**
 * 仅允许输入大写字母、小写字母、数字及“_”、“-”
 */
export const checkCharStringRulesOne: TValidator = (rule, value) => {
    const message = rule?.message || getErrorMessage(EErrorMessages.stringRulesOne);

    try {
        if (value && !isMatches(value, /^[a-z-A-Z0-9_-]+$/)) {
            return Promise.reject(message);
        }
    } catch (e) {
        return Promise.reject(message);
    }

    return Promise.resolve();
};

/**
 * 仅允许输入大写字母、小写字母、数字及!"#$%&'()*+,-./:;<=>@[]^_`{|}~
 */
export const checkCharStringRulesTwo: TValidator = (rule, value) => {
    const message = rule?.message || getErrorMessage(EErrorMessages.stringRulesTwo);

    try {
        if (value && !isMatches(value, /^[A-Za-z0-9!"#$%&'()*+,\-./:;<=>@[\]^_`{|}~]+$/)) {
            return Promise.reject(message);
        }
    } catch (e) {
        return Promise.reject(message);
    }

    return Promise.resolve();
};

/**
 * 检测是否为 ipv4/ipv6 或域名 或 url
 */
export const checkIsIpOrDomain: TValidator = (rule, value) => {
    const message = rule?.message || getErrorMessage(EErrorMessages.ipOrDomain);

    try {
        if (
            value &&
            !isIP(value, 4) &&
            !isIP(value, 6) &&
            !isFQDN(value) &&
            !isURL(value, {
                require_protocol: true,
                protocols: ['http', 'https', 'ftp', 'ftps', 'ws', 'wss'],
            })
        ) {
            return Promise.reject(message);
        }
    } catch (e) {
        return Promise.reject(message);
    }

    return Promise.resolve();
};

/**
 * 整数校验（正整数、负整数和零）
 */
export const checkIsInt: TValidator = (rule, value) => {
    const message = rule?.message || getErrorMessage(EErrorMessages.integerPositiveNegativeZero);

    try {
        if (value && !isInt(value)) {
            return Promise.reject(message);
        }
    } catch (e) {
        return Promise.reject(message);
    }

    return Promise.resolve();
};

/**
 * 正整数校验（正整数和零）
 */
export const checkIsPositiveInt: TValidator = (rule, value) => {
    const message = rule?.message || getErrorMessage(EErrorMessages.integerPositiveZero);

    try {
        if (value && (!isInt(value) || value < 0)) {
            return Promise.reject(message);
        }
    } catch (e) {
        return Promise.reject(message);
    }

    return Promise.resolve();
};

/**
 * 必须以 http/https 开头
 */
export const checkStartWithHttpOrHttps: TValidator = (rule, value) => {
    const message = rule?.message || getErrorMessage(EErrorMessages.startWithHttpOrHttps);

    try {
        if (
            value &&
            !isURL(value, {
                require_protocol: true,
                protocols: ['http', 'https'],
            })
        ) {
            return Promise.reject(message);
        }
    } catch (e) {
        return Promise.reject(message);
    }

    return Promise.resolve();
};

/**
 * 必须以 ws/wss 开头
 */
export const checkStartWithWsOrWss: TValidator = (rule, value) => {
    const message = rule?.message || getErrorMessage(EErrorMessages.startWithWsOrWss);

    try {
        if (
            value &&
            !isURL(value, {
                require_protocol: true,
                protocols: ['ws', 'wss'],
            })
        ) {
            return Promise.reject(message);
        }
    } catch (e) {
        return Promise.reject(message);
    }

    return Promise.resolve();
};

/**
 * 不允许字符: &/\:*?'"<>|%
 */
export const checkNotAllowStringRuleOne: TValidator = (rule, value) => {
    const message =
        rule?.message ||
        getErrorMessage(EErrorMessages.notAllowStringOne, {
            0: '&/\\:*?\'"<>|%',
        });

    try {
        if (value && isMatches(value, /[&/\\:*?'"<>|%]/)) {
            return Promise.reject(message);
        }
    } catch (e) {
        return Promise.reject(message);
    }

    return Promise.resolve();
};
