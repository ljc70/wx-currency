import Vue from 'vue'
import App from './App'
import './assets/stylus/flag.css'
import { api } from './api/flyio.js'
import MpvueRouterPatch from 'mpvue-router-patch'

Vue.use(MpvueRouterPatch)
Vue.config.productionTip = false
App.mpType = 'app'
Vue.prototype.$api = api

const app = new Vue(App)
app.$mount()
