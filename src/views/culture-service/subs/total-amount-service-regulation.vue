<template>
  <div class="total-material-supply">
    <div class="total-material-supply__echarts">
      <div class="total-material-supply__echarts__title title">
        <div class="title-main">{{ total }}<span>亿元</span></div>
        <div class="title-sub">文化服务总量</div>
      </div>
      <div id="TotalMaterialSupplyEcharts"></div>
    </div>
    <div class="total-material-supply__legend">
      <div class="total-material-supply__legend__item" v-for="(item, index) in dataList" :key="index">
        <div class="item">
          <div class="item-rect" :style="`--legend-color: ${colorList[index]}`"></div>
          <div class="item-label">{{ item.name }}</div>
          <div class="item-percent">{{ getPercent(item) }}%</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import {fontSize} from "../../../utils/common";

export default {
  props: {
    dataList: {
      type: Array,
      default: () => ([])
    },
    total: {
      type: Number, String,
      default: 0

    }
  },
  data() {
    return {
      colorList: [
        '#11A8FF',
        '#03D287',
        '#F2E439',
        '#EB8C39',
        'rgba(247, 87, 87, 1)',
        'rgba(25, 209, 249, 1)',
        'rgba(255, 253, 105, 1)',
        'rgba(8, 134, 249, 1)',
        'rgba(223, 52, 255, 1)',
        'rgba(255, 52, 52, 1)',
        'rgba(25, 206, 255, 1)',
      ],
      colorLinearGradientList: [
        ['#019DFF', '#42C7FF'],
        ['#05BF67', '#00F3C2'],
        ['#EBDD58', '#FEEF05'],
        ['#E88331', '#FCBB5F'],
        ['rgba(247, 87, 87, 1)'],
        ['rgba(25, 209, 249, 1)'],
        ['rgba(255, 253, 105, 1)'],
        ['rgba(8, 134, 249, 1)'],
        ['rgba(223, 52, 255, 1)'],
        ['rgba(255, 52, 52, 1)'],
        ['rgba(25, 206, 255, 1)'],
      ],
      legendList: [
        {
          label: '旅游休憩',
          value: 10
        },
        {
          label: '健康康养',
          value: 20
        },
        {
          label: '特产外销',
          value: 30
        },
        {
          label: '支柱产业',
          value: 10
        },
      ]
    }
  },
  methods: {
    getPercent(item) {
      return (this.total === 0 || item.value === 0 || !item.value) ? 0 : ((item.value / this.total) * 100).toFixed(2)
    },
    render() {
      this.$nextTick(() => {
        this.initPie('TotalMaterialSupplyEcharts')
      })
    },
    initPie(dom) {
      let obj = {
        // title: '调节服务\n总数',
        data: [
          {
            value: 80,
            name: '固碳',
            itemStyle: {
              color: 'rgba(236, 81, 92, 1)'
            },
          },
          {
            value: 20,
            name: '释氧',
            itemStyle: {
              color: 'rgba(121, 90, 234, 1)'
            }
          },
          {
            value: 40,
            name: '土壤保持',
            itemStyle: {
              color: 'rgba(15, 181, 242, 1)'
            }
          },
          {
            value: 20,
            name: '水源涵养',
            itemStyle: {
              color: 'rgba(76, 212, 168, 1)'
            }
          },
          {
            value: 60,
            name: '洪水调蓄',
            itemStyle: {
              color: 'rgba(250, 183, 37, 1)'
            }
          },
          {
            value: 76,
            name: '气候调节',
            itemStyle: {
              color: 'rgba(255, 210, 0, 1)'
            }
          },
          {
            value: 80,
            name: '空气净化',
            itemStyle: {
              color: 'rgba(90, 104, 234, 1)'
            }
          },
          {
            value: 28,
            name: '水质净化',
            itemStyle: {
              color: 'rgba(15, 242, 229, 1)'
            }
          },
        ]
      }
      const data = this.dataList.map((item, index) => ({
        ...item,
        name: item.name,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
            offset: 0,
            color: this.colorLinearGradientList[index][0]
          }, {
            offset: 1,
            color: this.colorLinearGradientList[index][1] ? this.colorLinearGradientList[index][1] : this.colorLinearGradientList[index][0]
          }]),
        }
      }))
      let option = {
        title: {
          text: obj.title,
          left: '49.5%',
          top: '40%',
          textAlign: 'center',
          textStyle: {
            fontSize: fontSize(0.18),
            fontFamily: 'Source Han Sans CN',
            fontWeight: 500,
            color: '#fff',
            textAlign: 'center',
            lineHeight: fontSize(0.29),
          },
        },
        tooltip: [{
          trigger: 'item',
          show: true,
          formatter: (params) => {
            return `${params.marker}${params.name}  ${params.data.value}`
          },
        }],
        legend: {
          show: false,
          icon: 'rect',
          left: 20,
          bottom: 12,
          itemWidth: 10,
          itemHeight: 10,
          padding: 0,
          textStyle: {
            color: '#fff',
            fontSize: fontSize(0.14),
            fontFamily: 'Source Han Sans CN',
            fontWeight: 400,
            padding: [0, 0, 0, 10],
          },
          data: data.map(item => item.name),
        },
        series: [
          {
            name: '',
            type: 'pie',
            roseType: 'radius',
            selectedOffset: 20,
            radius: ['60%', '80%'],
            center: ['50%', '50%'],
            emphasis: {
              scaleSize: 0
            },
            itemStyle: {
              borderRadius: 0
            },
            label: {
              show: true,
              position: 'outside',
              width: 100,
              overflow: 'truncate',
              formatter: (params) => {
                // '{a|{b}}\n{b|{c}}\n{hr|}'
                // return `{a|${params.name}}\n{b|${params.data.value2 || params.value}}`
                return `{b|${params.percent}%}`
              },
              rich: {
                b: {
                  fontSize: fontSize(0.16),
                  fontFamily: 'Source Han Sans CN',
                  fontWeight: 400,
                  color: 'rgba(190, 228, 248, 1)',
                  padding: [-20, -50, 0, -50]
                }
              }
            },
            labelLine: {
              show: true,
              length: 8,
              length2: 50,
              lineStyle: {
                width: 1,
                color: 'rgba(190, 228, 248, 1)'
              },
            },
            data: [...data]
          }
        ]
      };

      const chartDom = document.getElementById(dom);
      const chart = echarts.init(chartDom);
      option && chart.setOption(option);
      window.addEventListener("resize", () => {
        chart.resize();
      });
    }
  }
}
</script>

<style lang="less" scoped>
.total-material-supply {

  &__legend {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    margin-left: 28px;

    &__item {
      min-width: 30%;
      margin-right: 3%;

      &:last-child {
        .item {
          margin-bottom: 0;
        }
      }

      .item {
        display: flex;
        justify-items: center;
        align-items: center;
        font-family: PingFang SC;
        margin-bottom: 22px;

        &-label {
          font-weight: 400;
          font-size: 18px;
          color: #FFFFFF;
          padding: 0 20px 0 10px;
        }

        &-percent {
          font-family: DIN;
          font-weight: 500;
          font-size: 18px;
          color: #FFFFFF;
        }

        &-rect {
          width: 14px;
          height: 14px;
          background-color: var(--legend-color);
          position: relative;
          border-radius: 2px;
          box-shadow: 0 0 7px rgba(255, 255, 255, 0.8) inset;
          transform: skewX(-30deg);
        }
      }
    }
  }

  &__echarts {
    box-sizing: border-box;
    position: relative;
    background: url("../../../assets/images/common/pie-bg-2.png") no-repeat center center;
    background-size: 286px 286px;
    margin-bottom: 20px;

    .title {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);

      &-main {
        font-family: DIN;
        font-weight: bold;
        font-size: 28px;
        color: #FFFFFF;
        background: linear-gradient(0deg, #FFFFFF 0%, #01BEFC 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;

        span {
          font-size: 15px;
        }
      }

      &-sub {
        font-family: PingFang SC;
        font-weight: 400;
        font-size: 15px;
        color: #FFFFFF;
        margin-top: 18px;
      }
    }

    #TotalMaterialSupplyEcharts {
      height: 326px;
      margin: 0 auto;
    }
  }
}
</style>