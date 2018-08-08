<template>
    <div>
        <el-table
            :data="list"
            border
            stripe
        >
            <el-table-column prop="topic_id" label="日记id" width="140" class-name="gm-color-blue" align="center">
                <template slot-scope="scope">
                    <a :href="'https://www.yuemei.com/c/' + scope.row.topic_id + '.html'" target="_blank">{{ scope.row.topic_id }}</a>
                </template>
            </el-table-column>
            <el-table-column label="头像" width="120" align="center" >
                <template slot-scope="scope" style="text-align: center">
                    <img :src="scope.row.portrait" alt="">
                </template>
            </el-table-column>
            <el-table-column prop="content" label="内容"  style="">
            </el-table-column>
        </el-table>
        <el-pagination
            background
            layout="prev, pager, next"
            :total="1000"
            @current-change="pagination"
        >
        </el-pagination>
    </div>
</template>
<script>
export default {
    name: 'yuemei',
    data () {
        return {
            list: []
        }
    },
    mounted () {
        this.getData()
    },
    methods: {
        getData (page) {
            var pages = page || 1
            var count = 10
            var _this = this
            this.$request.get(`/api/yuemei/_data?page=${pages}&count=${count}`).then(res => {
                _this.list = res.data.data
            })
        },
        pagination (val) {
            this.getData(val)
        }
    }

}
</script>
<style>
</style>
