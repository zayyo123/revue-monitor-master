// 定义了一个默认导出的函数，该函数接受一个回调函数作为参数。函数的作用是在文档加载完成后调用回调函数。
// 通过在文档加载完成后执行回调函数，可以确保页面的所有元素和资源已经加载完成，并且可以安全地操作和访问它们

export default function (callback) {
  // ，使用 document.readyState 属性检查文档是否已经完成加载。如果 document.readyState 为 complete，则表示文档已经完成加载，此时可以直接调用回调函数。
  if (document.readyState === "complete") {
    callback();
  } else {
    // 如果文档尚未加载完成，则使用 window.addEventListener 方法监听 load 事件，当文档完成加载后，该事件将被触发，回调函数也将被调用
    window.addEventListener("load", callback);
  }
}
