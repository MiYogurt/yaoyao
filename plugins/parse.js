import Vue from 'vue'

Vue.use({install(Vue) {
  Vue.prototype.$parse = require('create-api').default()
  let model = {};

  ['Tag','Post', 'Category','Message'].forEach((name) => {
    model[name] = Vue.prototype.$parse.Object.extend(name)
    model[name].query = () => new Vue.prototype.$parse.Query(model[name]);
  })

  Vue.prototype.$model = model

  Vue.prototype.$fetchBase = function(name) {
    let query = this.$model[name].query()
    return query.find()
  };

}})

