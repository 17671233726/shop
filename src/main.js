import Vue from 'vue'
import App from './App.vue'

import router from "./router/index"

//element-ui引入
import element from "./plugins/element-ui"

//vue-table-with-tree-grid引入
import TreeTable from 'vue-table-with-tree-grid';
Vue.component('tree-table', TreeTable);

import './assets/css/normalize.css'
import './assets/fonts/iconfont.css'

Vue.config.productionTip = false
/*
被其他同学乱删改或者自己手残了
API接口地址：http://www.ysqorz.top:8888/api/private/v1/
评论区的提供的API的数据库的测试数据每天都被很多同学改动或者删除，于是我索性用SpringBoot写了个程序每天凌晨2点定时将数据库的数据重置为老师提供的数据。并且为了方便某些紧急情况，还提供了重置数据库的API接口。随时只需要访问：
http://www.ysqorz.top:8091/vueshop/reset
就可以重置数据库的数据了。一般耗时50多秒，成功会返回类似“用时：52.253秒”
*/
new Vue({
  render: h => h(App),
  router
}).$mount('#app')
