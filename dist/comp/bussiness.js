// 主要功能是向服务器发送一pv+uv数据PV (Page Views)，UV (Unique Visitors) 表示独立访客数。 表示页面浏览量。收集我们网站的
import http from "../utils/request";
import onload from "../utils/onload";

function business() {
  let connection = navigator.connection;
  // 在完整加载完成后自动执行
  onload(function () {
    http.post("/plugin/business", {
      kind: "business",
      type: "pv+uv",
      origin: window.location.origin, // 当前页面所在的域名
      effectiveType: connection.effectiveType, //表示设备的网络连接环境
      timeStamp: Date.now(), //表示当前时间戳
    });
  });
}

export default {
  install(Vue, options) {
    const oldRevue = Vue.prototype.$revue;
    // 使用Object.assign将business方法合并到oldRevue原型对象中。
    Vue.prototype.$revue = Object.assign({}, oldRevue, {
      business,
    });
  },
  // 安装后立即执行的方法
  immediate: {
    install(Vue, options) {
      business();
      const oldRevue = Vue.prototype.$revue;
      Vue.prototype.$revue = Object.assign({}, oldRevue, {
        business,
      });
    },
  },
  // 还暴露了一个名为bs的方法，用于调用business方法
  bs: business,
};
