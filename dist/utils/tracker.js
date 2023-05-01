import axios from "axios";

const service = axios.create({
  baseURL:
    "https://koa-monitorrver-koa-dxsjkmwnnu.cn-hangzhou.fcapp.run/api/mp",
  timeout: 15000,
  headers: {
    Accept: "application/json",
    "Conetent-Type": "application/json",
  },
});

export default {
  postHTTP(data = {}) {
    //console.log("log", data);
    return service.post("/plugin/http", data).then((response) => {
      //console.log("发送成功", response);
    });
  },
};
