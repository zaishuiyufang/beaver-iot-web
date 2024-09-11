const UA = window.navigator.userAgent;

/**
 * @description 检查客户端是否为移动端
 */
export function isMobile() {
    // eslint-disable-next-line
    return /Android|iPhone|webOS|BlackBerry|SymbianOS|Windows Phone|iPad|iPod/i.test(UA);
}

/**
 * @description 检查客户端是否为 IOS
 */
export function isIOS() {
    return !!UA.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
}

/**
 * @description 检查客户端是否为 safari 浏览器
 */
export function isSafari() {
    return /^((?!chrome|android).)*safari/i.test(UA);
}

/**
 * @description 检查客户端是否为 android
 */
export function isAndroid() {
    return UA.indexOf('Android') > -1 || UA.indexOf('Adr') > -1;
}

/**
 * @description 检查是否为微信 webview 环境
 */
export function isWeiXin() {
    return /MicroMessenger/i.test(UA);
}

/**
 * @description 检查是否为企业微信 webview 环境
 */
export function isWeiXinWork() {
    return /wxwork/i.test(UA);
}

/**
 * @description 检查是否为微信小程序 web-view 环境
 */
export function isWXMP() {
    return window.__wxjs_environment === 'miniprogram' || /miniProgram/i.test(UA);
}

/**
 * @description 检查是否为钉钉 webview 环境
 */
export function isDingTalk() {
    return /DingTalk/i.test(UA);
}

/**
 * @description 检查是否为 Teams
 */
export function isTeams() {
    return /Teams/i.test(UA);
}
