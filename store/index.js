import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const defaultTip = {
    type: '',
    title: '',
    body: ''
}

const omit = (props, obj) => {
    props.forEach(prop => delete obj[prop])
    return obj;
}

const store = () =>
    new Vuex.Store({
        state: {
            username: '',
            token: '',
            avatar: '/avatar/init.jpg',
            description: '我懒得写简介！',
            tags: [{ "text": "快乐", "bgColor": { "hsl": { "h": 0, "s": 0.7950820799240518, "l": 0.609111785, "a": 1 }, "hex": "#EB4C4C", "rgba": { "r": 235, "g": 76, "b": 76, "a": 1 }, "hsv": { "h": 0, "s": 0.6757, "v": 0.9198999999999999, "a": 1 }, "oldHue": 0, "source": "hsva", "a": 1 }, "color": { "rgba": { "r": 255, "g": 255, "b": 255, "a": 1 } } }, { "text": "土豪金", "bgColor": { "rgba": { "r": 3, "g": 255, "b": 223, "a": 1 } }, "color": { "rgba": { "r": 15, "g": 45, "b": 255, "a": 1 } } }, { "text": "有颜", "color": { "rgba": { "r": 45, "g": 255, "b": 255, "a": 1 } }, "bgColor": { "rgba": { "r": 255, "g": 54, "b": 255, "a": 1 } } }],
            message_count: 0,
            tip: defaultTip,
            comment_show: false,
            edit_text: '',
            reback_history_url: '',
            isAdmin : false,
        },
        mutations: {
            login(state, payload) {
                return Object.assign(state, payload)
            },
            set_admin(state, payload){
                state.isAdmin = payload
            },
            reback_history_url(state, payload){
                state.reback_history_url = payload
            },
            toggle_comment(state, payload){
                if (!payload) {
                   return state.comment_show = !state.comment_show
                }
                state.comment_show = payload
            },
            set_edit_text(state, payload){
                state.edit_text = payload
            },
            logout(state) {
                return Object.assign(state, {
                    username: '',
                    token: '',
                    avatar: '',
                    message_count: 0,
                    isAdmin: false
                })
            },
            setTip(state, payload) {
                state.tip = payload
            },
            resetTip(state) {
                state.tip = defaultTip
            }
        },
        actions: {
            setTip({ commit }, tip) {
                commit('setTip', omit(['sec'], tip))
                if (window.resetTipTimer) {
                    clearTimeout(window.resetTipTimer)
                }
                window.resetTipTimer = setTimeout(() => {
                    commit('resetTip')
                }, tip.sec || 5000);
            }
        }
    })

export default store