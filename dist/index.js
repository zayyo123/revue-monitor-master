import { timing, ComponentMount, ComponentBlank } from "./comp/index";
import jsError from "./comp/jsError";
import wsError from "./comp/wsError";
import httpError, { injectFetch, injectXHR } from "./comp/httpError";
import bussiness from "./comp/bussiness";
import topic from "./comp/topic";

// registLifecallBack函数用于注册生命周期回调函数
function registLifecallBack(key, callBack) {
  // 将 callBack 注册为一个回调函数，并使用 key 作为主题
  // 当主题为 key 的事件被触发时，callBack 将会被执行
  topic.on(callBack, key);
}
export default {
  // install函数用于安装插件并提供全局API
  install(Vue, options) {
    // 挂载在Vue.js 的原型中
    Vue.prototype.$revue = {
      timing: timing.t, //用于跟踪应用程序中各个组件的渲染和更新时间。
      compnentMount: ComponentMount.m, //用于跟踪应用程序中各个组件的挂载和卸载时间。
      blankScreen: ComponentBlank.b, //用于跟踪应用程序是否白屏
      wsError: wsError, //用于捕获 WebSocket 错误并进行上报
      injectFetch, //用于捕获和监控 fetch 请求
      injectXHR, //用于捕获和监控 XMLHttpRequest 请求
      bussiness, //用于记录和跟踪应用程序中的业务逻辑
    };
  },
  // immediate函数用于立即执行插件的初始化代码
  immediate: {
    install(Vue, options) {
      ComponentBlank.b();
      timing.t(Vue, options);
      Vue.mixin(ComponentMount.m);
      jsError.install(Vue);
      wsError();
      injectFetch();
      injectXHR();
      bussiness.bs();
      Vue.prototype.$revue = {
        timing: timing.t,
        compnentMount: ComponentMount.m,
        blankScreen: ComponentBlank.b,
        wsError: wsError,
        injectFetch,
        injectXHR,
        bussiness,
      };
    },
  },
  registLifecallBack,
};

export {
  timing,
  ComponentMount,
  ComponentBlank,
  jsError,
  wsError,
  httpError,
  topic,
};
