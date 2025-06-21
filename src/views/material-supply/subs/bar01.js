import * as echarts from "echarts";
import _ from 'lodash'
import {priceFormat} from '@/utils/common'

const initBar01 = (dom, dataValue) => {
    console.log(dataValue)
    // 绘制左侧面
    const CubeLeft = echarts.graphic.extendShape({
        shape: {
            x: 0,
            y: 0
        },
        buildPath: function (ctx, shape) {
            // 会canvas的应该都能看得懂，shape是从custom传入的
            const xAxisPoint = shape.xAxisPoint
            const c0 = [shape.x, shape.y]
            const c1 = [shape.x - 13, shape.y - 13]
            const c2 = [xAxisPoint[0] - 13, xAxisPoint[1] - 13]
            const c3 = [xAxisPoint[0], xAxisPoint[1]]
            ctx.moveTo(c0[0], c0[1]).lineTo(c1[0], c1[1]).lineTo(c2[0], c2[1]).lineTo(c3[0], c3[1]).closePath()
        }
    })
    // 绘制右侧面
    const CubeRight = echarts.graphic.extendShape({
        shape: {
            x: 0,
            y: 0
        },
        buildPath: function (ctx, shape) {
            const xAxisPoint = shape.xAxisPoint
            const c1 = [shape.x, shape.y]
            const c2 = [xAxisPoint[0], xAxisPoint[1]]
            const c3 = [xAxisPoint[0] + 18, xAxisPoint[1] - 9]
            const c4 = [shape.x + 18, shape.y - 9]
            ctx.moveTo(c1[0], c1[1]).lineTo(c2[0], c2[1]).lineTo(c3[0], c3[1]).lineTo(c4[0], c4[1]).closePath()
        }
    })
    // 绘制顶面
    const CubeTop = echarts.graphic.extendShape({
        shape: {
            x: 0,
            y: 0,
        },
        buildPath: function (ctx, shape) {
            const c1 = [shape.x, shape.y]
            const c2 = [shape.x + 18, shape.y - 9]
            const c3 = [shape.x + 5, shape.y - 22]
            const c4 = [shape.x - 13, shape.y - 13]
            ctx.moveTo(c1[0], c1[1]).lineTo(c2[0], c2[1]).lineTo(c3[0], c3[1]).lineTo(c4[0], c4[1]).closePath()
        }
    })
    // 注册三个面图形
    echarts.graphic.registerShape('CubeLeft', CubeLeft)
    echarts.graphic.registerShape('CubeRight', CubeRight)
    echarts.graphic.registerShape('CubeTop', CubeTop)

    let keyframeAnimation = function (api, location, delay) {
        return [{
            // 呼吸效果的缩放动画
            duration: 900,
            loop: false,
            delay: delay || 0,
            easing: function (k) {
                return k * k * k * k;
            },
            keyframes: [{
                percent: 0,
                shape: {
                    api,
                    xValue: api.value(0),
                    yValue: 0,
                    x: location[0],
                    y: api.coord([api.value(0), 0])[1],
                    xAxisPoint: api.coord([api.value(0), 0])
                },
            }, {
                percent: 1,
                shape: {
                    api,
                    xValue: api.value(0),
                    yValue: api.value(1),
                    x: location[0],
                    y: location[1],
                    xAxisPoint: api.coord([api.value(0), 0])
                },
            }],
        }]
    }

    // const VALUE = [1110.9, 260.8, 204.2, 504.9, 119.0]
    const VALUE = dataValue.map(item => parseFloat(priceFormat(item.value)))
    const max = _.maxBy(VALUE)
    const MAX = dataValue.map(item => max)
    let option = {
        tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.63)', //设置背景颜色
            textStyle: {
                color: '#fff'
            },
            borderColor: "rgba(255,255,255, .5)",
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            formatter: function (params, ticket, callback) {
                const item = params[1]
                return item.name + ' : ' + item.value;
            }
        },
        grid: {
            left: '0',
            right: '0',
            bottom: '15%',
            top: '20%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            // data: ['农产品', '林产品', '牧产品', '渔产品', '能源产品'],
            data: dataValue.map(item => item.name),
            axisLine: {
                show: true,
                lineStyle: {
                    color: '#445264'
                }
            },
            offset: 5,
            axisTick: {
                show: false,
                length: 9,
                alignWithLabel: true,
                lineStyle: {
                    color: '#445264'
                }
            },
            axisLabel: {
                show: true,
                fontSize: 16,
                color: '#BBC8E1'
            },
        },
        yAxis: {
            min: 0,
            max: max,
            // interval: 200,
            type: 'value',
            axisLine: {
                show: false,
                lineStyle: {
                    color: 'white'
                }
            },
            splitLine: {
                show: false,
                lineStyle: {
                    type: "dashed",
                    color: "rgba(255,255,255,0.1)"
                },
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                show: false,
                fontSize: 16,
            },
        },
        series: [
            {
                type: 'custom',
                renderItem: function (params, api) {
                    const location = api.coord([api.value(0), api.value(1)])
                    return {
                        type: 'group',
                        children: [{
                            type: 'CubeLeft',
                            shape: {
                                api,
                                x: location[0],
                                y: location[1],
                                xAxisPoint: api.coord([api.value(0), 0])
                            },
                            keyframeAnimation: keyframeAnimation(api, location),
                            style: {
                                fill: '#1C317C'
                            },
                        }, {
                            type: 'CubeRight',
                            shape: {
                                api,
                                x: location[0],
                                y: location[1],
                                xAxisPoint: api.coord([api.value(0), 0])
                            },
                            keyframeAnimation: keyframeAnimation(api, location),
                            style: {
                                fill: '#1C317C'
                            }
                        }, {
                            type: 'CubeTop',
                            shape: {
                                api,
                                x: location[0],
                                y: location[1],
                                xAxisPoint: api.coord([api.value(0), 0])
                            },
                            keyframeAnimation: keyframeAnimation(api, location),
                            style: {
                                fill: '#1C317C'
                            }
                        }]
                    }
                },
                data: MAX
            }, {
                type: 'custom',
                renderItem: (params, api) => {
                    const location = api.coord([api.value(0), api.value(1)])
                    console.log(api, api.value(0), api.value(1))
                    return {
                        type: 'group',
                        children: [{
                            type: 'CubeLeft',
                            shape: {
                                api,
                                xValue: api.value(0),
                                yValue: api.value(1),
                                x: location[0],
                                y: location[1],
                                xAxisPoint: api.coord([api.value(0), 0])
                            },
                            keyframeAnimation: keyframeAnimation(api, location, 150),
                            style: {
                                fill: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: '#28B4F0'
                                },
                                    {
                                        offset: 0.8,
                                        color: '#305DBA'
                                    }
                                ])
                            }
                        }, {
                            type: 'CubeRight',
                            shape: {
                                api,
                                xValue: api.value(0),
                                yValue: api.value(1),
                                x: location[0],
                                y: location[1],
                                xAxisPoint: api.coord([api.value(0), 0])
                            },
                            keyframeAnimation: keyframeAnimation(api, location, 150),
                            style: {
                                fill: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: '#39C4FF'
                                },
                                    {
                                        offset: 0.8,
                                        color: '#2866E5'
                                    }
                                ])
                            }
                        }, {
                            type: 'CubeTop',
                            shape: {
                                api,
                                xValue: api.value(0),
                                yValue: api.value(1),
                                x: location[0],
                                y: location[1],
                                xAxisPoint: api.coord([api.value(0), 0])
                            },
                            keyframeAnimation: keyframeAnimation(api, location, 150),
                            style: {
                                fill: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: '#2BCAF6'
                                },
                                    {
                                        offset: 1,
                                        color: '#2BCAF6'
                                    }
                                ])
                            }
                        }]
                    }
                },
                data: VALUE
            }, {
                type: 'bar',
                itemStyle: {
                    color: 'transparent',
                },
                label: {
                    show: true,
                    position: 'top',
                    color: '#00D7E5',
                    fontSize: 16,
                    fontWeight: 'bold',
                    fontFamily: 'DINAlternate-Bold, DINAlternate',
                    distance: 25,
                },
                tooltip: {},
                data: VALUE
            }]
    }
    var chartDom = document.getElementById(dom);
    if(!chartDom) return option
    var myChart = echarts.init(chartDom);
    option && myChart.setOption(option);
    window.addEventListener("resize", () => {
        myChart.resize();
    })
}

export default initBar01