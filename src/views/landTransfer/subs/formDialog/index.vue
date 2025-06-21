<template>
    <div class="ds-dialog" v-show="show">
        <div class="ds-dialog__wrapper">
            <div class="ds-dialog__content">
                <page-title>自动核算</page-title>
                <div class="ds-dialog__close" @click="close">
                    <i class="el-icon-close"></i>
                </div>
                <div class="container">
                    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="75px" class="demo-ruleForm">
                        <el-form-item label="项目名称：" prop="projectName">
                            <el-input v-model="ruleForm.projectName"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button @click="close('ruleForm')">取消</el-button>
                            <el-button type="primary" @click="submit('ruleForm')">确定</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import pageTitle from '@/components/title'

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
    },
    data() {
        return {
            ruleForm: {
                projectName: '默认地块',
                params1: '',
                params2: '',
            },
            rules: {
                name: [
                    { required: true, message: '请输入活动名称', trigger: 'blur' },
                    { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                ],
                projectName: [
                    { required: true, message: '请选择活动区域', trigger: 'change' }
                ],
                date1: [
                    { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
                ],
                date2: [
                    { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
                ],
                type: [
                    { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
                ],
                resource: [
                    { required: true, message: '请选择活动资源', trigger: 'change' }
                ],
                desc: [
                    { required: true, message: '请填写活动形式', trigger: 'blur' }
                ]
            },
        }
    },
    watch: {
        show(val) {
            if (val) {
            }
        }
    },
    methods: {
        close() {
            this.$emit('close')
        },
        submit(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$emit('submit', this.ruleForm)
                    this.close()
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
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
        width: 520px;
        height: 213px;
        background: rgba(6, 39, 85, 0.92);
        border-radius: 4px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        box-sizing: border-box;

        .container {
            display: flex;
            justify-content: space-between;
            padding: 25px 58px;
            min-width: unset;

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

.el-form {
    //background: rgba(7, 46, 98, 0.69);
    //border-radius: 4px;
    //padding: 18px 18px 1px 18px;
    /deep/ .el-button {
        font-size: 14px;
        padding: 8px 25px;;
        text-align: center;
        box-shadow: 0px 0px 8px 0px rgba(72,129,255,0.58);
        background: linear-gradient(171deg, rgba(72, 129, 255, 0.65), rgba(72, 129, 255, 0.36), rgba(72, 129, 255, 0.54), rgba(72, 129, 255, 0.65), rgba(72, 129, 255, 1)) 1 1;
        font-weight: normal;
        border-radius: 25px;
        border: none;

        &.el-button--primary {
            background: rgba(72,129,255,0.52);
            color: #FFFFFF;
        }
        &.el-button--default {
            color: #666;
        }
    }
    /deep/ .el-form-item {
        margin-bottom: 18px;

        .el-select {
            width: 100%;
        }

        .el-form-item__label {
            font-size: 14px;
            font-family: Alibaba-PuHuiTi, Alibaba-PuHuiTi;
            font-weight: normal;
            color: #D7DBE1;
            line-height: 32px;
        }
        .el-form-item__content {
            line-height: 32px;
        }
        .el-input {
            input {
                color: #fff;
                height: 32px;
                line-height: 32px;
                background: rgba(2,22,51,0.52);
                border: 1px solid #325EA2;
                font-size: 14px;

                &::placeholder {
                    color: #fff;
                    font-size: 14px;
                }
            }
        }
        .el-input__suffix {
            .el-input__icon {
                line-height: 32px;
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
                    //background-image: url("../../../../assets/images/common/input-arrow.png");
                    //background-repeat: no-repeat;
                    //background-size: 9px 5px;
                    //background-position: 0 center;
                }
            }
        }
    }
}
</style>