import Vue from 'vue';
import md from './md';

Vue.use({
    install(_Vue) {
        _Vue.prototype.$markdown = md
    }
})
