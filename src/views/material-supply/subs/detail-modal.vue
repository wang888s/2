<template>
  <div class="modal" :class="{show: show}">
    <div class="modal-title">{{currentTown.label}}</div>
    <div class="modal-content">
      <div class="modal-content__field field">
        <div class="field-title">类型</div>
        <div class="field-value">{{currentOptions.name}}</div>
      </div>
      <!--      <div class="modal-content__field field">-->
      <!--        <div class="field-title">场景</div>-->
      <!--        <div class="field-value">农业</div>-->
      <!--      </div>-->
      <div class="modal-content__field field">
        <div class="field-title">价值</div>
        <div class="field-value">{{currentTown[type ? type : 'total']}}亿元</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: ''
    },
    current: {
      type: Object,
      default: () => ({
        properties: {}
      })
    },
    currentTown: {
      type: Object,
      default: () => ({})
    },
    show: {
      type: Boolean,
      default: false,
    }
  },
  watch: {
    type (val) {
      if(val) {
        console.log(val)
        this.currentOptions = this.options.find(item => item.key === val)
      } else {
        this.currentOptions = {
          name: '全部',
          key: ''
        }
      }
    }
  },
  data() {
    return {
      currentOptions: {
        name: '全部',
        key: ''
      },
      options: [
        {
          name: '农产品',
          key: 'nyCp',
          value: ''
        },
        {
          name: '林产品',
          key: 'lyCp',
          value: ''
        },
        {
          name: '牧产品',
          key: 'myCp',
          value: ''
        },
        {
          name: '渔产品',
          key: 'yyCp',
          value: ''
        },
      ],
    }
  }
}
</script>

<style lang="less" scoped>
.modal {
  width: 280px;
  height: 220px;
  background: url("../../../assets/images/common/tck.png") no-repeat 0 0;
  background-size: cover;
  position: absolute;
  top: 50px;
  right: -300px;
  z-index: 10;
  transition: all .3s;
  opacity: 0;

  &.show {
    right: 68px;
    opacity: 1;
  }

  &-title {
    font-weight: 400;
    font-size: 20px;
    color: #FFFFFF;
    padding: 15px 20px 15px 50px;
    text-align: left;
  }

  &-content {
    padding: 20px;
    text-align: left;

    &__field {
      padding-bottom: 25px;
    }

    .field {
      display: flex;

      &-title {
        font-weight: 400;
        font-size: 20px;
        color: #2FDCFF;
        margin-right: 40px;
      }

      &-value {
        font-weight: 400;
        font-size: 20px;
        color: #fff;
      }
    }
  }
}
</style>