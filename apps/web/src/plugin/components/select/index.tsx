import { useMemo } from 'react';
import {
    Select as MuiSelect,
    SelectProps as MuiSelectProps,
    ListSubheader,
    MenuItem,
    FormControl,
    InputLabel,
} from '@mui/material';

type Props = {
    /**
     * 下拉选项
     */
    options: OptionsProps[];
};

type SelectProps = Props & MuiSelectProps;

const Select = (props: SelectProps) => {
    const { options, style, title, ...rest } = props;

    // 转换下拉选项数据
    const getMenuItems = useMemo(() => {
        const list: OptionsProps[] = [];
        const loopItem = (item: OptionsProps): any => {
            if (item.options?.length) {
                list.push({ label: item.label });
                item.options.forEach((subItem: OptionsProps) => {
                    loopItem(subItem);
                });
            } else {
                list.push({ label: item.label, value: item.value });
            }
        };
        options?.forEach((item: OptionsProps) => {
            loopItem(item);
        });
        return list;
    }, [options]);

    return (
        <FormControl sx={{ m: 1, ...style }}>
            {!!title && (
                <InputLabel size={rest?.size as any} id="select-lable">
                    {title}
                </InputLabel>
            )}
            <MuiSelect {...rest} label={title} labelId="select-lable">
                {getMenuItems?.map((item: OptionsProps) => {
                    return item?.value ? (
                        <MenuItem value={item.value}>{item.label}</MenuItem>
                    ) : (
                        <ListSubheader>{item.label}</ListSubheader>
                    );
                })}
            </MuiSelect>
        </FormControl>
    );
};

export default Select;
