<template>
  <div class="list">
    <div class="list-head">
      <div class="list-head__item t1">项目名称</div>
      <div class="list-head__item t3">调节服务总量</div>
      <div class="list-head__item t2">更新时间</div>
    </div>
    <div class="list-body">
      <template v-if="list.length > 0">
        <!-- <vue-seamless :data="list" :class-option="optionHover" class="seamless-warp"> -->
        <div
          class="list-body__item"
          v-for="(item, index) in list"
          @click="clickHandler(item)"
          :class="{ active: itemId === item.id, error: isSuccess(item.url) }"
          :key="index"
        >
          <div class="item-name t1">{{ item.projectName }}</div>
          <div class="item-value t3" @click.stop="clickDetailHandler(item)">
            {{ priceFormat(item.tiaojie_jz) }}
          </div>
          <div class="item-time t2">{{ item.datetime }}</div>
        </div>
        <!-- </vue-seamless> -->
      </template>
      <template v-else>
        <empty></empty>
      </template>
    </div>
  </div>
</template>

<script>
import { priceFormat } from "@/utils/common";
import vueSeamless from "vue-seamless-scroll";
import empty from "../../../../components/empty";
import L from "leaflet";
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
    itemId: {
      default: null,
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
    clickHandler(item) {
      this.$emit("listClick", item);
    },
    clickDetailHandler(item) {
      this.$emit("detailClick", item);
    },
      isSuccess (url) {
          if (!url) return true;
          const items = url.split("?")[1].split("&");
          var layers, bbox;
          try {
              items.forEach((item) => {
                  const key = item.split("=")[0];
                  const val = item.split("=")[1];
                  if (key === "layers") {
                      layers = val.replace("%3A", ":");
                  }
                  if (key == "bbox") {
                      if(val === '') {
                          throw new Error('当前数据异常，请检查是否核算成功')
                      }
                      const points = val.replace("%2C", ",").split(",");
                      bbox = [
                          [points[1], points[0]],
                          [points[3], points[2]],
                      ];
                  }
              });
              return false
          } catch (e) {
              console.log(e)
              return  true
          }
      }
  },
};
</script>

<style lang="less" scoped>
.scrollbar {
  overflow: auto;
  scrollbar-color: #4b5680 transparent;
  scrollbar-width: thin;

  &::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: #4b5680;
  }
}

.table {
  .t1 {
    width: 45%;
  }

  .t2 {
    width: 20%;
  }

  .t3 {
    width: 35%;
  }
}

.list {
  padding: 0 20px 12px 17px;

  &-head {
    font-size: 16px;
    font-family: Alibaba-PuHuiTi, Alibaba-PuHuiTi;
    font-weight: normal;
    color: #52c0ff;
    line-height: 22px;
    display: flex;
    padding: 15px 0 8px;
    border-bottom: 2px solid #074d90;
    .table;
  }

  &-body {
    height: 245px;
    overflow-y: auto;
    .scrollbar;

    &__item {
      display: flex;
      font-size: 16px;
      font-family: Alibaba-PuHuiTi, Alibaba-PuHuiTi;
      font-weight: normal;
      color: #ffffff;
      line-height: 22px;
      transition: all 0.3s;
      border-top: 1px solid transparent;
      border-left: 1px solid transparent;
      border-right: 1px solid transparent;
      border-bottom: 1px solid #074d90;
      padding: 0 10px;
      cursor: pointer;
      .table;

      &.active {
        border: 1px solid rgba(0, 109, 255, 1);
        box-shadow: 0px 0px 25px 0px rgba(13, 126, 197, 1) inset;
        border-radius: 4px;

          &.error {
              border: 1px solid rgba(255, 81, 0, 1);
              box-shadow: 0px 0px 25px 0px rgba(255, 81, 0, 1) inset;
              border-radius: 4px;
          }
      }

      .item-index {
        padding: 8px 0 12px 0;
        .index {
          width: 20px;
          height: 20px;
          background: #33b5ff;
          border-radius: 100%;
          line-height: 20px;
          margin: 0 auto;
          &.index1 {
            background-color: rgba(255, 81, 0, 1);
            border: 3px solid rgba(110, 37, 3, 1);
          }
          &.index2 {
            background-color: rgba(247, 147, 30, 1);
            border: 3px solid rgba(178, 100, 10, 1);
          }
          &.index3 {
            background-color: rgba(236, 206, 25, 1);
            border: 3px solid rgba(167, 143, 0, 1);
          }
        }
      }

      .item-name {
        padding: 8px 0 12px 0;
        text-align: left;
      }

      .item-value {
        padding: 8px 0 12px 0;
        color: #10d7f1;
      }

      .item-time {
        padding: 8px 0 12px 0;
      }
    }
  }
}
</style>