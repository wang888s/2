<template>
    <div class="back" @click="goBack">
        <div class="back-wrapper"></div>
    </div>
</template>

<script>
export default {
    props: {
        path: {
            default: ''
        }
    },
    data () {
        return {}
    },
    methods: {
        goBack () {
            if(this.path) {
                this.$router.push({path: this.path})
            } else {
                history.go(-1)
            }
        }
    }
}
</script>

<style lang="less" scoped>
.back {
    position: absolute;
    top: 0;
    left: 20px;
    transition: left .3s;
    z-index: 10;
    cursor: pointer;

    &-wrapper {
        width: 186px;
        height: 63px;
        background: url("../../assets/images/common/back.png") no-repeat 0 0;
        background-size: cover;
        font-size: 14px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 500;
        color: #FFFFFF;
        line-height: 14px;
        transition: all .3s;
        position: relative;
        z-index: 10;
        text-align: center;
    }
}
</style>