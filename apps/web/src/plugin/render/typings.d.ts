/**
 * 主题
 */
export type ThemeType = 'default';

/**
 * 主题样式设置
 */
export interface ThemeProps {
    /**
     * 样式类名设置
     */
    class?: string;
    /**
     * 直连样式设置
     */
    style?: string;
}

export interface OptionsProps {
    label: string;
    value?: string;
    options?: OptionsProps[];
}

export interface ComponentProps {
    /**
     * 表单组件类型
     * @description 映射到components文件中组件，也可以直接是组件库支持的组件
     */
    type: string;
    /**
     * 组件绑定字段
     */
    key: string;
    /**
     * 表单组件标题
     */
    title?: string;
    /**
     * 组件样式
     */
    style?: string;
    /**
     * 组件内置属性
     * @description 可配置组件的内置属性，参考MUI官网文档
     */
    componentProps?: Record<string, any>;
    /**
     * 从远程服务获取数据
     * @description 未配置时取options配置
     */
    getDataUrl?: string;
    /**
     * 下拉选项配置
     * @description 无getDataUrl时生效
     */
    options?: OptionsProps[];
}

export interface ConfigProps {
    /**
     * 表单组件标题
     * @description 一个配置项显示的标题
     */
    title?: string;
    /**
     * 组件样式
     */
    style?: string;
    /**
     * 组件类名
     */
    class?: string;
    /**
     * 组件样式
     * @description 支持填写多种风格，默认取default
     */
    theme?: Record<ThemeType, ThemeProps>;
    /**
     * 组件集合
     * @description 组件集合，用于配置表单组件，一个配置项集合，可由多个基础组件组合
     */
    components?: ComponentProps[];
}

export interface ViewThemeProps {
    /**
     * 样式类名
     */
    class?: string;
    /**
     * 直连样式
     */
    style?: string;
}

export interface ViewProps {
    /**
     * html标签名称
     * @description 具体标签参考html支持的标签
     */
    tag: string;
    /**
     * html标签属性
     * @description 具体标签属性参考html标签支持的属性
     */
    props?: Record<string, any>;
    /**
     * html标签id
     */
    id?: string;
    /**
     * html标签内容
     * @description 固定的标签内容，params属性无值时生效
     */
    content?: string;
    /**
     * html内容绑定的参数变量
     * @description 支持绑定多个参数，绑定后默认显示绑定的变量值，多个直接拼接
     */
    params?: string[];
    /**
     * html标签显示依赖
     */
    showDependend?: Record<string, any>;
    /**
     * html子节点
     */
    children?: ViewProps[];
    /**
     * html标签风格
     * @description 支持配置多个风格
     */
    themes?: Record<ThemeType, ViewThemeProps>;
}

export interface CustomComponentProps {
    /**
     * 组件名称
     * @description name是组件显示的名称，比如在选择使用哪个组件的时候作为显示使用
     */
    name: string;
    /**
     * 组件类型
     * @description 用来区分被使用者使用组件的唯一标识，与plugins下文件夹名称一致
     */
    type: string;
    /**
     * 组件配置属性，可配置多个
     */
    configProps: ConfigProps[];
    /**
     * 预览界面配置
     * @description 可以是json单独配置各个属性，也可以直接传入html字符串，其中${{}}包围的是参数变量，渲染的时候替换
     */
    view: ViewProps[] | string;
}
