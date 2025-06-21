<template>
  <div class="right" :class="{ open: open }">
    <div class="right-wrapper" ref="rightWrapper">
      <div class="right-container">
        <slot></slot>
      </div>
    </div>
    <div class="right-drawer" @click="toggleRightBtn">
      <div class="right-drawer__btn" :class="{ open: open }"></div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    open: {
      default: false,
    },
  },
  data() {
    return {};
  },
  methods: {
    toggleRightBtn() {
      this.$emit("toggle");
    },
  },
};
</script>
<style lang="less" scoped>
.right {
  position: absolute;
  top: 20px;
  right: -612px;
  z-index: 1;
  transition: right 0.3s;

  &.open {
    right: 10px;

    .right-drawer {
      left: -23px;
    }
  }

  .right-wrapper {
    position: relative;
    height: inherit;
  }

  .right-drawer {
    position: absolute;
    left: -29px;
    top: 50%;
    transform: translateY(-50%) rotateY(180deg);

    &:hover {
      .right-drawer__btn {
        background-image: url("../../assets/images/common/left-drawer-active.png");
        background-repeat: no-repeat;
        background-position: 0 0;
        background-size: contain;
      }
    }

    &__btn {
      background-image: url("../../assets/images/common/left-drawer.png");
      background-repeat: no-repeat;
      background-position: 0 0;
      background-size: contain;
      width: 23px;
      height: 62px;
      transition: all 0.3s;
      cursor: pointer;

      &.open {
        background-image: url("../../assets/images/common/left-drawer-open.png");
      }
    }
  }
}
</style>
