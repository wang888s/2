<template>
    <!-- :class动态类绑定 为open类添加动态属性-->
    <div class="left" :class="{ open: open }">
        <div class="left-wrapper" ref="leftWrapper">
            <div class="left-container">
                <!-- 用于接收外部传入的内容-->
                <slot></slot>
            </div>
        </div>
        <div class="left-drawer" @click="toggleLeftBtn" v-if="showToggleBtn">
            <div class="left-drawer__btn" :class="{ open: open }"></div>
        </div>
    </div>
</template>
<script>
export default {

    props: {
        open: {
            default: false,// 控制面板展开状态
        },
        showToggleBtn: {
            default: true // 控制按钮显示
        }
    },
    data() {
        return {};
    },
    methods: {
        toggleLeftBtn() {
            this.$emit("toggle");// 触发状态切换事件
        },
    },
};
</script>
<style lang="less" scoped>
.left {
    position: absolute;
    top: 20px;
    left: -612px;// 默认隐藏位置
    z-index: 1;
    height: calc(~"100vh - 1rem ");
    transition: left 0.3s;// 展开动画

    // &.open编译结果：`.left .open`
    &.open {
        left: 10px;// 展开位置距离左侧10px

        // 优先级高于下面的.left-drawer
        .left-drawer {
            right: -23px; // 按钮定位
        }
    }

    .left-wrapper {
        position: relative;
        width: inherit;//继承父级宽度
        height: inherit;//继承父级高度
        box-sizing: border-box;//改变盒模型计算方式
    }

    .left-drawer {
        position: absolute;
        right: -23px;
        top: 50%;
        transform: translateY(-50%);

        &:hover {
            .left-drawer__btn {
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
            cursor: pointer;//鼠标悬停变手型

            &.open {
                background-image: url("../../assets/images/common/left-drawer-open.png");
            }
        }
    }
}
</style>
