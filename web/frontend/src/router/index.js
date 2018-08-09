import Vue from 'vue'
import Router from 'vue-router'
import grads from './grads.js'

import Index from '@/view/Index'
import Login from '@/view/Login'

import YueMei from '@/view/YueMei'

Vue.use(Router)
export default new Router({
    routes: [
        {
            path: '/',
            name: 'index',
            component: Index,
            beforeEnter: grads.current,
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
            name: 'login',
            component: Login
        }
    ]
})
