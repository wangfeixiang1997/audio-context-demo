import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import {
    StrikethroughOutlined,
} from '@ant-design/icons';
import { Button } from 'antd';
import './index.css';

let myChart;
const symbolSize = 20;
const data = [
    [10, 0],
    [50, 0],
    [80, 0],
    [110, 0],
    [140, 0],
    [170, 0],
    [210, 0]
];

const Equalizer = () => {
    const chartRef = useRef(null);

    const initChart = () => {
        myChart = echarts.init(chartRef.current);
        myChart.clear()
        let option;
        option = {
            grid: {
                top: 20,
                bottom: 40,
                right: 20,
                left: 40,
            },
            xAxis: {
                min: 20,
                max: 200,
                type: 'value',
                boundaryGap: false,
                axisLabel: {
                    color: 'rgba(0, 0, 0, 0.2)',
                    fontSize: '12px',
                },
                axisLine: {
                    onZero: false,
                    lineStyle: {
                        color: '#E5E5E5'
                    }
                }
            },
            yAxis: {
                min: -18,
                max: 18,
                type: 'value',
                axisLabel: {
                    color: 'rgba(0, 0, 0, 0.2)',
                    fontSize: '12px',
                },
                axisLine: {
                    onZero: false,
                    lineStyle: {
                        color: '#E5E5E5'
                    }
                },

            },
            series: [
                {
                    id: 'a',
                    type: 'line',
                    smooth: true,
                    symbolSize: 0,
                    data: data,
                    color: '#133060',
                    areaStyle: {
                        color: '#133060',
                        opacity: 0.3
                    },
                }
            ]
        };

        option && myChart.setOption(option);
    }

    const updatePosition = () => {
        myChart.setOption({
            graphic: data.map(function (item, dataIndex) {
                return {
                    position: myChart.convertToPixel('grid', item)
                };
            })
        });
    }
    const showTooltip = (dataIndex) => {
        myChart.dispatchAction({
            type: 'showTip',
            seriesIndex: 0,
            dataIndex: dataIndex
        });
    }
    const hideTooltip = (dataIndex) => {
        myChart.dispatchAction({
            type: 'hideTip'
        });
    }
    const onPointDragging = (dataIndex, pos) => {
        data[dataIndex] = myChart.convertFromPixel('grid', pos);
        // Update data
        myChart.setOption({
            series: [
                {
                    id: 'a',
                    data: data
                }
            ]
        });
    }


    useEffect(() => {
        initChart()

    }, [])

    const handleClickEdit = () => {
        setTimeout(function () {
            // Add shadow circles (which is not visible) to enable drag.
            myChart.setOption({
                graphic: data.map(function (item, dataIndex) {
                    return {
                        type: 'circle',
                        position: myChart.convertToPixel('grid', item),
                        shape: {
                            cx: 0,
                            cy: 0,
                            r: symbolSize / 2
                        },
                        invisible: true,
                        draggable: true,
                        ondrag: function (dx, dy) {
                            onPointDragging(dataIndex, [this.x, this.y]);
                        },
                        onmousemove: function (e) {
                            e = e.event || window.event
                            e.preventDefault()
                            showTooltip(dataIndex);
                        },
                        onmouseout: function () {
                            hideTooltip(dataIndex);
                        },
                        z: 100
                    };
                }),
                series: [
                    {
                        symbolSize: symbolSize,
                    }
                ]
            });
        }, 0);
        myChart.on('dataZoom', updatePosition);
    }

    return (
        <div>
            <div className='equalizer-item-box'>
                <div className='equalizer-item-title'>
                    <span><StrikethroughOutlined /></span>
                    <span>EQ</span>
                </div>
                <div className='equalizer-item-content'>
                    <div ref={chartRef} style={{ width: '736px', margin: '0 auto', height: '344px', backgroundColor: '#f4f4f4' }} id='line-main'></div>
                    <div className='button-box'>
                        <Button type="primary" onClick={() => { handleClickEdit() }}>EDIT</Button>
                        <Button type="primary" style={{ marginLeft: '16px' }}>COPY</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Equalizer
