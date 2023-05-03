// 监控网络请求错误
// user-agent 是一个 Node.js 模块，它用于解析用户代理字符串，通过 User-Agent，我们可以知道用户使用的浏览器和操作系统是什么，以及他们是否正在使用移动设备。
let userAgent = require("user-agent");
import tracker from "../utils/tracker";

// 监控网页中的fetch请求
export function injectFetch() {
  if (!window.fetch) return;
  let oldFetch = window.fetch;
  // 重写fetch函数
  window.fetch = function (url, obj = { method: "GET", body: "" }) {
    let startTime = Date.now();
    // 调用旧的 fetch 函数
    return oldFetch
      .apply(this, arguments)
      .then((response) => {
        // 当请求不成功时，将请求的相关信息发送到一个服务器上
        if (!response?.ok) {
          //console.log("test", response);
          // True if status is HTTP 2xx
          tracker.postHTTP({
            title: document.title,
            url: location.href, //location本身是一个对象，包含当前url有关的信息
            timeStamp: Date.now(),
            userAgent: userAgent.parse(navigator.userAgent).fullName, //通过我们自己安装的userAgent把数据转化成一个对象
            //navigator对象包含了有关浏览器的信息
            kind: "stability",
            type: "fetch",
            method: obj.method,
            statusCode: response.status,
            eventType: response.type, //load error abort
            pathName: url, //请求路径
            status: response.status + "-" + response.statusText, //状态码
            duration: Date.now() - startTime, //持续时间
            response: "",
            params: obj.body || "",
          });
        }
      })
      .catch((error) => {
        // 上报错误
        //console.error("I am error", error);
        tracker.postHTTP({
          title: document.title,
          url: location.href, //location本身是一个对象，包含当前url有关的信息
          timeStamp: Date.now(),
          userAgent: userAgent.parse(navigator.userAgent).fullName, //通过我们自己安装的userAgent把数据转化成一个对象
          //navigator对象包含了有关浏览器的信息
          kind: "stability",
          type: "fetch",
          method: obj.method,
          statusCode: "network error",
          eventType: "error", //load error abort
          pathName: url, //请求路径
          status: "network error", //状态码
          duration: Date.now() - startTime,
          response: "", //持续时间
          params: obj.body || "",
        });
        // throw error;
      });
  };
}

export function injectXHR() {
  let XMLHttpRequest = window.XMLHttpRequest;
  let oldOpen = XMLHttpRequest.prototype.open; //缓存老的open方法
  XMLHttpRequest.prototype.open = function (method, url, async) {
    //重写open方法
    if (!/mp\/plugin/.test(url)) {
      //tracker会向sls发送日志的，所以不监控这个，否则会引起死循环
      this.logData = { method, url, async }; //增强功能,把初始化数据保存为对象的属性
    }
    return oldOpen.apply(this, arguments);
  };

  let oldSend = XMLHttpRequest.prototype.send; //缓存老的send方法
  XMLHttpRequest.prototype.send = function (body) {
    //重写sned方法
    if (this.logData) {
      //如果有值，说明已经被拦截了
      let startTime = Date.now(); //在发送之前记录开始时间
      let handler = (type) => (e) => {
        let duration = Date.now() - startTime; //在结束时记录经过的时间
        let status = this.status; //200 or 500
        if (parseInt(status) === 200) return;
        let statusText = this.statusText; // or Server Error
        let data = {
          title: document.title,
          url: location.href, //location本身是一个对象，包含当前url有关的信息
          timeStamp: Date.now(),
          userAgent: userAgent.parse(navigator.userAgent).fullName, //通过我们自己安装的userAgent把数据转化成一个对象
          //navigator对象包含了有关浏览器的信息
          kind: "stability",
          type: "xhr",
          method: this.logData.method,
          statusCode: status,
          eventType: type, //load error abort
          pathName: this.logData.url, //请求路径
          status: status + "-" + statusText, //状态码
          duration, //持续时间
          response: this.response ? JSON.stringify(this.response) : "", //响应体
          params: body || "",
        };
        tracker.postHTTP(data);
      };
      this.addEventListener("load", handler("load"), false); //传输完成，所有数据保存在 response 中
      this.addEventListener("error", handler("error"), false); //500也算load,只有当请求发送不成功时才是error
      this.addEventListener("abort", handler("abort"), false); //放弃
      //handler("load")相当于1个柯理化
    }
    return oldSend.apply(this, arguments);
  };
}

export const reWsError = {
  install() {
    const oldRevue = Vue.prototype.$revue;
    Vue.prototype.$revue = Object.assign({}, oldRevue, {
      injectFetchm,
      injectXHR,
      injectFetch,
    });
  },
  immediate: {
    install() {
      const oldRevue = Vue.prototype.$revue;
      Vue.prototype.$revue = Object.assign({}, oldRevue, {
        injectFetchm,
        injectXHR,
        injectFetch,
      });
      injectFetch();
      injectXHR();
    },
  },
};

export default function httpError() {
  injectFetch();
  injectXHR();
}
