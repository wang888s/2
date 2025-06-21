<template>
    <div class="list">
        <div class="list-head">
            <div class="list-head__item t1">生态系统类型</div>
            <div class="list-head__item t2">面积（公顷）</div>
            <div class="list-head__item t3">占比（%）</div>
        </div>
        <div class="list-body">
            <template v-if="list.length > 0">
                <!--<vue-seamless :data="list" :class-option="optionHover" class="seamless-warp">-->
                    <div class="list-body__item" v-for="(item, index) in list" :key="index">
                        <div class="item-name t1">{{item.name}}</div>
                        <div class="item-value t2">{{ priceFormat(item.area) }}</div>
                        <div class="item-value t3">{{ item.percent }}</div>
                    </div>
<!--                </vue-seamless>-->
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
        width: 40%;
    }

    .t2 {
        width: 40%;
    }

    .t3 {
        width: 20%;
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
        text-align: left;
        border-bottom: 2px solid #074D90;
        .table;
    }

    &-body {
        height: 215px;
        overflow: hidden;
        text-align: left;

        &__item {
            display: flex;
            font-size: 16px;
            font-family: Alibaba-PuHuiTi, Alibaba-PuHuiTi;
            font-weight: normal;
            color: #FFFFFF;
            line-height: 22px;
            border-bottom: 1px solid rgba(7, 77, 144, 1);
            .table;

            &:last-child {
                border-bottom: unset;
            }

            .item-index {
                padding: 8px 0 12px 0;
                .index {
                    width: 20px;
                    height: 20px;
                    background: #33B5FF;
                    border-radius: 100%;
                    line-height: 20px;
                    margin: 0 auto;
                    &.index1 {
                        background-color: rgba(255, 81, 0, 1);
                        border: 3px solid rgba(110, 37, 3, 1);
                    }
                    &.index2 {
                        background-color: rgba(247, 147, 30, 1);
                        border: 3px solid rgba(178, 100, 10, 1);
                    }
                    &.index3 {
                        background-color: rgba(236, 206, 25, 1);
                        border: 3px solid rgba(167, 143, 0, 1);
                    }
                }
            }

            .item-name {
                padding: 7px 0 7px 0;
                text-align: left;
            }

            .item-value {
                padding: 7px 0 7px 0;
                color: #10D7F1;
            }

            .item-time {
                padding: 7px 0 7px 0;
            }
        }
    }
}
</style>