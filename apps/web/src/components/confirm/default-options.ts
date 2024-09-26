import { merge } from 'lodash-es';
import { GlobalOptions, ConfirmOptions, FinalOptions } from './types';

export const defaultGlobalOptions: GlobalOptions = {
    dialogContentProps: {
        sx: { width: 400 },
    },
    dialogActionsProps: {
        sx: {
            padding: 3,
            pt: 1,
        },
    },
    confirmButtonText: 'Confirm', // Todo: 国际化
    cancelButtonText: 'Cancel', // Todo: 国际化
    confirmButtonProps: {
        color: 'primary',
        variant: 'contained',
        sx: {
            textTransform: 'none',
        },
    },
    cancelButtonProps: {
        autoFocus: true,
        color: 'primary',
        variant: 'outlined',
        sx: {
            textTransform: 'none',
            mr: 1,
            '&:last-child': {
                mr: 0,
            },
        },
    },
};

export const handleOverrideOptions = (
    globalOptions?: GlobalOptions,
    confirmOptions?: ConfirmOptions,
): FinalOptions => merge(defaultGlobalOptions, globalOptions, confirmOptions);
