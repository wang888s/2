<template>
    <div id="miniTable" class="table">
        <div class="list">
            <div class="list-head">
                <div class="list-head__item t1">名称</div>
                <div class="list-head__item t2">所在地</div>
                <div class="list-head__item t3">面积（亩）</div>
            </div>
            <div class="list-body">
                <template v-if="list.length > 0">
<!--                    <vue-seamless :data="list" :class-option="optionHover" class="seamless-warp">-->
                        <div class="list-body__item" v-for="(item, index) in list" :key="index">
                            <div class="item-name t1">{{ item.name }}</div>
                            <div class="item-name t2">{{ item.area }}</div>
                            <div class="item-value t3">{{ priceFormat(item.value) }}</div>
                        </div>
<!--                    </vue-seamless>-->
                </template>
                <template v-else>
                    <empty></empty>
                </template>
            </div>

        </div>
    </div>
</template>

<script>
import {priceFormat} from '@/utils/common'
import empty from '@/components/empty'
export default {
    components: {
        empty
    },
    data () {
        return {
            priceFormat,
            list: [
                // {name: '上墅乡刘家塘、田', area: '上墅乡', value: 3233.22}
            ]
        }
    }
}
</script>

<style lang="less" scoped>
.table {
    width: 520px;
    .t1 {
        width: 50%;
    }

    .t2 {
        width: 25%;
    }

    .t3 {
        width: 25%;
    }
}

.list {
    padding: 12px 0 12px 0;

    &-head {
        font-size: 16px;
        font-family: Alibaba-PuHuiTi, Alibaba-PuHuiTi;
        font-weight: normal;
        color: #52C0FF;
        line-height: 22px;
        display: flex;
        padding: 15px 10px 8px 10px;
        border-bottom: 2px solid #074D90;
        background: rgba(8,55,120,0.76);
        box-sizing: border-box;
        .table;
    }

    &-body {
        height: 200px;
        overflow: hidden;

        &__item {
            display: flex;
            font-size: 16px;
            font-family: Alibaba-PuHuiTi, Alibaba-PuHuiTi;
            font-weight: normal;
            color: #FFFFFF;
            line-height: 22px;
            .table;
            padding: 0 10px;
            box-sizing: border-box;

            .item-name {
                padding: 8px 0 12px 0;
                border-bottom: 1px solid #074D90;
                text-align: left;
            }

            .item-value {
                padding: 8px 0 12px 0;
                border-bottom: 1px solid #074D90;
                color: #10D7F1;
            }
        }
    }
}
</style>