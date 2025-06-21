<template>
    <div id="miniTable" class="table">
        <div class="list">
            <div class="list-head">
                <div class="list-head__item t1">核算内容</div>
                <div class="list-head__item t2"></div>
                <div class="list-head__item t3">实物量（万元）</div>
                <div class="list-head__item t3">价值量（万元）</div>
            </div>
            <div class="list-body">
                <template v-if="list.length > 0">
                    <!--                    <vue-seamless :data="list" :class-option="optionHover" class="seamless-warp">-->
                    <div class="list-body__item" v-for="(item, index) in list" :key="index">
                        <div class="item-name t1">{{ item.name }}</div>
                        <div class="sub" style="border-left: 1px solid #074D90;">
                            <template v-for="(subItem, subIndex) in item.params">
                                <div :key="subIndex" style="display: flex;">
                                    <div class="item-name t2">{{ subItem.label }}</div>
                                </div>
                            </template>
                        </div>
                        <div class="sub" style="border-left: 1px solid #074D90;">
                            <template v-for="(subItem, subIndex) in item.params">
                                <div :key="subIndex" style="display: flex;">
                                    <div class="item-value t3">{{ priceFormat(subItem.value) }}</div>
                                </div>
                            </template>
                        </div>
                        <div class="sub" style="border-left: 1px solid #074D90;">
                            <template v-for="(subItem, subIndex) in item.params">
                                <div :key="subIndex" style="display: flex;">
                                    <div class="item-value t3">{{ priceFormat(subItem.value_jz) }}</div>
                                </div>
                            </template>
                        </div>
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
    props: {
        tableValue: {
            default: () => ({})
        }
    },
    watch: {
        tableValue: {
            handler(value) {
                this.list.forEach(item => {
                    item.params.forEach(param => {
                        param.value = value[param.key.toLowerCase()]
                        param.value_jz = value[`${(param.key + '_jz').toLowerCase()}`]
                    })
                })
            },
            deep: true
        }
    },
    data() {
        return {
            priceFormat,
            list: [
                // {
                //     name: '基础数据', value: '', key: 'jcsj',
                //     params: [
                //         {label: '降水量', value: '', key: 'js'},
                //         {label: '蒸发量', value: '', key: 'zf'},
                //         {label: '径流系数', value: '', key: 'jlxs'},
                //         {label: '暴雨径流系数', value: '', key: 'byjlxs'},
                //         {label: '矢量面积', value: '', key: 'shapeArea'},
                //         {label: '植被盖因子', value: '', key: 'c'},
                //     ]
                // },
                {
                    name: '调节服务', value: 0, key: 'tjfw',
                    params: [
                        {label: '水源涵养（万立方米/年）', value: '', key: 'syhy'},
                        // {label: '水源涵养价值', value: '', key: 'syhy_jz'},
                        {label: '土壤保持（万吨/年）', value: '', key: 'trbc'},
                        {label: '洪水调蓄（万立方米/年）', value: '', key: 'hstx'},
                        {label: '水质净化（吨/年）', value: '', key: 'szjh'},
                        {label: '空气净化（吨/年）', value: '', key: 'kqjh'},
                        {label: '固碳（万吨/年）', value: '', key: 'gt'},
                        // {label: '固碳价值', value: '', key: 'gt_jz'},
                        {label: '释氧（万吨/年）', value: '', key: 'sy'},
                        // {label: '释氧价值', value: '', key: 'sy_jz'},
                        {label: '气候调节（万千瓦时/年）', value: '', key: 'qhtj'},
                        // {label: '气候调节_植被', value: '', key: 'qhtjp'},
                        // {label: '气候调节_植被价值', value: '', key: 'qhtjp_jz'},
                        // {label: '气候调节_水面', value: '', key: 'qhtjw'},
                        // {label: '气候调节_水面价值', value: '', key: 'qhtjw_jz'},
                        // {label: '空气净化价值', value: '', key: 'kqjh_jz'},
                        // {label: '调节价值', value: '', key: 'tiaojie_jz'},
                    ],
                }
            ]
        }
    }
}
</script>

<style lang="less" scoped>
.table {

    .t1 {
        width: 140px;
        text-align: left;
    }

    .t2 {
        width: 270px;
    }

    .t3 {
        width: 160px;
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
        padding: 15px 0 8px 0;
        border-left: 1px solid #074D90;
        border-right: 1px solid #074D90;
        border-top: 1px solid #074D90;
        background: rgba(8, 55, 120, 0.76);
        box-sizing: border-box;
        .table;

        &__item {
            padding: 0 10px;
        }
    }

    &-body {
        overflow: hidden;

        &__item {
            display: flex;
            align-items: center;
            justify-items: center;
            font-size: 16px;
            font-family: Alibaba-PuHuiTi, Alibaba-PuHuiTi;
            font-weight: normal;
            color: #FFFFFF;
            line-height: 22px;
            .table;
            box-sizing: border-box;
            border-left: 1px solid #074D90;
            border-right: 1px solid #074D90;
            border-bottom: 1px solid #074D90;

            .sub {
                .item-name {
                    border-top: 1px solid #074D90;
                }

                .item-value {
                    border-top: 1px solid #074D90;
                }
            }

            .item-name {
                padding: 5px 10px 5px 10px;
                text-align: left;
            }

            .item-value {
                padding: 5px 10px 5px 10px;
                color: #10D7F1;
            }
        }
    }
}
</style>