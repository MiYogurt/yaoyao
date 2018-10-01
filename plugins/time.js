import time from 'timeago.js';
import Vue from 'vue';

Vue.use({
    install(Vue) {
        Vue.filter('ago', function (value) {
            return time().format(value, 'zh_CN')
        });

        Vue.filter('k', function(value) {
            if(value >= 1000) {
                value = value / 1000
                value = value.toFixed(1)
                return value + 'k'
            }
            return value 
        })
        Vue.filter('color', function(rgb) {
            return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
        })
    }
})