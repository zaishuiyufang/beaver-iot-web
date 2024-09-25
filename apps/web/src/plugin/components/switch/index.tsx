import {
    Switch as MuiSwitch,
    SwitchProps as MuiSwitchProps,
    FormControlLabel,
} from '@mui/material';

type SwitchProps = MuiSwitchProps;

const Switch = (props: SwitchProps) => {
    const { title, ...rest } = props;

    return (
        <div>
            <FormControlLabel control={<MuiSwitch {...rest} />} label={title} />
        </div>
    );
};

export default Switch;
