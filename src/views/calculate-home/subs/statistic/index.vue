<template>
    <div class="statistic">
        <el-form class="statistic-form" inline>
            <el-form-item label="应用类型">
                <el-select placeholder="应用类型" v-model="type" suffix-icon="CaretBottom"
                           @change="search" clearable>
                    <el-option v-for="(item, index) in typeOptions" :key="index" :value="item.value" :label="item.label"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-select placeholder="请选择" v-model="year" suffix-icon="CaretBottom"
                           @change="search">
                    <el-option v-for="(item, index) in options" :key="index" :value="item" :label="item"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div class="statistic-main">
            <div class="statistic-main__item">
                <div class="item-label">项目数量</div>
                <div class="item-value">{{priceFormat(totalCount)}}</div>
            </div>
            <div class="statistic-main__item">
                <div class="item-label">价值总量</div>
                <div class="item-value">{{priceFormat(totalValue)}}</div>
            </div>
            <div class="statistic-main__item">
                <div class="item-label">已转化项目</div>
                <div class="item-value">{{priceFormat(convertedCount)}}</div>
            </div>
        </div>
        <div class="statistic-chart">
            <div class="statistic-chart__bar">
                <div v-show="statisticData.length > 0" id="statisticEchartsBar"></div>
                <empty v-show="statisticData.length <= 0"></empty>
            </div>
        </div>
    </div>
</template>

<script>
import * as echarts from 'echarts';
import {fontSize} from "@/utils/common";
import {priceFormat} from '@/utils/common'
import empty from '../../../../components/empty'

export const TOOLTIP_STYLE = {
    backgroundColor: 'rgba(0, 24, 62, 0.6)',
    borderWidth: 0,
    extraCssText: 'box-shadow: 0px 0px 14px 0px rgba(63, 129, 255, 0.8);color: #fff',
    textStyle: {
        color: '#fff',
        fontSize: fontSize(0.14),
    },
    axisPointer: {
        type: 'shadow'
    }
};

export default {
    components: {
        empty
    },
    props: {
        statisticData: {
            default: () => ([])
        },
        typeOptions: {
            default: () => ([])
        }
    },
    data() {
        return {
            year: 2023,
            options: [],
            priceFormat,
            chart: null,
            type: ''
        }
    },
    computed: {
        totalCount () {
            return this.statisticData.reduce((prev, cur, index, arr) => {
                return prev + parseFloat(cur.totalCount)
            }, 0)
        },
        totalValue () {
            return this.statisticData.reduce((prev, cur, index, arr) => {
                return prev + parseFloat(cur.totalValue)
            }, 0)
        },
        convertedCount () {
            return this.statisticData.reduce((prev, cur, index, arr) => {
                return prev + parseFloat(cur.convertedCount)
            }, 0)
        }
    },
    mounted() {
        for (let i = 0; i <= 10; i++) {
            this.options.push(this.year - i)
        }
    },
    methods: {
        search() {
            this.$emit('search', {year: this.year, type: this.type})
        },
        initEcharts() {
            const dataTotalCount = this.statisticData.map(item => item.totalCount);
            const dataTotalValue = this.statisticData.map(item => item.totalValue);
            const dataName = this.statisticData.map(item => item.name);
            if (this.chart) {
                this.chart.dispose()
                this.chart = null
            }
            let option = {
                tooltip: {
                    ...TOOLTIP_STYLE,
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        crossStyle: {
                            color: '#999'
                        }
                    }
                },
                grid: {
                    left: '0',
                    right: '0',
                    bottom: '0',
                    top: '30%',
                    containLabel: true
                },
                legend: {
                    data: [
                        {name: '核算数量', itemStyle: {color: '#00FFFF'}},
                        {name: '项目总量', itemStyle: {color: '#4F89FF'}}
                    ],
                    icon: 'rect',
                    top: '5%',
                    left: 0,
                    itemWidth: fontSize(0.1),
                    itemHeight: fontSize(0.1),
                    padding: 0,
                    textStyle: {
                        color: '#fff',
                        fontSize: fontSize(0.14),
                    },
                },
                xAxis: [
                    {
                        type: 'category',
                        data: dataName,
                        axisPointer: {
                            type: 'shadow'
                        },
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: 'rgba(0, 56, 109, 1)'
                            }
                        },
                        splitLine: {
                            show: false,
                            lineStyle: {
                                type: "dashed",
                                color: "rgba(0, 56, 109, 0.99)"
                            },
                        },
                        axisTick: {
                            show: false
                        },
                        nameTextStyle: {
                            color: '#fff',
                            fontSize: fontSize(0.14),
                            fontFamily: 'PingFangSC, PingFang SC'
                        },
                        axisLabel: {
                            formatter: '{value}',
                            color: '#fff',
                            fontSize: fontSize(0.14),
                            fontFamily: 'PingFangSC, PingFang SC',
                            rotate: 25,
                            align: 'center'
                        },
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: '项目总量',
                        axisLine: {
                            show: false,
                        },
                        splitLine: {
                            show: true,
                            lineStyle: {
                                type: "dashed",
                                color: "rgba(0, 56, 109, 0.99)"
                            },
                        },
                        axisTick: {
                            show: false
                        },
                        nameTextStyle: {
                            color: '#fff',
                            fontSize: fontSize(0.14),
                            fontFamily: 'PingFangSC, PingFang SC',
                            padding: [0, 0, 0, fontSize(-0.3)]
                        },
                        axisLabel: {
                            formatter: '{value}',
                            color: '#fff',
                            fontSize: fontSize(0.14),
                            fontFamily: 'PingFangSC, PingFang SC'
                        },
                    },
                    {
                        type: 'value',
                        name: '核算数量',
                        axisLine: {
                            show: false,
                        },
                        splitLine: {
                            show: true,
                            lineStyle: {
                                type: "dashed",
                                color: "rgba(0, 56, 109, 0.99)"
                            },
                        },
                        axisTick: {
                            show: false
                        },
                        nameTextStyle: {
                            color: '#fff',
                            fontSize: fontSize(0.14),
                            fontFamily: 'PingFangSC, PingFang SC',
                            padding: [0, 0, 0, fontSize(-0.3)]
                        },
                        axisLabel: {
                            formatter: '{value}',
                            color: '#fff',
                            fontSize: fontSize(0.14),
                            fontFamily: 'PingFangSC, PingFang SC'
                        },
                    },
                ],
                series: [
                    {
                        name: '核算数量',
                        type: 'bar',
                        barWidth: fontSize(0.11),
                        yAxisIndex: 1,
                        tooltip: {
                            valueFormatter: function (value) {
                                return value;
                            }
                        },
                        itemStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                {
                                    offset: 0,
                                    color: '#00FFFF',
                                },
                                {
                                    offset: 1,
                                    color: 'rgba(0,255,255,0)',
                                },
                            ]),
                        },
                        // data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
                        data: dataTotalCount
                    },
                    {
                        name: '项目总量',
                        type: 'bar',
                        yAxisIndex: 0,
                        barWidth: fontSize(0.11),
                        tooltip: {
                            valueFormatter: function (value) {
                                return value;
                            }
                        },
                        itemStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                {
                                    offset: 0,
                                    color: '#4F89FF',
                                },
                                {
                                    offset: 1,
                                    color: 'rgba(64,127,255,0)',
                                },
                            ]),
                        },
                        data: dataTotalValue
                        // data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
                    },
                ]
            };
            let dom = document.getElementById('statisticEchartsBar');
            this.chart = echarts.init(dom);
            this.chart.setOption(option)
            window.addEventListener("resize", () => {
                this.chart.resize();
            })
        }
    }
}
</script>

<style lang="less" scoped>
.statistic {
    padding: 10px 20px 12px;

    &-main {
        display: flex;
        align-items: center;
        justify-items: center;
        justify-content: space-between;
        background: rgba(8, 55, 120, 0.76);
        padding: 15px 20px;

        &__item {
            text-align: left;

            .item-label {
                font-size: 14px;
                font-family: Alibaba-PuHuiTi, Alibaba-PuHuiTi;
                font-weight: normal;
                color: #FFFFFF;
                line-height: 28px;
                margin-right: 15px;
            }

            .item-value {
                font-size: 24px;
                font-family: DINAlternate, DINAlternate;
                font-weight: bold;
                color: #4CEAFF;
                line-height: 28px;
            }
        }
    }

    &-chart {
        .statistic-chart__bar {
            width: 100%;
            height: 260px;

            #statisticEchartsBar {
                width: 100%;
                height: 260px;
            }
        }
    }

    .statistic-form {
        display: flex;
        justify-content: space-between;
        align-items: center;
        justify-items: center;

        /deep/.el-form-item {
            margin-bottom: 14px;

            .el-form-item__label {
                font-size: 14px;
                font-family: Alibaba-PuHuiTi, Alibaba-PuHuiTi;
                font-weight: normal;
                color: #fff;
                line-height: 30px;
                text-align: left;
            }

            .el-form-item__content {
                line-height: 30px;
            }
        }

        /deep/ .el-input__inner {
            background-color: transparent;
            border: none;
            border-radius: 0;
            font-size: 16px;
            font-weight: 500;
            color: rgba(82, 192, 255, 1);
            line-height: 30px;
            height: 32px;
            width: 100px;
            background-image: url("../../../../assets/images/common/input-bg.png");
            background-repeat: no-repeat;
            background-position: 0 0;
            background-size: contain;
            padding: 0 10px;

            &::placeholder {
                color: rgba(82, 192, 255, 1);
            }
        }

        /deep/ .el-input__suffix {
            right: 0;
        }

        /deep/ .el-select__caret {
            transform: rotateZ(0deg);
            &.el-input__icon {
                line-height: 32px;

                &.is-reverse {
                    transform: rotateZ(180deg);
                }
            }

            &.el-input__icon::before {
                content: "\e790";
                color: rgba(79, 186, 248, 1);
                position: absolute;
                width: 100%;
                height: 100%;
                top: 50%;
                left: 50%;
                font-size: 12px;
                transform: translate(-50%, -50%);
                //background-image: url("../../../../assets/images/common/input-arrow.png");
                //background-repeat: no-repeat;
                //background-size: 9px 5px;
                //background-position: 0 center;
            }
        }
    }
}
</style>