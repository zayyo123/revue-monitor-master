// 该插件的功能是用于测量组件的挂载时间
import http from "../utils/request";

let mixin = {
  beforeCreate() {
    // 如果当前组件配置选项中包含了computeTime属性，则将组件创建时的时间戳记录在组件实例的createTime属性中
    let shouldcompute = this.$options.computeTime;
    if (!shouldcompute) return;
    this.createTime = new Date().getTime();
  },
  mounted() {
    let shouldcompute = this.$options.computeTime;
    // 如果当前组件配置选项中包含了computeTime属性，则将组件挂载完成的时间戳记录在组件实例的endTime属性中，并计算出组件的挂载时间mountTime
    if (!shouldcompute) return;
    this.endTime = new Date().getTime();
    let mountTime = this.endTime - this.createTime;
    // 获取组件的名称
    let componentNameArr = this.$vnode.tag.split("-");
    let componentName = componentNameArr[componentNameArr.length - 1];

    http.post("plugin/mount", {
      kind: "experience",
      type: "ComponentMountTime",
      componentName,
      mountTime,
      timeStamp: Date.now(),
    });
  },
};

export default {
  install(Vue, options) {
    const oldRevue = Vue.prototype.$revue;
    Vue.prototype.$revue = Object.assign({}, oldRevue, {
      compnentMount: mixin,
    });
    // Vue.mixin(mixin)
  },
  immediate: {
    install(Vue, options) {
      Vue.mixin(mixin);
    },
  },
  m: mixin,
};
