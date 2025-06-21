<template>
    <div class="empty">
        <div>
            <img src="../../assets/images/common/icon-empty.png" alt="">
            <div class="empty-text">暂无内容</div>
        </div>
    </div>
</template>

<style lang="less" scoped>
.empty {
    height: 100%;
    display: flex;
    justify-items: center;
    align-items: center;
    justify-content: center;

    &-text {
        font-size: 18px;
        font-family: Alibaba-PuHuiTi, Alibaba-PuHuiTi;
        font-weight: normal;
        color: #B4D2FE;
        line-height: 25px;
        margin-top: 22px;
    }

    img {
        width: 80px;
    }
}
</style>