import Clipboard from 'clipboard';
import Vue from 'vue';

function clipboard(text, event) {
    console.log(event);
    const cb = new Clipboard('.null', {
        text: () => text
    });
    cb.on('success', function (e) {
        console.log(e);
        cb.off('error');
        cb.off('success');
    });
    cb.on('error', function (e) {
        console.log(e);
        cb.off('error');
        cb.off('success');
    });
    cb.onClick(event);
}

const plugin = {
    install(Vue, options) {
        Vue.prototype.$clip = clipboard
    }
}

Vue.use(plugin)