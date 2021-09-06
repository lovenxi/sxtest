import Vue from 'vue';
import './plugins/axios'
import Antd from 'ant-design-vue';
import App from './App';
import 'ant-design-vue/dist/antd.css';
import router from "./router/index.js";
import axios from 'axios';

Vue.prototype.$http = axios.create({
  headers: {"Content-Type": "application/json"},
  baseURL: "http://127.0.0.1:8081/api/v1",
  proxy: {
    host: "127.0.0.1",
    port: "8081",
  }
}),
Vue.config.productionTip = false;

Vue.use(Antd);

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");