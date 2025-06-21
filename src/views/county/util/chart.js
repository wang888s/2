import * as echarts from 'echarts'
import {fontSize, TOOLTIP_STYLE, GRID, _cnDic, _divisor} from "@/utils/common";

export const initPie = (el, mockData) => {
    // let mockData = [
    //     {
    //         "value": 13106,
    //         "name": "购物服务"
    //     },
    //     {
    //         "value": 6629,
    //         "name": "餐饮服务"
    //     },
    //     {
    //         "value": 6457,
    //         "name": "交通设施服务"
    //     },
    //     {
    //         "value": 5915,
    //         "name": "通行设施"
    //     },
    //     {
    //         "value": 37698,
    //         "name": "其他服务"
    //     }
    // ]
    const chartDom = document.getElementById(el);
    const myChart = echarts.init(chartDom);
    let colorArr = [
        ['#FFD33B', '#F06B1D'],
        ['#B792F1', '#801ED6'],
        ['#B792F1', '#19BCE3'],
        ['#3D7DFF', '#1947E3'],
        ['#FF433D', '#E36719'],
        ['rgba(195, 71, 118, 1)', 'rgba(195, 71, 118, 1)'],
        ['rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, 1)'],
        ['rgba(251, 215, 98, 1)', 'rgba(251, 215, 98, 1)'],
    ]
    let data = mockData.map((item, index) => {
        item.index = index;
        let colorOption = {
            itemStyle: {
                //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
                color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                    offset: 0,
                    color: colorArr[index][1]
                }, {
                    offset: 1,
                    color: colorArr[index][0]
                }]),
                // shadowOffsetX: 0,
                // shadowOffsetY: 2,
                // shadowBlur: 10,
                // shadowColor: 'rgba(20, 33, 56, 1)'
            },
        }
        return {...item, ...colorOption}
    })
    const option = {
        tooltip: {
            trigger: 'item',
            formatter: '{b}: {c} ({d}%)'
        },
        legend: {
            orient: 'vertical',
            right: '4%',
            top: '4%',
            data: mockData.map(item => item.name),
            textStyle: { //图例文字的样式
                color: '#F6F6F6',
                lineHeight: fontSize(0.16),
                fontSize: fontSize(0.14)
            },
            icon: 'rect',
            itemGap: fontSize(0.1),
            itemWidth: fontSize(0.1),
            itemHeight: fontSize(0.1),
            type: 'scroll',
            pageIconColor: '#fff',
            pageIconSize: fontSize(0.12),
            pageTextStyle: {
                color: '#fff',
                fontSize: fontSize(0.12)
            }
        },
        series: [
            {
                name: '',
                type: 'pie',
                radius: ['35%', '50%'],
                center: ['35%', '50%'],
                labelLine: {
                    length: fontSize(0.15),
                    length2: fontSize(0.1),
                    lineStyle: {
                        width: fontSize(0.01),
                        color: '#fff'
                    }
                },
                label: {
                    formatter: (params) => {
                        // console.log(params)
                        let unit = '%'
                        return `{per|${params.percent}}{f|${unit}}\n{b|${params.name}}`
                    },
                    backgroundColor: 'transparent',
                    // borderColor: '#2EA8D0',
                    // borderWidth: 1,
                    // borderRadius: 4,
                    // padding: [4, 4, 4, 4],
                    // shadowColor: "rgba(143, 239, 252, 0.5)",
                    // shadowBlur: 22,
                    // shadowOffsetX: -2,
                    // shadowOffsetY: -2,
                    rich: {
                        b: {
                            color: '#C3CDE5',
                            fontSize: fontSize(0.14),
                            lineHeight: fontSize(0.18),
                            padding: [0, 0, 0, 0]
                        },
                        per: {
                            color: '#fff',
                            fontSize: fontSize(0.14),
                            fontWeight: 500,
                            lineHeight: fontSize(0.16),
                        },
                        f: {
                            color: '#fff',
                            fontSize: fontSize(0.14),
                            fontWeight: 500,
                            lineHeight: fontSize(0.16),
                        },
                        icon0: {
                            width: 10,
                            height: 10,
                            backgroundColor: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                                offset: 0,
                                color: colorArr[0][1]
                            }, {
                                offset: 1,
                                color: colorArr[0][0]
                            }]),
                            borderRadius: 2,
                            shadowOffsetX: 2,
                            shadowOffsetY: 2,
                            shadowBlur: 10,
                            shadowColor: 'rgba(20, 33, 56, 0.28)',
                        },
                        icon1: {
                            width: 10,
                            height: 10,
                            backgroundColor: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                                offset: 0,
                                color: colorArr[1][1]
                            }, {
                                offset: 1,
                                color: colorArr[1][0]
                            }]),
                            borderRadius: 2,
                            shadowOffsetX: 2,
                            shadowOffsetY: 2,
                            shadowBlur: 10,
                            shadowColor: 'rgba(20, 33, 56, 0.28)',
                        },
                        icon2: {
                            width: 10,
                            height: 10,
                            backgroundColor: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                                offset: 0,
                                color: colorArr[2][1]
                            }, {
                                offset: 1,
                                color: colorArr[2][0]
                            }]),
                            borderRadius: 2,
                            shadowOffsetX: 2,
                            shadowOffsetY: 2,
                            shadowBlur: 10,
                            shadowColor: 'rgba(20, 33, 56, 0.28)',
                        },
                        icon3: {
                            width: 10,
                            height: 10,
                            backgroundColor: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                                offset: 0,
                                color: colorArr[3][1]
                            }, {
                                offset: 1,
                                color: colorArr[3][0]
                            }]),
                            borderRadius: 2,
                            shadowOffsetX: 2,
                            shadowOffsetY: 2,
                            shadowBlur: 10,
                            shadowColor: 'rgba(20, 33, 56, 0.28)',
                        },
                        icon4: {
                            width: 10,
                            height: 10,
                            backgroundColor: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                                offset: 0,
                                color: colorArr[4][1]
                            }, {
                                offset: 1,
                                color: colorArr[4][0]
                            }]),
                            borderRadius: 2,
                            shadowOffsetX: 2,
                            shadowOffsetY: 2,
                            shadowBlur: 10,
                            shadowColor: 'rgba(20, 33, 56, 0.28)',
                        }
                    }
                },
                data: [...data]
            }
        ]
    };

    option && myChart.setOption(option);
    window.addEventListener("resize", () => {
        myChart.resize();
    });
}

export const initBar = (el, mockData) => {
    // const data = [
    //     {year: '2022年', a: 11, b: 22, c: 33, d: 44, e: 55, f: 66},
    //     {year: '2023年', a: 11, b: 22, c: 33, d: 44, e: 55, f: 66},
    //     {year: '2024年', a: 11, b: 22, c: 33, d: 44, e: 55, f: 66}
    // ]
    const data = mockData
    const app = [
        {
            key: 'VEP',
            name: '经营开发总量',
            color: [
                'rgba(186, 255, 255, 1)', // 下半截柱子
                'rgba(0, 255, 255, 1)',
                'rgba(1, 255, 255, 1)',   // 数据圆片
                'rgba(0, 255, 255, 1)'    // 最底下圆片
            ]
        },
        {
            key: 'EP',
            name: '土地出让总量',
            color: [
                'rgba(255, 253, 225, 1)',
                'rgba(255, 240, 0, 1)',
                'rgba(241, 227, 1, 1)',
                'rgba(255, 240, 0, 1)'
            ]
        },
        {
            key: 'GEP',
            name: '土地综合整治总量',
            color: [
                'rgba(199, 177, 251, 1)',
                'rgba(116, 59, 255, 1)',
                'rgba(116, 59, 255, 1)',
                'rgba(116, 59, 255, 1)'
            ]
        },
        // {
        //     key: 'd',
        //     name: '应用D总量',
        //     color: [
        //         'rgba(107, 197, 255, 1)',
        //         'rgba(0, 156, 255, 1)',
        //         'rgba(0, 158, 255, 1)',
        //         'rgba(0, 156, 255, 1)'
        //     ]
        // },
        // {
        //     key: 'e',
        //     name: '应用E总量',
        //     color: [
        //         'rgba(255, 214, 194, 1)',
        //         'rgba(255, 136, 76, 1)',
        //         'rgba(255, 136, 76, 1)',
        //         'rgba(255, 136, 76, 1)'
        //     ]
        // },
        // {
        //     key: 'f',
        //     name: '应用F总量',
        //     color: [
        //         'rgba(175, 255, 217, 1)',
        //         'rgba(23, 251, 142, 1)',
        //         'rgba(23, 251, 142, 1)',
        //         'rgba(23, 251, 142, 1)'
        //     ]
        // },
    ]
    const getOffset = (index) => {
        return ((index + 1) * 11 - (11 * (app.length - 1)) + 3 * (index+1)) + 8
    }
    const initSeriesArr = (app, index) => {
        const appData = data.map(item => item[app.key])
        return [
            // {
            //     // 数据圆片
            //     name: app.name,
            //     type: 'pictorialBar',
            //     symbolSize: [11, 6],
            //     symbolOffset: [getOffset(index), -2],
            //     z: 3,
            //     itemStyle: {
            //         opacity: 1,
            //         color: app.color[2]
            //     },
            //     symbolPosition: 'end',
            //     data: appData,
            //     label: {
            //         show: false,
            //         position: 'left',
            //         distance: -770,
            //         formatter: '{c}%'
            //     }
            // },
            // {
            //     // 最底下圆片
            //     name: '',
            //     type: 'pictorialBar',
            //     symbolSize: [11, 6],
            //     symbolOffset: [getOffset(index), -2],
            //     z: 3,
            //     itemStyle: {
            //         opacity: 1,
            //         color: function (params) {
            //             return app.color[3];
            //         }
            //     },
            //
            //     symbolPosition: 'end',
            //     data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            // },
            {
                // 下半截柱子
                name: app.name,
                type: 'bar',
                barWidth: fontSize(0.11),
                itemStyle: {
                    //lenged文本
                    opacity: 1,
                    color: function (params) {
                        return new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: app.color[0]
                        }, {
                            offset: 1,
                            color: app.color[1]
                        }], false);
                    },
                    // shadowColor: app.color[4],
                    // shadowBlur: 20
                    borderRadius: [5, 5, 5, 5]
                },
                data: appData
            },
        ]
    }
    let seriesMap = app.map((item, index) => {
        return initSeriesArr(item, index)
    })
    let seriesArr = []
    seriesMap.forEach(arr => {
        seriesArr = [...seriesArr, ...arr]
    })
    let option = {
        title: {
            text: ''
        },
        tooltip: {
            ...TOOLTIP_STYLE,
            ...{
                trigger: 'axis',
                formatter: params => {
                    let content = '';
                    params.forEach((item, index) => {
                        if (item.seriesName) {
                            if (index === 0) {
                                content += `<div>${item.name}</div>`;
                            }
                            // if (params.length > 1 && (index === 2 || index === 5) || params.length === 1) {
                                content += `<div>${item.marker}${item.seriesName}<span style="margin-left: 20px;">${item.value || '0'}</span></div>`;
                            // }
                        }
                    });
                    return content;
                }
            }
        },
        legend: [{
            icon: 'rect',
            bottom: 20,
            left: 'center',
            itemWidth: fontSize(0.1),
            itemHeight: fontSize(0.1),
            padding: [0, fontSize(0.5)],
            itemGap: fontSize(0.12),
            textStyle: {
                color: '#fff',
                fontSize: fontSize(0.14),
                padding: [0, 0, 0, fontSize(0.1)],
            },
            data: app.map(item => item.name),
        }],
        grid: {
            ...GRID,
            bottom: fontSize(1.2)
        },
        yAxis: [{
            splitLine: {
                // 分隔线
                show: true,
                // 默认显示，属性show控制显示与否
                lineStyle: {
                    // 属性lineStyle（详见lineStyle）控制线条样式
                    color: 'rgba(92, 128, 206, 0.5)',
                    width: 1,
                    type: 'dashed'
                }
            },
            axisLine: {
                show: false,
                lineStyle: {
                    color: 'rgba(3, 49, 77, 1)'
                }
            },
            axisLabel: {
                formatter(e) {
                    if (_cnDic[option.maxLength]) {
                        if (option.maxLength === 5) {
                            return (e === 0 ? 0 : (e / _divisor[option.maxLength]).toFixed(1)) + _cnDic[option.maxLength];
                        } else {
                            return Math.ceil(e / _divisor[option.maxLength]) + _cnDic[option.maxLength];
                        }
                    } else {
                        return e;
                    }
                },
                show: true,
                color: '#fff',
                fontSize: fontSize(0.14)
            }
        }, {
            splitLine: {
                // 分隔线
                show: true,
                // 默认显示，属性show控制显示与否
                lineStyle: {
                    // 属性lineStyle（详见lineStyle）控制线条样式
                    color: 'rgba(92, 128, 206, 0.5)',
                    width: 2,
                    type: 'dashed'
                }
            },
            axisLine: {
                show: false,
                lineStyle: {
                    color: 'rgba(3, 49, 77, 1)'
                }
            },
            axisLabel: {
                formatter(e) {
                    if (_cnDic[option.maxLength2]) {
                        if (option.maxLength2 === 5) {
                            return (e === 0 ? 0 : (e / _divisor[option.maxLength2]).toFixed(1)) + _cnDic[option.maxLength2];
                        } else {
                            return Math.ceil(e / _divisor[option.maxLength2]) + _cnDic[option.maxLength2];
                        }
                    } else {
                        return e;
                    }
                },
                show: true,
                color: 'rgba(112, 151, 215, 1)',
                fontSize: fontSize(0.22)
            }
        }],
        xAxis: {
            offset: fontSize(0.1),
            axisLabel: {
                show: true,
                color: '#fff',
                fontSize: fontSize(0.14),
                interval: 0
            },
            axisLine: {
                show: false,
                lineStyle: {
                    color: 'rgba(3, 49, 77, 1)'
                }
            },
            data: data.map(item => item.year)
        },
        series: [
            ...seriesArr,
            // {
            //   name: '同比增速（%）',
            //   type: 'line',
            //   yAxisIndex: 1,
            //   smooth: false,
            //   symbolSize: 10,
            //   itemStyle: {
            //     color: 'rgba(251, 255, 3, 1)',
            //   },
            //   data: [10, 6, 7, 20, 10, 20, 20, 20, 10, 15, 18]
            // }
        ]
    };

    const chartDom = document.getElementById(el);
    const myChart = echarts.init(chartDom);
    option && myChart.setOption(option);
    window.addEventListener("resize", () => {
        myChart.resize();
    });
}