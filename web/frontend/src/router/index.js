import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import Index from '@/view/Index'
import YueMei from '@/view/YueMei'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'Index',
            component: Index,
            children: [
                {
                    path: '/yuemei',
                    component: YueMei,
                    alias: '/'
                }
            ]
        }
    ]
})
