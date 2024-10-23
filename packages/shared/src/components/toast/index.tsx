import React from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { Snackbar } from '@mui/material';
import { uniqBy } from 'lodash-es';
import { InfoIcon, CheckCircleIcon, CancelIcon, ErrorIcon } from '../icons';
import './style.less';

type SeverityType = 'info' | 'success' | 'warning' | 'error';

interface Toast {
    key: ApiKey;
    duration: number | null;
    severity: SeverityType;
    content: React.ReactNode;
    // onClose?: (event: React.SyntheticEvent) => void;
}

type Params = string | PartialOptional<Omit<Toast, 'severity'>, 'key' | 'duration'>;

const iconMap: Record<SeverityType, React.ReactNode> = {
    info: <InfoIcon />,
    success: <CheckCircleIcon />,
    warning: <ErrorIcon />,
    error: <CancelIcon />,
};

/**
 * 全局消息提示框
 */
class ToastManager {
    private toasts: Toast[] = [];
    private root: Root | null = null;
    private container: HTMLDivElement;

    constructor() {
        this.container = document.createElement('div');
        this.root = createRoot(this.container);
        document.body.appendChild(this.container);
    }

    private renderToasts() {
        this.root?.render(
            <>
                {this.toasts.map(toast => (
                    <Snackbar
                        open
                        disableWindowBlurListener
                        className="ms-toast-container"
                        key={toast.key}
                        autoHideDuration={toast.duration}
                        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                        ClickAwayListenerProps={{
                            onClickAway: () => false,
                        }}
                        onClose={() => this.removeToast(toast.key)}
                    >
                        <div className={`ms-toast ${toast.severity}`}>
                            <div className="ms-toast-icon">{iconMap[toast.severity]}</div>
                            <div className="ms-toast-content">{toast.content}</div>
                        </div>
                    </Snackbar>
                ))}
            </>,
        );
    }

    private addToast({
        duration = 3000,
        key = Date.now(),
        ...props
    }: PartialOptional<Toast, 'key' | 'duration'>) {
        const toast: Toast = { duration, key, ...props };
        this.toasts = uniqBy([...this.toasts, toast], 'key');
        this.renderToasts();
    }

    private removeToast(key: ApiKey) {
        this.toasts = this.toasts.filter(toast => toast.key !== key);
        this.renderToasts();
    }

    info(props: Params) {
        const params = typeof props === 'string' ? { content: props } : props;
        this.addToast({ severity: 'info', ...params });
    }

    success(props: Params) {
        const params = typeof props === 'string' ? { content: props } : props;
        this.addToast({ severity: 'success', ...params });
    }

    warning(props: Params) {
        const params = typeof props === 'string' ? { content: props } : props;
        this.addToast({ severity: 'warning', ...params });
    }

    error(props: Params) {
        const params = typeof props === 'string' ? { content: props } : props;
        this.addToast({ severity: 'error', ...params });
    }
}

const toast = new ToastManager();
export default toast;
