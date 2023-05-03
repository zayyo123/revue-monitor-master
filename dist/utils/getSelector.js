// 这个函数的作用是将这个 DOM 元素数组转换为一个字符串选择器
// getSelectors接收一个数组参数，
function getSelectors(path) {
  // 先翻转我们的元素的顺序，接着过滤掉任何等于 document 或 window 的元素
  return (
    path
      .reverse()
      .filter((element) => {
        return element !== document && element !== window;
      })
      .map((element) => {
        let selector = "";
        if (element.id) {
          // 检查元素是否具有 id 属性。如果是，它将元素的标签名和 id 属性值拼接成一个 nodeName#id 的格式，并返回这个字符串选择器。
          return `${element.nodeName.toLowerCase()}#${element.id}`;
        } else if (element.className && typeof element.className === "string") {
          // 接着检查是否具有 className 属性，并且该属性的值是一个字符串。如果是，它将元素的标签名和 className 属性值拼接成一个 nodeName.className 的格式，并返回这个字符串选择器。
          return `${element.nodeName.toLowerCase()}.${element.className}`;
        } else {
          // 将元素的标签名转换为小写字母，并将其作为选择器的名称。
          selector = element.nodeName.toLowerCase();
        }
        // 如果以上情况都不满足，则将元素的 nodeName 属性作为选择器。
        return selector;
      })
      // 最后，使用 join() 方法将所有选择器连接成一个空格分隔的字符串返回。
      .join(" ")
  );
}

export default function (pathsOrTarget) {
  if (Array.isArray(pathsOrTarget)) {
    return getSelectors(pathsOrTarget);
  } else {
    let path = [];
    while (pathsOrTarget) {
      //也有可有是一个对象
      let path = [];
      // 使用一个 while 循环来迭代每个父元素，直到到达 DOM 树的根节点。在循环中，每个父元素都被推入 path 数组中。
      while (pathsOrTarget) {
        path.push(pathsOrTarget);
        pathsOrTarget = pathsOrTarget.parentNode;
      }
      return getSelectors(path);
    }
  }
}
