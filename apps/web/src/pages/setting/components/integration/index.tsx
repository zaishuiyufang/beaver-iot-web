import { Stack, Typography } from '@mui/material';
import { DevicesOther as DevicesOtherIcon, Share as ShareIcon } from '@mui/icons-material';
import { Logo } from '@milesight/shared/src/components';
import './style.less';

const Integration = () => {
    return (
        <div className="ms-int-card">
            <Logo mini className="logo" />
            <div className="title">Milesight Development Platform</div>
            <div className="desc">
                This is an integrated description information, This is an integrated description
                information.
            </div>
            <div className="meta">
                <span className="meta-item">
                    <DevicesOtherIcon />
                    <span>3</span>
                </span>
                <span className="meta-item">
                    <ShareIcon />
                    <span>2</span>
                </span>
            </div>
        </div>
    );
};

export default Integration;
