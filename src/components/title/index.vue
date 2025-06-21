<template>
    <div class="title" :class="{'title-link': link}">
        <div class="title-wrapper">
            <div class="title-text">
                <slot>标题</slot>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        link: {
            type: Boolean
        }
    },
    data() {
        return {}
    }
}
</script>

<style lang="less" scoped>
.title {
    position: relative;

    width: 612px;
    height: 77px;
  

    &-link {
        cursor: pointer;//鼠标悬停变手型
    }

    &-wrapper {
        background: url("../../assets/images/common/title.png") no-repeat 0 0;
        background-size: contain;
        // background-color: #000000;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
    }

    &-text {
        color: #ffffff;
        line-height: 25px;
        padding: 22px 0 35px 106px;
        text-align: left;
        font-family: Source Han Sans CN;
        font-weight: 500;
        font-size: 20px;
        
    }
}
</style>