import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		userInfo: null
	},
	getters: {
	},
	mutations: {
		saveLoginUserInfo(state, value){
			state.userInfo = value;
		}
	},
	actions: {}
})
export default store
