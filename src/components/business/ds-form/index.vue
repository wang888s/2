<template>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="75px" class="demo-ruleForm">
        <el-form-item label="名称" prop="projectName">
            <el-select v-model="ruleForm.projectName" placeholder="请选择名称">
                <el-option label="默认地块" value="默认地块"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="参数1">
            <el-input v-model="ruleForm.params1"></el-input>
        </el-form-item>
        <el-form-item label="参数2">
            <el-input v-model="ruleForm.params2"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button @click="resetForm('ruleForm')">取消</el-button>
            <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
export default {
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
            }
        };
    },
    methods: {
        getModelValue () {
            return this.ruleForm
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    alert('submit!');
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        }
    }
}
</script>

<style lang="less" scoped>
.el-form {
    background: rgba(7, 46, 98, 0.69);
    border-radius: 4px;
    padding: 18px 18px 1px 18px;
    /deep/ .el-button {
        font-size: 14px;
        padding: 8px 14px;;
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