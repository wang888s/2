<template>
  <div class="total-material-supply">
    <!-- 环形饼图区域 -->
    <div class="total-material-supply__echarts">
      <!-- 内部数据显示 -->
      <div class="total-material-supply__echarts__title title">
        <div class="title-main">{{ total }}亿元</div>
        <div class="title-sub">调节服务总量</div>
      </div>
      <!-- 外部环形 -->
      <div id="TotalMaterialSupplyEcharts"></div>
    </div>
    <!-- 图例区域 -->
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
import { fontSize } from "../../../utils/common";

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
          label: '固碳',
          value: 10
        },
        {
          label: '土壤保持',
          value: 20
        },
        {
          label: '水源涵养',
          value: 30
        },
        {
          label: '洪水调蓄',
          value: 10
        },
        {
          label: '局部气候调节',
          value: 30
        },
        {
          label: '水质净化',
          value: 10
        },
      ]
    }
  },
  methods: {
    // 计算服务类型占比
    getPercent(item) {
      //如果总值为0、项目值为0或者项目值不存在，返回0，否则计算百分比并保留两位有效数字
      return (this.total === 0 || item.value === 0 || !item.value) ? 0 : ((item.value / this.total) * 100).toFixed(2)
    },
    render() {
      this.$nextTick(() => {
        this.initPie('TotalMaterialSupplyEcharts')
      })
    },
    initPie(dom) {
      const data = this.dataList.map((item, index) => ({
        name: item.name,
        value: item.value,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
            {
              offset: 0,
              color: this.colorLinearGradientList[index][0]
            },
            {
              offset: 1,
              color: this.colorLinearGradientList[index][1] ? this.colorLinearGradientList[index][1] : this.colorLinearGradientList[index][0]
            }
          ]),
        }
      }))
      let option = {
        // 提示框
        tooltip: {
          backgroundColor: 'rgba(0, 24, 62, 0.6)', // 半透明深蓝色背景
          borderWidth: 0,// 无边框
          extraCssText: 'box-shadow: 0px 0px 14px 0px rgba(63, 129, 255, 0.8); color: #fff',// 发光效果
          textStyle: {
            color: '#fff',
            fontSize: fontSize(0.14),// 响应式字体大小
          },
          axisPointer: {
            type: 'shadow'// 阴影指示器
          },
          trigger: 'item'// 数据项触发
        },
        // 图例区域
        legend: {
          show: false,// 隐藏内置图例（使用自定义图例）
          type: window.innerWidth < 1440 ? 'scroll' : 'plain',// 响应式类型
          orient: 'vertical',// 垂直方向
          icon: 'rect',// 矩形图标
          top: 40,// 顶部距离
          right: 0,// 右侧距离
          itemWidth: 8, // 图标宽度
          itemHeight: 8, // 图标高度
          itemGap: 18, // 项间距
          pageIconSize: 8, // 翻页图标大小
          pageIconColor: 'rgba(191, 209, 251, 1)',// 翻页图标颜色
          pageTextStyle: {
            color: 'rgba(191, 209, 251, 1)'// 翻页文字颜色
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
            type: 'pie',// 饼图类型
            padAngle: 2,// 扇形间隔
            radius: ['73%', '81%'],// 环形内外半径
            center: ['50%', '50%'], // 居中位置
            avoidLabelOverlap: false, // 避免标签重叠
            label: {
              show: false,// 隐藏标签
              position: 'center'
            },
            itemStyle: {
              borderRadius: 0,// 无圆角
              shadowBlur: 0, // 无阴影模糊
              shadowColor: 'rgba(255,255,255,0.8)',// 白色阴影
              shadowOffsetX: -1,// X偏移
              shadowOffsetY: 0,// Y偏移

            },
            emphasis: {// 高亮状态
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
      // 给窗口添加监听事件，动态调整尺寸
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
      width: 286px;
      height: 286px;
      margin: 0 auto;
    }
  }
}
</style>