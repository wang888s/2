<template>
  <div class="adjust-total-amount-services">
    <div class="adjust-total-amount-services__total total">
      <div class="total-img"><img src="./images/tjfw.png" alt=""></div>
      <div class="total-text">调节服务总量</div>
      <div class="total-number">
        <count-up v-if="total" :count-up-number="total"></count-up>
        <span>亿元</span></div>
    </div>
    <div class="adjust-total-amount-services__echarts">
      <div class="bar">
        <div class="bar-progress">
          <template v-for="(item, index) in dataList">
            <el-tooltip class="item" effect="dark" :content="`${item.name}(${item.value})`" placement="top">
              <div class="bar-progress-item" :key="index">
                <div class="bar-progress-item__block" v-for="(block, blockIndex) in item.block" :key="blockIndex">
                  <span v-if="blockIndex === (item.block - 1)">{{ item.value ? item.value.toFixed(2) : '' }}</span>
                </div>
              </div>
            </el-tooltip>
          </template>
        </div>
        <div class="bar-baseline">
          <div class="bar-baseline-number">0</div>
          <div class="bar-baseline-line">0</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import {fontSize} from "../../../../utils/common";
import _ from 'lodash'
import CountUp from '../count-up'

export default {
  components: {
    CountUp
  },
  props: {
    dataList: {
      type: Array,
      default: () => ([])
    },
    total: 0
  },
  data() {
    return {
      // listData: [
      //     {value: 10, name: '18岁以下'},
      //     {value: 8, name: '25-34岁'},
      //     {value: 2, name: '35-44岁'},
      //     {value: 103, name: '45-54岁'},
      //     {value: 22, name: '55-64岁'},
      //     {value: 22, name: '65岁以上'},
      // ],
      max: 0
    }
  },
  methods: {
    render() {
      this.$nextTick(() => {
        console.log(this.dataList, '============>')
        this.max = _.maxBy(this.dataList, 'value').value
        this.dataList.forEach(item => {
          let block = Math.floor((item.value / this.max) * 10)
          if(block <= 0 && item.value > 0) {
            block = 1
          }
          this.$set(item, 'block', block)
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.adjust-total-amount-services {
  padding-left: 60px;

  &__total {
    display: flex;
    align-items: baseline;

    &.total {
      margin-bottom: 20px;
      padding-top: 30px;
      position: relative;
      padding-left: 180px;

      .total-img {
        margin-right: 20px;
        width: 95px;
        height: 94px;
        position: absolute;
        left: 60px;
        top: -15px;

        img {
          width: inherit;
          height: inherit;
        }
      }

      .total-text {
        font-family: Source Han Sans CN;
        font-weight: 500;
        font-size: 18px;
        color: #FFFFFF;
      }

      .total-number {
        font-family: YouSheBiaoTiHei;
        font-weight: 400;
        font-size: 42px;
        color: rgba(230, 242, 255, 0.86);
        text-shadow: 0px -6px 11px rgba(32, 100, 255, 0.18), 0px 2px 1px rgba(0, 3, 4, 0.45);
        font-style: italic;
        margin: 0 0 0 18px;
        display: flex;
        align-items: baseline;

        span {
          font-family: Source Han Sans CN;
          font-weight: 400;
          font-size: 16px;
          color: #FFFFFF;
          opacity: 0.6;
          margin-left: 6px;
        }
      }
    }
  }

  &__echarts {
    .bar {
      position: relative;
      height: 120px;

      .bar-progress {
        display: flex;
        padding-left: 40px;

        .bar-progress-item {
          background: url("./images/zbj.png") no-repeat 0 0;
          background-size: cover;
          width: 56px;
          height: 127px;
          margin-right: 25px;
          display: flex;
          flex-direction: column-reverse;

          &:last-child {
            margin-right: 0;
          }

          .bar-progress-item__block {
            height: 7px;
            width: 24px;
            margin: 0 auto 4px;
            background: linear-gradient(90deg, rgba(129, 194, 255, 0.9), #E5F2FF);
            position: relative;

            span {
              font-family: DIN;
              font-weight: 500;
              font-size: 18px;
              color: #FFFFFF;
              position: absolute;
              top: -25px;
              left: 50%;
              transform: translateX(-50%);
            }

            &:first-child {
              margin-bottom: 2px;
            }
          }
        }
      }

      .bar-baseline {
        position: absolute;
        left: 0;
        top: 120px;
        display: flex;
        justify-items: center;
        align-items: center;

        .bar-baseline-line {
          width: 490px;
          height: 1px;
          background: #576B8B;
          margin-left: 20px;
        }

        .bar-baseline-number {
          font-family: Source Han Sans CN;
          font-weight: 400;
          font-size: 14px;
          color: #FFFFFF;
        }
      }
    }
  }
}
</style>