<template>
  <div class="progress">
    <div class="progress-unit">单位/亿元</div>
    <div class="progress-area" v-if="dataList && dataList.length > 0">
      <div class="progress-item" :class="`progress-${index+1}`" v-for="(item, index) in dataList" :key="index">
        <div class="progress-item__label">
          {{ item.label }}
          <div class="progress-item__label__num">{{ index + 1 }}</div>
        </div>
        <div class="progress-item__bar">
          <div class="progress-item__bar__progress" :style="{width: `${item.value > 100 ? 100 : item.value}%`}">
            <div class="progress-item__bar__progress__wrap">
              <div class="progress-item__bar__progress__percent" v-show="item.value > 0">{{ item.value }}</div>
            </div>
          </div>
          <div class="progress-item__bar__empty"></div>
        </div>
      </div>
    </div>
    <div class="progress-area" v-else><empty></empty></div>
  </div>
</template>

<script>
import empty from '../../../components/empty'
export default {
  components: {
    empty
  },
  props: {
    type: {
      type: String,
      default: ''
    },
    dataList: {
      type: Array,
      default: () => ([])
    }
  },
  data() {
    return {
      // areaList: []
    }
  },
  mounted() {
    // setInterval(() => {
    //     this.areaList.forEach(item => {
    //         item.value = Math.floor(Math.random() * 100)
    //     })
    // }, 3000)
  }
}
</script>

<style lang="less" scoped>
.progress {
  padding-left: 20px;
  padding-top: 10px;

  &-unit {
    font-family: Alibaba PuHuiTi;
    font-weight: 400;
    font-size: 14px;
    color: #FFFFFF;
    line-height: 10px;
    text-align: left;
    margin-bottom: 16px;
  }

  &-area {
    margin-left: 14px;
    max-height: 280px;
    overflow-y: auto;

    .progress-item {
      margin-bottom: 16px;
      display: flex;
      justify-content: flex-start;
      align-items: center;

      &.progress-1 {
        .progress-item__label__num {
          background: url("../../../assets/images/common/num-1.png") no-repeat 0 center;
          background-size: 18px 22px;
        }

        .progress-item__bar__progress {
          background: linear-gradient(90deg, #66FFFF 0%, #F7B500 100%);
        }
      }

      &.progress-2 {
        .progress-item__label__num {
          background: url("../../../assets/images/common/num-2.png") no-repeat 0 center;
          background-size: 18px 23px;
        }

        .progress-item__bar__progress {
          background: linear-gradient(90deg, #66FFFF 0%, #F7B500 100%);
        }
      }

      &.progress-3 {
        .progress-item__label__num {
          background: url("../../../assets/images/common/num-3.png") no-repeat 0 center;
          background-size: 18px 23px;
        }

        .progress-item__bar__progress {
          background: linear-gradient(90deg, #66FFFF 0%, #F7B500 100%);
        }
      }

      &:last-child {
        margin-bottom: 0;
      }

      &__label {
        font-family: Alibaba PuHuiTi;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
        color: #FFFFFF;
        text-align: left;
        padding-left: 30px;
        position: relative;
        width: 125px;
        box-sizing: border-box;

        &__num {
          font-family: DIN;
          font-weight: 500;
          font-size: 12px;
          color: #FFFFFF;
          line-height: 20px;
          width: 18px;
          height: 23px;
          background: url("../../../assets/images/common/num-4.png") no-repeat 0 center;
          background-size: 18px 23px;
          position: absolute;
          left: 0;
          top: -3px;
          text-align: center;
        }
      }

      &__bar {
        position: relative;
        width: 400px;

        &__empty {
          width: inherit;
          height: 14px;
          background: #0090FF;
          opacity: 0.2;
          border-radius: 8px;
        }

        &__progress {
          position: absolute;
          top: 0;
          left: 0;
          height: 14px;
          background: linear-gradient(90deg, #66FFFF 0%, #F7B500 100%);
          transition: width .3s;
          border-radius: 8px;

          &__wrap {
            position: relative;
          }

          &__percent {
            position: absolute;
            top: -4px;
            right: -105px;
            width: 120px;
            font-family: DIN;
            font-weight: 500;
            font-size: 16px;
            color: #FFFFFF;
            line-height: 20px;
          }
        }
      }
    }
  }
}
</style>