<template>

<el-container style="">
    <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
        <div>
            <h3 class="logo-icon">数据展示</h3>
        </div>
        <ul class="nav-list">
            <li>悦美日记</li>
        </ul>
    </el-aside>

    <el-container>
        <el-header style="text-align: right; font-size: 12px">
            <el-dropdown trigger="click" @command="handleCommand">
                <i class="el-icon-setting" style="margin-right: 15px"></i>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="exit">退出</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <img :src="userInfo.portrait" alt="" class="portrait">
            <span>{{ userInfo.userName }}</span>
        </el-header>

        <el-main>
            <div class="main">
                <router-view/>
            </div>
        </el-main>
    </el-container>
</el-container>
</template>

<script>
export default {
    data () {
        return {
            userInfo: {
                userName: '',
                id: '',
                portrait: ''
            }
        }
    },
    created () {
        this.userInfo = this.$store.getters.currentUser
    },
    methods: {
        handleCommand (command) {
            if (command === 'exit') {
                this.$store.dispatch('deleteUser')
                this.$router.push('/login')
            }
        }
    }
}
</script>
<style>
    .el-header {
        background-color: #B3C0D1;
        color: #333;
        line-height: 60px;
    }

    .el-aside {
        color: #333;
    }
    .nav-list{
        background: #fff;
    }
    .nav-list li{
        display: block;
        padding: 15px 40px;
        font-size: 14px;
    }
    .logo-icon{
        line-height: 60px;
        color: #000;
        font-size: 18px;
        font-weight: 600;
        text-align: center;
    }
    .portrait{
        width: 20px;
        border-radius: 50%;
        margin: -3px 5px 0 -8px;
    }
</style>
