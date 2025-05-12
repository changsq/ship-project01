// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import iView from 'iview'
import config from '@/config'
import axios from 'axios'
import VueAxios from 'vue-axios'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './index.less'
import '@/assets/icons/iconfont.css'
import TreeTable from 'tree-table-vue'
import VOrgTree from 'v-org-tree'
import 'v-org-tree/dist/v-org-tree.css'
import Vue2OrgTree from 'vue-tree-color'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import echarts from 'echarts';
import BaiduMap from "vue-baidu-map";
// 实际打包时应该不引入mock
/* eslint-disable */
//                                                                                                                    
Vue.use(Antd);
Vue.use(iView)
Vue.prototype.$echarts = echarts 
Vue.use(ElementUI);
Vue.use(Vue2OrgTree)
Vue.use(TreeTable)
Vue.use(VOrgTree)
Vue.use(VueAxios, axios)
Vue.use(BaiduMap,{
  ak:'Qh5pv44Eldfzx4SL6CFj7bBtji63YwGx'
});
Vue.prototype.$axios = axios;

/**
 * @description 生产环境关掉提示
 */
Vue.config.productionTip = false
/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
