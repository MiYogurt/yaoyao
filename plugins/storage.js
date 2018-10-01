import upyun from 'upyun';
import Vue from 'vue';
import Parse from 'create-api';
Vue.use({
    install(Vue) {
        const bucket = new upyun.Bucket('52yaoyao')
        function getHeaderSign(bucket, method, path) {
            return Parse().Cloud.run('img_sign', {
                method,
                bucket,
                path
            }).then(a => {
                console.log(a)
                return a
            })
        }
        const client = new upyun.Client(bucket, getHeaderSign)
        Vue.prototype.$upyun = client
    }
})