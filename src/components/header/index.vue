<template>
  <div class="header">
    <div class="header-wrapper">
      <div class="header-title" @click="goBack">
        <img src="../../assets/images/common/header-title-chongqing.png" alt=""/>
      </div>
<!--      <div class="header-user">-->
<!--        <div class="header-user__name">admin</div>-->
<!--      </div>-->
<!--      <div class="header-timer">-->
<!--        <div class="header-timer__time">{{ time || "-" }}</div>-->
<!--        <div class="header-timer__day">{{ day }}</div>-->
<!--      </div>-->
    </div>
  </div>
</template>

<script>
import moment from "moment";
export default {
  name: "page-header",
  props: {
    type: {
      default: "huzhou",
    },
  },
  data() {
    return {
      day: "",
      time: "",
      nav: [
        { title: "生态价值一张图", path: "/home" },
        { title: "生态价值核算", path: "/gep" },
      ],
    };
  },
  mounted() {
    let day = moment().format("YYYY-MM-DD");
    let week = moment().day();
    this.day = `${day} 周${this.getWeek(week)}`;
    setInterval(() => {
      let time = moment().format("HH:mm:ss");
      this.time = `${time}`;
    }, 1000);
  },
  methods: {
    getWeek(e) {
      const week = ["日", "一", "二", "三", "四", "五", "六"];
      return week[e];
    },
    goPage(path) {
      this.$router.push({
        path,
      });
    },
    goBack() {
      history.go(-1);
    },
  },
};
</script>

<style lang="less" scoped>
.header {
  height: 100px;

  &-wrapper {
    background-image: url("../../assets/images/common/header-title-bg.png");
    background-repeat: no-repeat;
    background-position: center 0;
    background-size: cover;
    position: relative;
    display: flex;
  }
  &-user {
    position: absolute;
    top: 27px;
    right: 85px;
    background-image: url("../../assets/images/common/icon-user.png");
    background-repeat: no-repeat;
    background-position: 0 center;
    background-size: contain;
    &__name {
      font-size: 17px;
      font-family: ArialMT;
      font-weight: 500;
      color: #ffffff;
      padding-left: 27px;
      line-height: 21px;
    }
  }
  &-title {
    width: 517px;
    height: 39px;
    padding: 32px 0 15px 0;
    margin: 0 auto;
    cursor: pointer;

    img {
      width: inherit;
      height: inherit;
    }
  }
  &-timer {
    text-align: left;
    position: absolute;
    top: 17px;
    left: 88px;

    &__day {
      font-size: 12px;
      font-family: PangMenZhengDao;
      font-weight: 400;
      color: #ffffff;
      line-height: 19px;
    }

    &__time {
      font-size: 18px;
      font-family: PangMenZhengDao;
      font-weight: bold;
      color: #fff;
      line-height: 19px;
      margin-bottom: 2px;
    }
  }
}
</style>
