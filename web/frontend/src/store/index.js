/**
 * Created by Thierry on 2017/5/16.
 */
import Vue from 'vue'
import Vuex from 'vuex'
import currentUser from './modules/current-user'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
    modules: {
        currentUser
    },
    strict: debug
})
