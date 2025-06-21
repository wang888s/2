<template>
    <div class="number">
        <div class="number-block" v-for="(item, index) in number" :key="index">{{item}}</div>
    </div>
</template>

<script>
export default {
    props: {
        number: {
            default: () => ([])
        }
    },
    data () {
        return {

        }
    }
}
</script>

<style lang="less" scoped>
.number {
    display: flex;

    .number-block {
        font-size: 37px;
        font-family: DINAlternate, DINAlternate;
        font-weight: bold;
        color: #FFFFFF;
        line-height: 42px;
        background-image: url("../../../../assets/images/county/icon-number.png");
        background-repeat: repeat;
        background-position: center 0;
        background-size: 100% 100%;
        padding: 1px 8px;
        margin-right: 3px;
    }
}
</style>