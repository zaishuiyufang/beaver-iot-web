import { useNavigate } from 'react-router-dom';
import { Grid2 } from '@mui/material';
import { Logo, DevicesOtherIcon, ShareIcon } from '@milesight/shared/src/components';
import { thousandSeparate } from '@milesight/shared/src/utils/tools';
import { Tooltip } from '@/components';
import './style.less';

const Integration = () => {
    const navigate = useNavigate();
    const handleCardClick = (id: ApiKey) => navigate(`/setting/integration/${id}`);

    return (
        <Grid2 container spacing={2}>
            <Grid2 size={{ sm: 6, md: 4, xl: 3 }}>
                <div className="ms-int-card" onClick={() => handleCardClick(1)}>
                    <Logo mini className="logo" />
                    <Tooltip
                        autoEllipsis
                        className="title"
                        title="Milesight Development Platform"
                    />
                    <Tooltip
                        autoEllipsis
                        className="desc"
                        title="This is an integrated description information."
                    />
                    <div className="meta">
                        <span className="meta-item">
                            <DevicesOtherIcon />
                            <span>{thousandSeparate(5316)}</span>
                        </span>
                        <span className="meta-item">
                            <ShareIcon />
                            <span>{thousandSeparate(2)}</span>
                        </span>
                    </div>
                </div>
            </Grid2>
            <Grid2 size={{ sm: 6, md: 4, xl: 3 }}>
                <div className="ms-int-card" onClick={() => handleCardClick(2)}>
                    <Logo mini className="logo" />
                    <Tooltip
                        autoEllipsis
                        className="title"
                        title="Milesight Development Platform"
                    />
                    <Tooltip
                        autoEllipsis
                        className="desc"
                        title="This is an integrated description information."
                    />
                    <div className="meta">
                        <span className="meta-item">
                            <DevicesOtherIcon />
                            <span>{thousandSeparate(5316)}</span>
                        </span>
                        <span className="meta-item">
                            <ShareIcon />
                            <span>{thousandSeparate(2)}</span>
                        </span>
                    </div>
                </div>
            </Grid2>
        </Grid2>
    );
};

export default Integration;
