<template>
  <div class="loading">
    <div class="loading-wrapper">
      <div class="loading-wrapper__container">
        <div class="loading-icon">
          <img src="../../assets/images/common/loading.gif" alt="" />
        </div>
        <div class="loading-text">
<!--          <div class="progress">-->
<!--            <div class="progress-bar" :style="{width: percent + '%'}"></div>-->
<!--            <div class="progress-empty"></div>-->
<!--          </div>-->
          <div>
              <CountTo
                  class="count-to"
                  :startVal="startVal"
                  :endVal="percent"
                  :duration="duration"
                  :decimals="2"
              /><span>%</span>
          </div>
            <div>
                {{ text.default }}
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CountTo from "vue-count-to";
export default {
  components: {
    CountTo,
  },
  // props: {
  //     text: {
  //         default: '结果计算中'
  //     }
  // },
  data() {
    return {
      percent: 0,
      timer: null,
      startVal: 0,
      duration: 1500,
      text: {
        default: "结果计算中",
      },
    };
  },
  mounted() {
    this.start()
  },
  methods: {
    start() {
      this.percent = 0;
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
      this.timer = setInterval(() => {
        this.startVal = this.percent;
        if (this.percent >= 99) {
          this.percent = 99;
          clearInterval(this.timer);
          this.timer = null;
        } else {
          this.percent += parseFloat((Math.random() * 10).toFixed(2));
          this.percent = parseFloat(this.percent.toFixed(2));
          if (this.percent >= 95) {
            this.percent = 99;
          }
          // 水源涵养核算中，洪水调蓄核算中，固碳释氧核算中，土壤保持核算中，气候调节核算中，水环境净化核算中，空气净化核算中
          if (this.percent > 10 && this.percent <= 20) {
            this.text.default = "水源涵养核算中";
          } else if (this.percent > 20 && this.percent <= 30) {
            this.text.default = "洪水调蓄核算中";
          } else if (this.percent > 30 && this.percent <= 40) {
            this.text.default = "固碳释氧核算中";
          } else if (this.percent > 40 && this.percent <= 60) {
            this.text.default = "土壤保持核算中";
          } else if (this.percent > 60 && this.percent <= 70) {
            this.text.default = "气候调节核算中";
          } else if (this.percent > 70 && this.percent <= 80) {
            this.text.default = "水环境净化核算中";
          } else if (this.percent > 80 && this.percent <= 95) {
            this.text.default = "空气净化核算中";
          }
        }
      }, 1000);
    },
    done() {
      this.percent = 100;
      this.startVal = 100;
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },
  },
};
</script>

<style lang="less" scoped>
@keyframes rotateAni {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
.loading {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 998;
  background: rgba(0, 0, 0, 0.5);

  &-wrapper {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 600px;
    height: 600px;
    //background-color: #052342;
    display: flex;
    justify-items: center;
    align-items: center;
    justify-content: center;
    z-index: 999;

    &__container {
      width: 600px;
        position: relative;
    }
  }

  &-icon {
    img {
      width: 600px;
      height: 600px;
      //animation: rotateAni 1.2s forwards infinite linear;
    }
  }

  &-text {
    font-size: 20px;
    font-family: Alibaba-PuHuiTi, Alibaba-PuHuiTi;
    font-weight: normal;
    color: #ffffff;
    line-height: 27px;
      min-width: 300px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
  }
}

.progress {
  width: 100%;
  position: relative;
  .progress-bar {
    position: absolute;
    left: 0;
    top: 0;
    height: 14px;
    background-color: #0d7ec5;
    transition: width .3s;
    border-radius: 4px;
  }
  .progress-empty {
    width: 100%;
    background: #adb5d0;
    height: 14px;
    margin-bottom: 8px;
    border-radius: 4px;
  }
}

.count-to {
  font-size: 80px;
  display: inline-block;
  font-family: 'Microsoft YaHei', '微软雅黑', sans-serif;
}
</style>