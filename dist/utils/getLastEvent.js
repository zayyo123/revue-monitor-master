// 该函数返回最近一次的用户事件对象，例如点击、触摸、鼠标按下、键盘按下或鼠标移动事件对象。

// 先定义了一个 lastEvent 变量用于存储最近一次的事件对象
let lastEvent;
// 然后通过 forEach 方法遍历了包含了五个不同事件类型的数组，并通过 document.addEventListener 方法给 document 对象添加事件监听器然后通过 forEach 方法遍历了包含了五个不同事件类型的数组，并通过 document.addEventListener 方法给 document 对象添加事件监听器
["click", "touchstart", "mousedown", "keydown", "mouseover"].forEach(
  (eventType) => {
    document.addEventListener(
      eventType,
      (event) => {
        // 将事件对象赋值给 lastEvent 变量，以记录最近一次的事件对象
        lastEvent = event;
      },
      {
        capture: true, //表示在捕获阶段触发事件监听器
        passive: true, //默认不阻止默认事件
      }
    );
  }
);

export default function () {
  return lastEvent;
}
