<template>
  <div class="total-material-supply">
    <div class="total-material-supply__echarts">
      <div class="total-material-supply__echarts__title title">
        <div class="title-main">{{ total }}<span>亿元</span></div>
        <div class="title-sub">物质供给总量</div>
      </div>
      <div id="TotalMaterialSupplyEcharts"></div>
    </div>
    <div class="total-material-supply__legend">
      <div class="total-material-supply__legend__item" v-for="(item, index) in dataList" :key="index">
        <div class="item">
          <div class="item-circle" :style="`--legend-color: ${colorList[index]}`"></div>
          <div class="item-label">{{ item.name }}</div>
          <div class="item-percent" :style="`--legend-color: ${colorList[index]}`">{{ getPercent(item) }}%</div>
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
      // legendList: [
      //     {
      //         label: '农产品',
      //         value: 10
      //     },
      //     {
      //         label: '牧产品',
      //         value: 10
      //     },
      //     {
      //         label: '林产品',
      //         value: 10
      //     },
      //     {
      //         label: '渔产品',
      //         value: 10
      //     }
      // ]
    }
  },
  methods: {
    render() {
      this.$nextTick(() => {
        this.initPie('TotalMaterialSupplyEcharts')
      })
    },
    getPercent(item) {
      return (this.total === 0 || item.value === 0 || !item.value) ? 0 : ((item.value / this.total) * 100).toFixed(2)
    },
    initPie(dom) {
      const data = this.dataList.map((item, index) => ({
        name: item.name,
        value: item.value,
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
        tooltip: {
          backgroundColor: 'rgba(0, 24, 62, 0.6)',
          borderWidth: 0,
          extraCssText: 'box-shadow: 0px 0px 14px 0px rgba(63, 129, 255, 0.8); color: #fff',
          textStyle: {
            color: '#fff',
            fontSize: fontSize(0.14),
          },
          axisPointer: {
            type: 'shadow'
          },
          trigger: 'item'
        },
        legend: {
          show: false,
          type: window.innerWidth < 1440 ? 'scroll' : 'plain',
          orient: 'vertical',
          icon: 'rect',
          top: 40,
          right: 0,
          itemWidth: 8,
          itemHeight: 8,
          itemGap: 18,
          pageIconSize: 8,
          pageIconColor: 'rgba(191, 209, 251, 1)',
          pageTextStyle: {
            color: 'rgba(191, 209, 251, 1)'
          },
          textStyle: {
            rich: {
              a: {
                color: 'rgba(191, 209, 251, 1)',
                align: 'center',
                fontSize: fontSize(0.14)
              },
              b: {
                color: 'rgba(191, 209, 251, 1)',
                align: 'center',
                fontSize: fontSize(0.14),
              },
            },
          },
          formatter: function (name) {
            let filterData = data.filter(item => item.name === name);
            return "{a|" + name + "}  " + "{b|" + filterData[0].value + "}";
          },
          data: data.map(item => item.name),
        },
        color: [...this.colorList],
        series: [
          {
            type: 'pie',
            padAngle: 2,
            radius: ['60%', '80%'],
            center: ['50%', '50%'], //性设置图的上下左右的位置
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            itemStyle: {
              borderRadius: 0,
              shadowBlur: 0,
              shadowColor: 'rgba(255,255,255,0.8)',
              shadowOffsetX: -1,
              shadowOffsetY: 0,

            },
            emphasis: {
              label: {
                rich: {
                  a: {
                    color: '#fff',
                    align: 'center',
                    fontSize: fontSize(0.20),
                    fontWeight: "bold",
                    padding: [0, 0, 5, 0]
                  },
                  b: {
                    color: '#BAE6FF',
                    align: 'center',
                    fontSize: fontSize(0.14)
                  }
                },
                formatter: '{b} : {d}%', //带当前图例名 + 百分比
                textStyle: {
                  // 牵引线上的文字的样式
                  color: '#fff',
                  align: 'center',
                  fontSize: fontSize(0.20),
                  fontWeight: "bold",
                  padding: [0, 0, 5, 0]
                },
                show: false,
              }
            },

            labelLine: {
              show: false
            },
            data: [
              ...data
            ]
          },
        ]
      }
      const chartDom = document.getElementById(dom);
      const myChart = echarts.init(chartDom);
      option && myChart.setOption(option);
      window.addEventListener("resize", () => {
        myChart.resize();
      })
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
    margin: 0 80px 0 120px;

    &__item {
      min-width: 45%;

      &:last-child {
        .item {
          margin-bottom: 0;
        }
      }

      .item {
        display: flex;
        justify-items: center;
        align-items: center;
        justify-content: center;
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
          color: var(--legend-color);
        }

        &-circle {
          width: 3px;
          height: 3px;
          background-color: var(--legend-color);
          /*background: #11A8FF*/;
          border-radius: 50%;
          position: relative;

          &:before {
            content: "";
            width: 8px;
            height: 8px;
            border-radius: 50%;
            /*border: 1px solid #11A8FF*/;
            border: 1px solid var(--legend-color);
            position: absolute;
            top: -4px;
            left: -4px;
            opacity: 0.6;
          }

          &:after {
            content: "";
            width: 16px;
            height: 16px;
            border-radius: 50%;
            /*border: 1px solid #11A8FF*/;
            border: 1px solid var(--legend-color);
            position: absolute;
            top: -8px;
            left: -8px;
            opacity: 0.2;
          }
        }
      }
    }
  }

  &__echarts {
    box-sizing: border-box;
    position: relative;
    background: url("../../../assets/images/common/pie-bg-3.png") no-repeat center center;
    background-size: 258px 259px;
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
      width: 286px;
      height: 286px;
      margin: 0 auto;
    }
  }
}
</style>