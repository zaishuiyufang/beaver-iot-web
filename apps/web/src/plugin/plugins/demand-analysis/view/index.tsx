import { useEffect } from 'react';
import Chart from 'chart.js/auto'; // 引入 Chart.js
import { RenderView } from '../../../render';
// import { ViewConfigProps } from './typings';

interface Props {
    config: any;
    configJson: CustomComponentProps;
}

const View = (props: Props) => {
    const { config, configJson } = props;

    useEffect(() => {
        // 初始化需求曲线图
        const ctx = document.getElementById('demandChart') as HTMLCanvasElement;
        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: config.labels, // 从配置中获取时间标签
                datasets: [
                    {
                        label: '用户需求量',
                        data: config.data, // 从配置中获取需求数据
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 2,
                        fill: false,
                    },
                ],
            },
            options: {
                responsive: true,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label(tooltipItem) {
                                return `需求量: ${tooltipItem.raw}`;
                            },
                        },
                    },
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: '时间',
                        },
                    },
                    y: {
                        title: {
                            display: true,
                            text: '需求量',
                        },
                    },
                },
            },
        });

        return () => {
            chart.destroy(); // 清理图表
        };
    }, [config]);

    return (
        <div>
            <h2>{config.title}</h2>
            <canvas id="demandChart" />
            <RenderView config={config} configJson={configJson} />
        </div>
    );
};

export default View;
