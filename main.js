import Vue from 'vue'
import App from './App'
import store from './store'
import cuCustom from './colorui/components/cu-custom.vue'
import { toast, loading, toLogin, toBack, toHome, reLunchBack, randomString, imageCheck } from './utils/global.js'


Vue.config.productionTip = false
Vue.component('cu-custom',cuCustom)

Vue.prototype.$store = store
Vue.prototype.$loading = loading
Vue.prototype.$toast = toast
Vue.prototype.$toLogin = toLogin
Vue.prototype.$toBack = toBack
Vue.prototype.$toHome = toHome
Vue.prototype.$reLunchBack = reLunchBack
Vue.prototype.$randomString = randomString
Vue.prototype.$imageCheck = imageCheck

App.mpType = 'app'

const app = new Vue({
    ...App,
	//挂载
	store
})
app.$mount()
