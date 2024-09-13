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
     * 组件内置属性，参考MUI官网文档
     */
    componentProps?: Record<string, any>;
    /**
     * 下拉选项配置
     */
    options?: OptionsProps[];
}

export interface ConfigProps {
    /**
     * 表单组件标题
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
     * 组件样式，支持填写多种风格，默认取default
     */
    theme?: Record<ThemeType, ThemeProps>;
    /** 
     * 组件集合
     */
    components?: ComponentProps[];
}

export interface CustomComponentProps {
    /**
     * 组件名称
     */
    name: string;
    /**
     * 组件类型
     * @description 用来区分被使用者使用组件的唯一标识，与plugins下文件夹名称一致
     */
    type: string;
    /**
     * 组件配置属性
     */
    configProps: ConfigProps[];
}