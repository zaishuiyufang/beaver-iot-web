import { useEffect, useState } from 'react';
import { useRequest } from 'ahooks';

interface EntityOptionProps {
    entityType: EntityType;
    entityValueTypes: EntityValueType[];
}

function sleep(duration: number): Promise<void> {
    return new Promise<void>(resolve => {
        setTimeout(() => {
            resolve();
        }, duration);
    });
}

/**
 * 实体选项数据获取 hooks
 */
export function useEntitySelectOptions(props: EntityOptionProps) {
    const { entityType, entityValueTypes } = props;

    const [options, setOptions] = useState<EntityOptionType[]>([]);
    const [loading, setLoading] = useState(false);

    const { run: getEntityOptions, data: optionsFromServer } = useRequest(
        async (keyword?: string) => {
            setLoading(true);
            setOptions([]);

            await sleep(1500);

            return [
                {
                    label: `Option test ${keyword || ''}`,
                    value: 'option value test',
                    description: 'Option test Description',
                },
                {
                    label: `Option test 2`,
                    value: 'option 2 test',
                    description: 'Option 2 Description',
                },
                {
                    label: `Option test 3`,
                    value: 'option value 3',
                    description: 'Option 3 Description',
                },
            ];
        },
        {
            manual: true,
            refreshDeps: [entityType],
            debounceWait: 300,
        },
    );

    /** 初始化执行 */
    useEffect(() => {
        getEntityOptions();
    }, [getEntityOptions]);

    useEffect(() => {
        console.log('filterOptions ? ', entityValueTypes);

        setOptions(optionsFromServer || []);
        setLoading(false);
    }, [optionsFromServer, entityValueTypes]);

    return {
        loading,
        getEntityOptions,
        options,
        setOptions,
    };
}
