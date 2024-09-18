import { ViewConfigProps } from "./typings";
import { ViewProps } from "../../../render/typings";
import configJson from '../config.json';
import './style.less';

interface Props {
    config: ViewConfigProps;
}

const View = (props: Props) => {
    const { config } = props;

    const handleService = () => {
        // 发送服务
    };

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
            if (Tag === 'icon') {
                const icon = renderParams(tagProps?.params);
                return !!icon && <svg data-testid={icon}></svg>;
            }
            return (
                <Tag
                    className={theme?.class}
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

    return (
        <>
            {
                configJson?.view?.map((viewItem) => {
                    return renderTag(viewItem);
                })
            }
        </>
    )
};

export default View;