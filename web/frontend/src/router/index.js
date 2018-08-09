import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import Index from '@/view/Index'
import Login from '@/view/Login'

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
        },
        {
            path: '/login',
            name: 'Login',
            component: Login
        }
    ]
})
