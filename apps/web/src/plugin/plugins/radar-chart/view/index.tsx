import { useEffect } from 'react';
import Chart from 'chart.js/auto'; // 引入 Chart.js

interface IProps {
    config: any;
}
const View = (props: IProps) => {
    const { config } = props;

    useEffect(() => {
        const ctx = document.getElementById('radarChart') as HTMLCanvasElement;
        const chart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: [
                    'Eating',
                    'Drinking',
                    'Sleeping',
                    'Designing',
                    'Coding',
                    'Cycling',
                    'Running',
                ],
                datasets: [
                    {
                        label: 'My First Dataset',
                        data: [65, 59, 90, 81, 56, 55, 40],
                        fill: true,
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgb(255, 99, 132)',
                        pointBackgroundColor: 'rgb(255, 99, 132)',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: 'rgb(255, 99, 132)',
                    },
                    {
                        label: 'My Second Dataset',
                        data: [28, 48, 40, 19, 96, 27, 100],
                        fill: true,
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgb(54, 162, 235)',
                        pointBackgroundColor: 'rgb(54, 162, 235)',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: 'rgb(54, 162, 235)',
                    },
                ],
            },
            options: {
                elements: {
                    line: {
                        borderWidth: 3,
                    },
                },
            },
        });

        return () => {
            /**
             * 清空图表数据
             */
            chart.destroy();
        };
    }, []);

    return (
        <div>
            <h2>{config.title}</h2>
            <canvas id="radarChart" />
        </div>
    );
};

export default View;
