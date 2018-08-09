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
            <el-dropdown>
                <i class="el-icon-setting" style="margin-right: 15px"></i>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>查看</el-dropdown-item>
                    <el-dropdown-item>新增</el-dropdown-item>
                    <el-dropdown-item>删除</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <span>{{ userInfo.name }}</span>
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
                name: '柳青涛',
                id: 1,
                portrait: ''
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
</style>
