import Vue from 'vue';
import ElementUI from 'element-ui';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import 'element-ui/lib/theme-default/index.css';
// import Axios from 'axios';
import App from './App.vue';
import Home from './modules/Home.vue';


// Vue.prototype.$http = Axios; // 类似于vue-resource的调用方法

Vue.use(ElementUI);
Vue.use(VueRouter);
Vue.use(VueResource);


const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    {
      path: '/',
      component: Home,
    },
    {
      path: '*',
      redirect: '/',
    },
  ],
});

const app = new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
