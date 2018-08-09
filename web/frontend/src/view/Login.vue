<template>
    <div class='login-box'>
        <el-form :model="ruleForm2" status-icon ref="ruleForm2" label-width="100px"
                 class="demo-ruleForm">
            <el-form-item label="账号" prop="pass">
                <el-input type="number" v-model="ruleForm2.user" ></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="pass">
                <el-input type="password" v-model="ruleForm2.pass"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm">登录</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    data () {
        return {
            ruleForm2: {
                pass: '',
                user: ''
            }
        }
    },
    methods: {
        submitForm (formName) {
            var info = {
                user: this.user,
                pass: this.pass
            }
            this.$requestPost('/login/_data', info).then(() => {

            })
        }
    }
}
</script>
<style>
    .login-box{
        width: 400px;
        margin: 100px auto 0;
    }
    .title{
        font-size: 18px;
        line-height: 40px;
        text-align: center;
    }
</style>
