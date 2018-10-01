import Vue from 'vue'

Vue.use({
    install: (Vue) => {

        Vue.prototype.msg_success = function(title, body, sec) {
            this.$store.dispatch('setTip', {
                type: 'success',
                title,
                body,
                sec
            })
        }

        Vue.prototype.msg_error = function(title, body, sec) {
            this.$store.dispatch('setTip', {
                type: 'error',
                title,
                body,
                sec
            })
        }

    }
})