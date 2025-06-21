<template>
  <div class="list">
    <div class="list-head">
      <div class="list-head__item t1">区县</div>
      <div class="list-head__item t2">项目名称</div>
      <div class="list-head__item t3">项目地址</div>
    </div>
    <div class="list-body">
      <el-form label-width="155px">
        <div
          class="list-body__item"
          v-for="(item, index) in list"
          :class="{ show: item.show }"
          :key="index"
        >
          <div class="item" @click="toggleParams(index)">
            <div class="item-name t1">{{ item.label }}</div>
          </div>
          <div class="url">
            <!--                        <div class="url-item"-->
            <!--                             :class="{active: activeIndex === subIndex}"-->
            <!--                             v-for="(subItem, subIndex) in item.list"-->
            <!--                             @click="openUrl(subItem, subIndex)"-->
            <!--                             :key="subIndex">{{subItem.url}}</div>-->
            <div
              v-for="(subItem, subIndex) in item.list"
              class="url-item"
              :class="{ active: activeIndex === subIndex }"
              @click="openUrl(subItem, subIndex)"
            >
              <div class="item-name t1"></div>
              <div class="item-name t2">{{ subItem.projectName }}</div>
              <el-tooltip effect="dark" :content="subItem.url" placement="top">
                <div slot="content" class="item-content">{{ subItem.url }}</div>
                <div class="item-name t3">
                  {{ subItem.url }}
                </div>
              </el-tooltip>
            </div>
          </div>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { priceFormat } from "@/utils/common";
export default {
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
      activeIndex: null,
    };
  },
  methods: {
    toggleParams(index) {
      this.$emit("toggleParams", index);
    },
    openUrl(item, index) {
      if (this.activeIndex === index) {
        this.activeIndex = null;
        // window.open(item.url)
        this.$emit("close");
      } else {
        this.activeIndex = index;
        // window.open(item.url)
        this.$emit("open", item.url);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.item-content {
  width: 500px;
}

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
    width: 20%;
    padding: 8px 10px;
  }

  .t2 {
    width: 50%;
    text-align: left;
    box-sizing: border-box;
    padding: 8px 10px;
  }

  .t3 {
    width: 30%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    box-sizing: border-box;
    padding: 8px 10px;
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
    height: 200px;
    overflow: auto;
    .scrollbar;

    &__item {
      font-size: 16px;
      font-family: Alibaba-PuHuiTi, Alibaba-PuHuiTi;
      font-weight: normal;
      color: #ffffff;
      line-height: 22px;
      transition: all 0.3s;
      cursor: pointer;
      background-color: rgba(8, 55, 120, 0.7);
      margin-top: 8px;
      padding-bottom: 4px;
      .table;

      .item {
        display: flex;
        position: relative;
        margin-left: 33px;

        &:before {
          content: "";
          position: absolute;
          width: 6px;
          height: 6px;
          border-top: 1px solid #007bff;
          border-right: 1px solid #007bff;
          transform: rotate(-45deg) translateY(-50%);
          top: 50%;
          left: -14px;
          transition: transform 0.3s;
        }
      }

      .url {
        display: none;
        border-top: 1px solid rgba(35, 88, 162, 1);
        padding-top: 8px;
        //margin-left: 33px;
        margin-right: 10px;

        .url-item {
          font-size: 14px;
          color: #fff;
          text-align: left;
          //margin-bottom: 15px;
          word-wrap: break-word; /* 或者使用 normal */
          display: flex;
          cursor: pointer;
          &.active {
            border: 1px solid rgba(0, 109, 255, 1);
            box-shadow: 0px 0px 25px 0px rgba(13, 126, 197, 1) inset;
            border-radius: 4px;
          }
        }
      }

      &.show {
        .item {
          &:before {
            transform: rotate(-225deg) translateY(50%);
            top: 18px;
          }
        }
        .url {
          display: block;
        }
      }

      &.active {
        border: 1px solid rgba(0, 109, 255, 1);
        box-shadow: 0px 0px 25px 0px rgba(13, 126, 197, 1) inset;
        border-radius: 4px;
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