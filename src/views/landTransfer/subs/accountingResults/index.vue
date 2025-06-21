<template>
    <div class="list">
        <div class="list-head">
            <div class="list-head__item t1">核算内容</div>
            <div class="list-head__item t2">功能量</div>
            <div class="list-head__item t3">可比价值量（万元）</div>
        </div>
        <div class="list-body">
            <template v-if="list.length > 0">
                <div class="list-body__item" v-for="(item, index) in list" :key="index">
                    <div class="item-name t1">{{item.name}}</div>
                    <div class="item-value t2">{{ priceFormat(item.value) }}</div>
                    <div class="item-time t3">{{ item.kbValue }}</div>
                </div>
            </template>
            <template v-else>
                <empty></empty>
            </template>
        </div>

    </div>
</template>

<script>
import {priceFormat} from '@/utils/common'
import vueSeamless from 'vue-seamless-scroll'
import empty from '../../../../components/empty'
export default {
    components: {
        vueSeamless,
        empty
    },
    props: {
        list: {
            type: Array,
            default: () => ([])
        }
    },
    data() {
        return {
            priceFormat,
            optionHover: {
                step: 0.5
            },
        }
    },
    methods: {}
}
</script>

<style lang="less" scoped>

.table {
    .t1 {
        width: 50%;
    }

    .t2 {
        width: 18%;
    }

    .t3 {
        width: 32%;
    }
}

.list {
    padding: 0 20px 12px 17px;

    &-head {
        font-size: 16px;
        font-family: Alibaba-PuHuiTi, Alibaba-PuHuiTi;
        font-weight: normal;
        color: #52C0FF;
        line-height: 22px;
        display: flex;
        padding: 15px 0 8px;
        .table;
    }

    &-body {
        height: 425px;
        overflow: hidden;

        &__item {
            display: flex;
            font-size: 14px;
            font-family: Alibaba-PuHuiTi, Alibaba-PuHuiTi;
            font-weight: normal;
            color: #FFFFFF;
            line-height: 20px;
            .table;

            &:nth-child(even) {
                background: rgba(8, 55, 120, 0.76);
            }

            .item-name {
                padding: 7px 0 8px 10px;
                text-align: left;
            }

            .item-value {
                padding: 7px 0 8px 0;
            }

            .item-time {
                padding: 7px 0 8px 0;
            }
        }
    }
}
</style>