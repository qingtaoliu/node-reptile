<template>
    <div class='login-box'>
        <el-form :model="info" status-icon ref="info" label-width="100px"
                 class="demo-ruleForm">
            <el-form-item label="账号" prop="pass">
                <el-input type="text" v-model="info.user" ></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="pass">
                <el-input type="password" v-model="info.pass"></el-input>
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
            info: {
                pass: '',
                user: ''
            }
        }
    },
    methods: {
        submitForm () {
            var info = {
                user: this.info.user,
                pass: this.info.pass
            }
            this.$requestPost('/api/login/_data', info).then((res) => {
                if (res.data.error === 0) {
                    this.$store.dispatch('createUser', res.data.data)
                    this.$router.push('/')
                } else {
                    this.$message({
                        message: res.data.message,
                        center: true,
                        type: 'error',
                        duration: 1000
                    })
                }
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
