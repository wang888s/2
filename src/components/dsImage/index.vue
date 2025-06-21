<template>
    <div class="ds-image">
        <div class="ds-image__img">
            <viewer :images="[imgSrc]">
                <img :src="imgSrc" alt="" />
            </viewer>
            <div class="ds-image__img__tip">{{name || '#地块实景#'}}</div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ds-image',
    props: {
        name: {
            default: '',
        },
        imgSrc: {
            default: '',
        }
    },
    data () {
        return {}
    }
}
</script>

<style lang="less" scoped>
.ds-image {
    width: inherit;
    height: inherit;

    &__img {
        width: inherit;
        height: inherit;
        background: #ccc;
        margin: 0 auto;
        position: relative;
        text-align: center;

        div:nth-child(1) {
            width: inherit;
            height: inherit;
        }

        img {
            width: inherit;
            height: inherit;
        }

        &__tip {
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(42, 112, 253, 0.83);
            font-size: 14px;
            font-family: Alibaba-PuHuiTi, Alibaba-PuHuiTi;
            font-weight: normal;
            color: #FFFFFF;
            line-height: 20px;
        }
    }
}
</style>