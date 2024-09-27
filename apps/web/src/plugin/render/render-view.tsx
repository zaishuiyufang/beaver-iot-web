
import { isString } from "lodash-es";
import { parseStyleToReactStyle } from "./util";

interface Props {
    config: any;
    configJson: CustomComponentProps;
}

const View = (props: Props) => {
    const { config, configJson } = props;

    // 处理显示依赖
    const isShow = (depended?: Record<string, any>) => {
        if (depended) {
            for (const key in depended) {
                if (depended[key] !== (config as any)?.[key]) {
                    return false;
                }
            }
        }
        return true;
    };

    // 渲染参数
    const renderParams = (params?: Record<string, any>) => {
        if (params?.length) {
            const result = params.map((key: string) => {
                return (config as any)?.[key];
            })
            return result?.join('');
        }
        return null;
    }

    // 渲染标签
    const renderTag = (tagProps: ViewProps) => {
        if (isShow(tagProps?.showDependend) && tagProps?.tag) {
            const Tag: any = tagProps?.tag;
            const theme = tagProps?.themes?.['default'];
            let style = `${tagProps?.style}${theme?.style}`;
            if (Tag === 'icon') {
                const icon = renderParams(tagProps?.params);
                return !!icon && <svg data-testid={icon}></svg>;
            }
            return (
                <Tag
                    className={`${tagProps.class || ''} ${theme?.class || ''}`}
                    style={style ? parseStyleToReactStyle(style) : undefined}
                >
                    {
                        !tagProps?.params ? (
                            tagProps?.content
                        ) : (
                            renderParams(tagProps?.params)
                        )
                    }
                    {
                        tagProps?.children?.map((subItem) => {
                            return renderTag(subItem);
                        })
                    }
                </Tag>
            )
        }
    };

    const replaceTemplate = (template: string) => {
        return template.replace(/\${{(.*?)}}/g, (match, key) => {
            // 去除 key 两端的空白字符并从 values 对象中获取对应的值
            const value = config[key.trim()];
            // 如果值不存在，返回原始的匹配字符串
            return value !== undefined ? value : match;
        });
    }

    const renderHtml = () => {
        if (configJson?.view) {
            const html = replaceTemplate(configJson?.view as string);
            return <div dangerouslySetInnerHTML={{ __html: html }}></div>;
        }
        return null;
    };

    return (
        <>
            {
                isString(configJson?.view) ? (
                    renderHtml()
                ) : (
                    configJson?.view?.map((viewItem: ViewProps) => {
                        return renderTag(viewItem);
                    })
                )
            }
        </>
    )
};

export default View;