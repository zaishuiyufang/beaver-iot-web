import { useState } from 'react';
import RemainChart from './components/remain-chart';

interface Props {
    config: any;
}
const View = (props: Props) => {
    const { config } = props;
    const [percent, setPercent] = useState(50);

    return (
        <div>
            <h2>{config.title}</h2>
            <div>{`${percent}%`}</div>
            <div style={{ width: 215, height: 42 }}>
                <RemainChart
                    value={50}
                    onChange={percent => {
                        setPercent(percent);
                    }}
                />
            </div>
        </div>
    );
};

export default View;
