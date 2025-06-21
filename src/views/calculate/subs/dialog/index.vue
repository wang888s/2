<template>
    <div class="ds-dialog" v-show="show">
        <div class="ds-dialog__wrapper">
            <div class="ds-dialog__content">
                <page-title>核算结果详情 - {{property.projectName}}</page-title>
                <div class="ds-dialog__close" @click="close">
                    <i class="el-icon-close"></i>
                </div>
                <div class="container">
<!--                    <section class="container-left">-->
<!--                        <div class="field" v-for="(item, index) in fieldList" :key="index">-->
<!--                            <div class="field-title">{{ item.label }}</div>-->
<!--                            <div class="field-content">{{ item.value }}</div>-->
<!--                        </div>-->
<!--                    </section>-->
<!--                    <section class="container-right">-->
<!--                        <div class="field">-->
<!--                            <div class="field-title">详细信息</div>-->
<!--                            <div class="field-content">-->
                                <mini-table :tableValue="property"></mini-table>
<!--                            </div>-->
<!--                        </div>-->
<!--                    </section>-->
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import pageTitle from '@/components/title'
import miniTable from "./subs/miniTable";

export default {
    name: 'ds-dialog',
    props: {
        show: {
            default: false
        },
        property: {
            default: () => ({})
        }
    },
    components: {
        pageTitle,
        miniTable,
    },
    data() {
        return {
            fieldList: [
                {label: '项目名称', value: '-', key: 'projectName'},
            ],
        }
    },
    watch: {
        show(val) {
            if (val) {
                this.resetFieldList();
            }
        }
    },
    methods: {
        close() {
            this.$emit('close')
        },
        resetFieldList() {
            this.getList('fieldList')
        },
        getList(key) {
            this[key].forEach(item => {
                item.value = this.property[item.key]
            })
            this.fieldList = this[key].map(item => ({...item}))
        }
    }
}
</script>

<style lang="less" scoped>
.ds-dialog {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    z-index: 999;

    &__close {
        position: absolute;
        top: 18px;
        right: 18px;
        color: #33B5FF;
        font-size: 16px;
        cursor: pointer;
    }

    &__wrapper {
        background: rgba(0, 0, 0, 0.52);
        width: 100vw;
        height: 100vh;
        position: relative;
    }

    &__content {
        width: 860px;
        background: rgba(6, 39, 85, 0.92);
        border-radius: 4px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        box-sizing: border-box;

        .container {
            //display: flex;
            justify-content: space-between;
            padding: 10px 35px;
            min-width: unset;

            .container-left {
                width: 525px;
            }

            .field {
                text-align: left;
                margin-bottom: 24px;

                .image-wrapper {
                    width: 148px;
                    height: 91px;
                    margin-right: 10px;
                }

                &-title {
                    font-size: 18px;
                    font-family: Alibaba-PuHuiTi, Alibaba-PuHuiTi;
                    font-weight: normal;
                    color: #82A5D4;
                    line-height: 25px;
                    padding-left: 25px;
                    position: relative;
                    margin-bottom: 5px;

                    &:before {
                        content: "";
                        width: 6px;
                        height: 6px;
                        border: 2px solid #0D7EC5;
                        position: absolute;
                        top: 50%;
                        transform: translateY(-50%);
                        left: 0;
                        border-radius: 100%;
                    }
                }

                &-content {
                    font-size: 18px;
                    font-family: Alibaba-PuHuiTi, Alibaba-PuHuiTi;
                    font-weight: normal;
                    color: #FFFFFF;
                    line-height: 25px;
                    padding-left: 25px;
                }
            }
        }
    }
}
</style>