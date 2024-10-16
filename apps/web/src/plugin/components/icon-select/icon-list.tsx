import { OutlinedInput, InputAdornment } from '@mui/material';
import * as Icons from '@milesight/shared/src/components/icons';
import { Search } from '@mui/icons-material';

interface IconListProps {
    options: OptionsProps[];
    onChange: (value: string | number) => void;
}

const IconList = (props: IconListProps) => {
    const { options, onChange } = props;

    return (
        <div
            onClick={(e: any) => {
                e.stopPropagation();
            }}
            className="icon-select-list"
        >
            <OutlinedInput
                startAdornment={
                    <InputAdornment position="start">
                        <Search />
                    </InputAdornment>
                }
            />
            <div className="icon-select-list-main">
                {options.map((option: OptionsProps) => {
                    const IconTag: any = (Icons as any)[option.label as string];
                    return (
                        <span className="icon-select-icon" onClick={() => onChange(option.value)}>
                            <IconTag className="icon-select-icon-img" />
                        </span>
                    );
                })}
            </div>
        </div>
    );
};

export default IconList;
