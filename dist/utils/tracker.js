import axios from "axios";

// 用axios实例的create方法创建网络请求
const service = axios.create({
  // 请求的共同URL部分
  baseURL:
    "https://koa-monitorrver-koa-dxsjkmwnnu.cn-hangzhou.fcapp.run/api/mp",
    // 请求超时时间
  timeout: 15000,
  // 请求头的设置
  headers: {
    Accept: "application/json",
    "Conetent-Type": "application/json",
  },
});

export default {
  postHTTP(data = {}) {
    // 发生一个post请求
    // 在baseURL的基础上拼接上"/plugin/http"
    return service.post("/plugin/http", data).then((response) => {
    });
  },
};
