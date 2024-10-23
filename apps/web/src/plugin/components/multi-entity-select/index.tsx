import { useMemo } from 'react';
import { Autocomplete, TextField, Checkbox } from '@mui/material';

import type { AutocompleteProps } from '@mui/material';
import './style.less';

/**
 * 实体下拉框类型
 */
export interface EntityOptionType {
    label: string;
    value: string;
    description: string;
}

type EntitySelectProps = AutocompleteProps<EntityOptionType, true, false, undefined> & {
    onChange: (value: EntityOptionType[] | null) => void;
};

/**
 * 实体选择下拉框组件（多选）
 */
const MultiEntitySelect = (props: EntitySelectProps) => {
    const entityOptions = useMemo(() => {
        return [
            {
                label: 'Option 1',
                value: 'option value 1',
                description: 'Option 1 Description',
            },
            {
                label: 'Option 2',
                value: 'option value 2',
                description: 'Option 2 Description',
            },
            {
                label: 'Option 3',
                value: 'option value 3',
                description: 'Option 3 Description',
            },
        ];
    }, []);

    const { onChange, options = entityOptions, ...restProps } = props;

    const renderOption: EntitySelectProps['renderOption'] = (optionProps, option, { selected }) => {
        const { key, ...restOptionProps } = optionProps || {};
        const { label, description } = option || {};

        return (
            <li key={key} {...restOptionProps}>
                <div className="ms-multi-entity-select">
                    <Checkbox style={{ marginRight: 8 }} checked={selected} />
                    <div className="ms-entity-select-item">
                        <div className="ms-entity-select-item__label">{label}</div>
                        <div className="ms-entity-select-item__description">{description}</div>
                    </div>
                </div>
            </li>
        );
    };

    return (
        <Autocomplete
            {...restProps}
            multiple
            onChange={(_, option) => onChange(option)}
            options={options}
            renderInput={params => <TextField {...params} label="Entity" placeholder="Favorites" />}
            renderOption={renderOption}
            getOptionLabel={option => option?.label || ''}
        />
    );
};

export default MultiEntitySelect;
