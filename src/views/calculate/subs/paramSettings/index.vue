<template>
  <div class="list">
    <div class="list-head">
      <div
        class="list-head__item"
        :class="{ active: activeIndex === 0 }"
        @click="toggleHandle(0)"
      >
        价值量
      </div>
      <div
        class="list-head__item"
        :class="{ active: activeIndex === 1 }"
        @click="toggleHandle(1)"
      >
        实物量
      </div>
    </div>
    <div class="list-body">
      <el-form label-width="200px">
        <div
          class="list-body__item"
          v-for="(item, index) in list"
          :class="{ show: activeIndex === index }"
          :key="index"
        >
          <!--                    <div class="item" @click="toggleParams(index)">-->
          <!--                        <div class="item-name t1">{{item.name}}</div>-->
          <!--                    </div>-->
          <div class="form">
            <el-form-item
              :label="subItem.label"
              :class="{ show: subItem.show }"
              v-for="(subItem, subIndex) in item.params"
              :key="subIndex"
            >
              <el-input v-model="subItem.value"></el-input>
            </el-form-item>
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
      activeIndex: 0,
    };
  },
  methods: {
    toggleParams(index) {
      this.$emit("toggleParams", index);
    },
    getParams() {
      let params = {};
      this.list.forEach((item) => {
        item.params.forEach((param) => {
          let numberParams = Number(param.value);
          if (isNaN(numberParams)) {
            numberParams = parseFloat(param.value);
          }
          params[param.key.toLowerCase()] = numberParams;
        });
      });
      return params;
    },
    toggleHandle(index) {
      this.activeIndex = index;
    },
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
    line-height: 32px;
    display: flex;
    padding: 15px 0 8px;
    border-bottom: 2px solid #074d90;
    .table;

    &__item {
      width: 50%;
      text-align: center;
      border: 1px solid #074d90;
      cursor: pointer;
      box-sizing: border-box;
      &.active {
        color: #fff;
        background: #074d90;
      }
    }
  }

  &-body {
    height: 280px;
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
      //margin-top: 8px;
      //padding-bottom: 4px;
      .table;

      .item {
        display: flex;
        position: relative;
        //margin-left: 33px;

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

      .form {
        display: none;
        border-top: 1px solid rgba(35, 88, 162, 1);
        padding-top: 8px;
        padding-bottom: 8px;
        //margin-left: 33px;
        padding-left: 33px;

        /deep/.el-form-item {
          margin-bottom: 4px;
          display: none;

          &.show {
            display: block;
          }

          .el-form-item__label {
            font-size: 14px;
            font-family: Alibaba-PuHuiTi, Alibaba-PuHuiTi;
            font-weight: normal;
            color: #10d7f1;
            line-height: 20px;
            text-align: left;
          }

          .el-form-item__content {
            line-height: 22px;
            padding-right: 50px;

            .el-input {
              .el-input__inner {
                background: rgba(0, 0, 0, 0.21);
                border: 1px solid #52c0ff;
                height: 22px;
                line-height: 22px;
                border-radius: 0;
                color: #fff;
                padding-left: 10px;
                font-size: 14px;
              }
            }
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
        .form {
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