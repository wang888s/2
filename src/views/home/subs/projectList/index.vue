<template>
    <div class="list">
<!--        <div class="list-filter">-->
<!--            <el-form class="form" inline>-->
<!--                <el-form-item>-->
<!--                    <el-input-->
<!--                        placeholder="请输入项目名称"-->
<!--                        v-model="filterData.name"-->
<!--                        @blur="search"-->
<!--                    >-->
<!--                        <i slot="prefix" class="el-input__icon el-icon-search"></i>-->
<!--                    </el-input>-->
<!--                </el-form-item>-->
<!--                <el-form-item>-->
<!--                    <div class="el-input__select">-->
<!--                        <el-select-->
<!--                            placeholder="应用类型"-->
<!--                            clearable-->
<!--                            v-model="filterData.type"-->
<!--                            suffix-icon="CaretBottom"-->
<!--                            @change="search"-->
<!--                        >-->
<!--                            <el-option-->
<!--                                v-for="(item, index) in typeOptions"-->
<!--                                :key="index"-->
<!--                                :value="item.value"-->
<!--                                :label="item.label"-->
<!--                            ></el-option>-->
<!--                        </el-select>-->
<!--                    </div>-->
<!--                </el-form-item>-->
<!--            </el-form>-->
<!--        </div>-->
        <div class="list-head">
            <div class="list-head__item t2">报告名称</div>
            <div class="list-head__item t1">生成日期</div>
        </div>
        <div
            class="list-body"
            v-loading="loading"
            element-loading-text="加载中..."
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
        >
            <template v-if="list.length > 0">
                <vue-seamless
                    :data="list"
                    :class-option="optionHover"
                    class="seamless-warp"
                >
                    <div
                        class="list-body__item"
                        v-for="(item, index) in list"
                        :key="index"
                    >
                        <div class="item-name t2">{{ item.name }}</div>
                        <div class="item-index t1">
                            <!-- <div class="index" :class="`index${index + 1}`">
                              {{ index + 1 }}
                            </div> -->
                            {{ item.regionname }}
                        </div>
<!--                        <div class="item-value t3">{{ priceFormat(item.totalValue) }}</div>-->
                    </div>
                </vue-seamless>
            </template>
            <template v-else>
                <empty></empty>
            </template>
        </div>
    </div>
</template>

<script>
import {priceFormat} from "@/utils/common";
import vueSeamless from "vue-seamless-scroll";
import empty from "../../../../components/empty";
import {debounce} from "lodash";

export default {
    components: {
        vueSeamless,
        empty,
    },
    props: {
        list: {
            type: Array,
            default: () => [],
        },
        loading: {
            type: Boolean,
            default: false,
        },
        typeOptions: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {
            priceFormat,
            optionHover: {
                step: 0.5,
            },
            filterData: {
                name: "",
                type: "VEP",
            },
        };
    },
    mounted() {
        // this.search = debounce(this.search, 1000)
    },
    methods: {
        search() {
            this.$emit("search", this.filterData);
        },
    },
};
</script>

<style lang="less" scoped>
.table {
    .t1 {
        width: 30%;
    }

    .t2 {
        width: 70%;
        text-align: center;
    }

    .t3 {
        width: 20%;
    }
}

.list {

    &-head {
        font-size: 16px;
        font-family: Alibaba-PuHuiTi, Alibaba-PuHuiTi;
        font-weight: normal;
        color: #fff;
        line-height: 22px;
        display: flex;
        padding: 25px 0 8px;
        background: url("./images/fg.png") no-repeat 0 bottom;
        background-size: 602px 2px;
        .table;
    }

    &-body {
        height: 250px;
        overflow: hidden;

        &__item {
            display: flex;
            align-items: center;
            justify-items: center;
            font-size: 16px;
            font-family: Alibaba-PuHuiTi, Alibaba-PuHuiTi;
            font-weight: normal;
            color: #ffffff;
            line-height: 16px;
            height: 56px;
            padding-left: 50px;
            padding-right: 20px;
            .table;

            &:hover {
                background: url("./images/xz.png") no-repeat 0 0;
                background-size: 612px 56px;
            }

            .item-index {
                padding: 8px 0 12px 0;

                .index {
                    width: 20px;
                    height: 20px;
                    background: #33b5ff;
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
                padding: 8px 0 12px 0;
                text-align: left;
            }

            .item-value {
                padding: 8px 0 12px 0;
                color: #10d7f1;
            }
        }
    }
}

.form {
    padding-top: 8px;
    text-align: left;

    /deep/ .el-form-item {
        margin-bottom: 4px;

        .el-form-item__label {
            font-size: 14px;
            font-family: Alibaba-PuHuiTi, Alibaba-PuHuiTi;
            font-weight: normal;
            color: #fff;
            line-height: 30px;
            text-align: left;
        }

        .el-form-item__content {
            line-height: 30px;

            .el-input {
                .el-input__inner {
                    background: rgba(0, 0, 0, 0.21);
                    height: 30px;
                    line-height: 30px;
                    border-radius: 0;
                    color: rgba(82, 192, 255, 1);
                    width: 210px;
                    box-shadow: inset 0 0 9px 0 rgba(0, 132, 255, 0.95);
                    border: 1px solid #00a5ff;
                    font-size: 14px;

                    &::placeholder {
                        color: rgba(82, 192, 255, 1);
                    }
                }

                .el-input__prefix {
                    line-height: 30px;

                    .el-input__icon {
                        line-height: 30px;
                        font-size: 14px;
                        color: rgba(82, 192, 255, 1);
                    }
                }
            }

            .el-input__select {
                text-align: right;
                display: flex;
                justify-content: flex-end;
                width: 113px;

                .el-input__inner {
                    background-color: transparent;
                    border: none;
                    border-radius: 0;
                    font-size: 14px;
                    font-weight: 500;
                    color: rgba(82, 192, 255, 1);
                    line-height: 30px;
                    height: 30px;
                    width: 113px;
                    background-image: url("../../../../assets/images/common/input-bg.png");
                    background-repeat: no-repeat;
                    background-position: 0 0;
                    background-size: contain;
                    box-shadow: none;
                    padding: 0 10px;

                    &::placeholder {
                        color: rgba(82, 192, 255, 1);
                    }
                }

                .el-input__suffix {
                    margin-right: 10px;
                }

                .el-select__caret {
                    transform: rotateZ(0deg);

                    &.el-input__icon {
                        line-height: 32px;

                        &.is-reverse {
                            transform: rotateZ(180deg);
                        }
                    }

                    &.el-input__icon::before {
                        content: "\e790";
                        color: rgba(79, 186, 248, 1);
                        position: absolute;
                        width: 100%;
                        height: 100%;
                        top: 50%;
                        left: 50%;
                        font-size: 12px;
                        transform: translate(-50%, -50%);
                    }
                }
            }
        }
    }
}
</style>