/**
 * Created by LiuQingtao on 2018/8/9.
 */
const prefix = 'reptile_'

export default {
    /**
     * Get object from localStorage
     *
     * @param {string} key
     * @return {any}
     */
    get (key) {
        let ret = window.localStorage.getItem(prefix + key)
        if (ret) {
            return JSON.parse(ret)
        }
        return null
    },

    /**
     * Set object for localStorage
     *
     * @param {string} key
     * @param {any} value
     * @return {boolean}
     */
    set (key, value) {
        window.localStorage.setItem(prefix + key, JSON.stringify(value))
        return true
    },

    /**
     * Remove object from localStorage
     *
     * @param {string} key
     * @return {boolean}
     */
    remove (key) {
        window.localStorage.removeItem(prefix + key)
        return true
    }
}
