<template>
  <div class="progress">
    <div class="progress-unit">单位/亿元</div>
    <div class="progress-area" v-if="dataList && dataList.length > 0">
      <div class="progress-item" v-for="(item, index) in dataList" :key="index">
        <div class="progress-item__label">{{ item.label }}</div>
        <div class="progress-item__bar">
          <div class="progress-item__bar__progress" :style="{width: `${item.value > 100 ? 100 : item.value}%`}">
            <div class="progress-item__bar__progress__wrap">
              <div class="progress-item__bar__progress__icon"></div>
            </div>
          </div>
          <div class="progress-item__bar__empty"></div>
        </div>
        <div class="progress-item__percent">{{ item.value }}</div>
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
    dataList: {
      type: Array,
      default: () => ([])
    }
  },
  data() {
    return {
    }
  },
  mounted() {
    // setInterval(() => {
    //   this.areaList.forEach(item => {
    //     item.value = Math.floor(Math.random() * 100)
    //   })
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

    .progress-item {
      display: flex;
      align-items: center;
      margin-bottom: 18px;

      &:last-child {
        margin-bottom: 0;
      }

      &__label {
        font-family: Alibaba PuHuiTi;
        font-weight: 400;
        font-size: 18px;
        color: #FFFFFF;
        text-align: left;
        padding-left: 30px;
        background: url("../../../assets/images/adjust-service/xb.png") no-repeat 0 center;
        background-size: 23px 14px;
      }

      &__bar {
        position: relative;
        width: 338px;
        margin: 0 35px 0 10px;

        &__empty {
          width: inherit;
          height: 8px;
          background-color: #3E4A5C;
        }

        &__progress {
          position: absolute;
          top: 0;
          left: 0;
          height: 8px;
          background: linear-gradient(270deg, #61ADFF, rgba(116, 165, 217, 0.71), rgba(3, 84, 171, 0.19));
          transition: width .3s;

          &__wrap {
            position: relative;
          }

          &__icon {
            background: url("../../../assets/images/adjust-service/kd.png") no-repeat 0 0;
            background-size: 49px 53px;
            width: 49px;
            height: 53px;
            position: absolute;
            bottom: -25px;
            right: -24px;
          }
        }
      }

      &__percent {
        font-family: DIN;
        font-weight: 500;
        font-size: 18px;
        color: #FFFFFF;
      }
    }
  }
}
</style>