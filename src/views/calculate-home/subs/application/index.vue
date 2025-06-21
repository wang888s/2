<template>
    <div class="application">
        <div class="application-list" v-for="(item, index) in list" :key="index" @click="goPage(item)">
            <div class="application-list__name">{{ item.name }}</div>
            <div class="application-list__label">总量</div>
            <div class="application-list__value">{{ priceFormat(item.value) }}</div>
            <div class="application-list__echarts" :id="`echartsApplication${index+1}`"></div>
        </div>
    </div>
</template>

<script>
import {priceFormat, fontSize} from '@/utils/common'
import * as echarts from 'echarts'

export default {
    props: {
        list: {
            type: Array,
            default: () => ([])
        }
    },
    data() {
        return {
            priceFormat
        }
    },
    watch: {
        list (val) {
            this.$nextTick(() => {
                for(let i = 0; i < this.list.length; i++) {
                    this.initEchartsPie(this.list[i], i);
                }
            })
        }
    },
    methods: {
        goPage(item) {
            if(item.path) {
                this.$router.push({
                    path: item.path
                })
            }
        },
        initEchartsPie(item, index) {
            const value = item.percent
            const option = {
                title: {
                    text: '{a|' + value + '}{c|%}',
                    x: 'center',
                    y: 'center',
                    textStyle: {
                        rich: {
                            a: {
                                fontSize: fontSize(0.20),
                                color: '#ffffff',
                                fontWeight: 'bold'
                            },
                            c: {
                                fontSize: fontSize(0.14),
                                color: '#ffffff',
                                fontWeight: 'normal'
                            }
                        }
                    }
                },
                series: [
                    //外环
                    {
                        name: '',
                        type: 'pie',
                        radius: ['90%', '100%'],
                        silent: true,
                        clockwise: true,
                        startAngle: 90,
                        label: {
                            show: false,
                        },
                        data: [
                            {
                                value: value,
                                itemStyle: {
                                    //外环发光
                                    borderWidth: 0,
                                    borderColor: '#4bf3f9',
                                    color: { // 圆环的颜色
                                        colorStops: [{
                                            offset: 0,
                                            color: 'rgba(0, 100, 255, 0.45)', // 0% 处的颜色
                                        }, {
                                            offset: 1,
                                            color: 'rgba(60, 211, 255, 1)', // 100% 处的颜色
                                        }]
                                    },
                                }
                            },
                            {
                                value: 100 - value,
                                label: {
                                    show: false
                                },
                                itemStyle: {
                                    color: "rgba(43, 60, 101, 1)"
                                }
                            }
                        ]
                    },
                ]
            };
            const dom = document.getElementById(`echartsApplication${index+1}`);
            const chart = echarts.init(dom);
            option && chart.setOption(option);
            window.onresize = () => {
                chart.resize()
            }
        }
    }
}
</script>

<style lang="less" scoped>
.application {
    margin-top: 10px;
    padding-left: 14px;
    height: 435px;

    &-list {
        display: flex;
        cursor: pointer;

        &__name {
            font-size: 18px;
            font-family: SourceHanSansCN, SourceHanSansCN;
            font-weight: 500;
            color: #FFFFFF;
            line-height: 27px;
            width: 156px;
            height: 101px;
            background: url("../../../../assets/images/common/application-bg.png") no-repeat 0 0;
            background-size: cover;
            padding-top: 20px;
            box-sizing: border-box;
            margin-right: 15px;
            margin-top: 8px;
        }

        &__label {
            font-size: 18px;
            font-family: SourceHanSansCN, SourceHanSansCN;
            font-weight: 500;
            color: #FFFFFF;
            line-height: 27px;
            position: relative;
            margin-right: 10px;
            z-index: 1;
            margin-top: 28px;

            &:after {
                content: "";
                width: 44px;
                height: 24px;
                background: linear-gradient(270deg, rgba(30, 178, 244, 0) 0%, #0D7AE5 100%);
                position: absolute;
                left: 0;
                top: 0;
                z-index: -1;
            }
        }

        &__value {
            font-size: 24px;
            font-family: DINAlternate, DINAlternate;
            font-weight: bold;
            color: #FFFFFF;
            line-height: 28px;
            margin-top: 26px;
            margin-right: 40px;
        }

        &__echarts {
            width: 76px;
            height: 76px;
        }
    }
}
</style>