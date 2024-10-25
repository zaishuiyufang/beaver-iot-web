import { useNavigate } from 'react-router-dom';
import { Grid2, CircularProgress } from '@mui/material';
import { useRequest } from 'ahooks';
import { DevicesOtherIcon, EntityIcon } from '@milesight/shared/src/components';
import { thousandSeparate, objectToCamelCase } from '@milesight/shared/src/utils/tools';
import { integrationAPI, awaitWrap, getResponseData, isRequestSuccess } from '@/services/http';
import { Tooltip } from '@/components';
import './style.less';

const Integration = () => {
    const navigate = useNavigate();
    const handleCardClick = (id: ApiKey) => navigate(`/setting/integration/${id}`);
    const { data: intList, loading } = useRequest(
        async () => {
            const [error, resp] = await awaitWrap(integrationAPI.getList());
            if (error || !isRequestSuccess(resp)) return;
            const data = getResponseData(resp) || [];

            return objectToCamelCase(data);
        },
        {
            debounceWait: 300,
        },
    );

    return (
        <>
            <Grid2 container spacing={2}>
                {/* <Grid2 size={{ sm: 6, md: 4, xl: 3 }}>
                    <div className="ms-int-card" onClick={() => handleCardClick(1)}>
                        <div className="icon">
                            <img
                                src="https://milesight-msc-us-dev-new.s3.amazonaws.com/tool/57e25ebd-0bd0-4cd3-a5dd-e7f849898d0a-1724138852.jpg"
                                alt="integration icon"
                            />
                        </div>
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
                                <EntityIcon />
                                <span>{thousandSeparate(2)}</span>
                            </span>
                        </div>
                    </div>
                </Grid2> */}
                {intList?.map(item => (
                    <Grid2 key={item.id} size={{ sm: 6, md: 4, xl: 3 }}>
                        <div className="ms-int-card" onClick={() => handleCardClick(item.id)}>
                            <div className="icon">
                                {!!item.icon && <img src={item.icon} alt={item.name} />}
                            </div>
                            <Tooltip autoEllipsis className="title" title={item.name} />
                            <Tooltip autoEllipsis className="desc" title={item.description} />
                            <div className="meta">
                                <span className="meta-item">
                                    <DevicesOtherIcon />
                                    <span>{thousandSeparate(item.deviceCount) || '-'}</span>
                                </span>
                                <span className="meta-item">
                                    <EntityIcon />
                                    <span>{thousandSeparate(item.entityCount)}</span>
                                </span>
                            </div>
                        </div>
                    </Grid2>
                ))}
            </Grid2>
            {loading && <CircularProgress />}
        </>
    );
};

export default Integration;
