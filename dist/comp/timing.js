import onload from "../utils/onload";
import http from "../utils/request";

let timing = () => {
  let FMP, LCP;

  // FMP 是 First Meaningful Paint 的缩写，表示页面的首次有意义绘制时间，即页面显示出有意义的内容的时间点
  if (PerformanceObserver) {
    // 增加一个性能条目的观察者
    new PerformanceObserver((entryList, observer) => {
      let perfEntries = entryList.getEntries();
      FMP = perfEntries[0]; //startTime 2000以后
      observer.disconnect(); //停止观察了
    }).observe({ entryTypes: ["element"] }); //观察页面中所以的element元素

    // LCP 指 Largest Contentful Paint，是衡量页面加载性能的一个指标。它衡量的是页面中最大的可见元素（例如图片或文本）的渲染时间
    new PerformanceObserver((entryList, observer) => {
      let perfEntries = entryList.getEntries();
      LCP = perfEntries[0];
      observer.disconnect(); //不再观察了
    }).observe({ entryTypes: ["largest-contentful-paint"] }); //观察页面中的最大的元素
  }

  //用户的第一次交互 点击页面,页面的加载时间
  onload(function () {
    setTimeout(() => {
      const { fetchStart, loadEventStart } = performance.timing; //fetchStart浏览器开始获取文档的时间和 loadEventStart页面的 load 事件触发时间
      let FP = performance.getEntriesByName("first-paint")[0];
      let FCP = performance.getEntriesByName("first-contentful-paint")[0];
      let loadTime = loadEventStart - fetchStart;
      //开始发送性能指标
      //console.log('FP', FP)
      //console.log('FCP', FCP)
      //console.log('FMP', FMP)
      //console.log('LCP', LCP)
      http.post("/plugin/paint", {
        kind: "experience", //用户体验指标
        type: "paint", //统计每个阶段的时间
        firstPaint: FP.startTime,
        firstContentfulPaint: FCP.startTime,
        firstMeaningfulPaint: FMP?.startTime || -1,
        largestContentfulPaint: LCP?.startTime || -1,
        timeStamp: Date.now(),
      });
      http.post("/plugin/load", {
        kind: "experience", //用户体验指标
        type: "load", //统计每个阶段的时间
        loadTime,
        timeStamp: Date.now(),
      });
    }, 3000);
  });
};

export default {
  install(Vue, options) {
    const oldRevue = Vue.prototype.$revue;
    Vue.prototype.$revue = Object.assign({}, oldRevue, {
      timing,
    });
  },
  immediate: {
    install(Vue, options) {
      timing(Vue, options);
      const oldRevue = Vue.prototype.$revue;
      Vue.prototype.$revue = Object.assign({}, oldRevue, {
        timing,
      });
    },
  },
  t: timing,
};
