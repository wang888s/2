<template>
  <div class="news">
    <template v-if="list.length > 0">
      <vue-seamless
        :data="list"
        :class-option="optionHover"
        class="seamless-warp"
      >
        <div
          class="news-item"
          v-for="(item, index) in list"
          :key="index"
          @click="clickNews(item)"
        >
          <div class="news-item__name">{{ item.title }}</div>
        </div>
      </vue-seamless>
    </template>
    <template v-else>
      <empty></empty>
    </template>
  </div>
</template>

<script>
import { priceFormat } from "@/utils/common";
import vueSeamless from "vue-seamless-scroll";
import empty from "../../../../components/empty";
import service from "@/api";

export default {
  components: {
    vueSeamless,
    empty,
  },
  props: {
    list: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      priceFormat,
      optionHover: {
        step: 0.5,
      },
    };
  },
  methods: {
    // 获取新闻详情
    async getNewsDetail(id) {
      // const res = await service('get', `news/details/${id}`)
      // if (res.status === 200) {
      //     const {url} = res.data;
      //     window.open(url);
      // }
    },
    clickNews(item) {
      //   this.getNewsDetail(item.id);
    },
  },
};
</script>

<style lang="less" scoped>
.news {
  padding: 20px;
  overflow: hidden;
  height: 280px;

  &-item {
    padding: 12px 20px;
    text-align: left;

    &:hover {
      .news-item__name {
        color: #b4d2fe;
      }
    }

    &:nth-child(even) {
      background-color: rgba(8, 55, 120, 0.76);
      background-image: url("../../../../assets/images/common/news-line.png");
      background-repeat: no-repeat;
      background-position: center bottom;
      background-size: contain;
    }

    &__name {
      font-size: 16px;
      font-family: Alibaba-PuHuiTi, Alibaba-PuHuiTi;
      font-weight: normal;
      color: #ffffff;
      line-height: 22px;
      text-align: left;
      background-image: url("../../../../assets/images/common/icon-news.png");
      background-repeat: no-repeat;
      background-position: 0 center;
      background-size: 18px 21px;
      padding-left: 30px;
      cursor: pointer;
    }
  }
}
</style>