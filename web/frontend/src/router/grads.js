/**
 * Created by LiuQingtao on 2018/8/9.
 */
import store from '@/store'

export default {
    current (to, form, next) {
        let user = store.getters.currentUser
        console.log(user)
        if (!user) {
            next({ name: 'login' })
        } else {
            next()
        }
    }
}
