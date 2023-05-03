// 定义了一个默认导出的函数，该函数接受一个回调函数作为参数。函数的作用是在文档加载完成后调用回调函数。

export default function (callback) {
  if (document.readyState === "complete") {
    callback();
  } else {
    window.addEventListener("load", callback);
  }
}
