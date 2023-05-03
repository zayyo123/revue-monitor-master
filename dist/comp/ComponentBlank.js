// 功能监测页面是否是白屏
import onload from "../utils/onload";
import http from "../utils/request";

// 检查页面上是否有一定数量的包裹元素（如html、body、#app），如果这些元素都消失了，那么就可以判定页面出现了白屏
let blankScreen = () => {
  let wrapperElements = ["html", "body", "#app"];
  let emptyPoints = 0;

  function getSelector(element) {
    // 判断元素是否有 id，如果有，则返回 # 加上该元素的 id
    if (element.id) {
      return "#" + element.id;
      // 判断该元素是否有 className
    } else if (element.className) {
      //如果有 className，则将其转换为 a b c => .a.b.c
      return (
        // 将元素的class属性值中的空格分隔的多个类名拆分成一个数组，然后通过filter()方法过滤掉空字符串，最后使用join()方法将过滤后的数组元素通过"."拼接成一个字符串作为返回值
        "." +
        element.className
          .split(" ")
          .filter((item) => !!item)
          .join(".")
      );
    } else {
      // 返回该元素的标签名（小写）
      return element.nodeName.toLowerCase();
    }
  }

  function isWrapper(element) {
    let selector = getSelector(element);
    // 检查是否在wrapperElements数组中出现，如果出现，则将（emptyPoints）加1
    if (wrapperElements.indexOf(selector) !== -1) {
      emptyPoints++;
    }
  }

  onload(function () {
    // 从网页中间向九个方向各取一个点
    for (let i = 1; i <= 9; i++) {
      // 获取这些点上的元素
      let xElements = document.elementsFromPoint(
        // 屏幕中横向和纵向的9个点的坐标
        // 分别是屏幕宽度的1/10, 2/10, 3/10, ..., 9/10和屏幕高度的1/2，
        (window.innerWidth * i) / 10,
        window.innerHeight / 2
      );
      let yElements = document.elementsFromPoint(
        // 以及屏幕宽度的1/2和屏幕高度的1/10, 2/10, 3/10, ..., 9/10
        window.innerWidth / 2,
        (window.innerHeight * i) / 10
      );
      // 判断指定元素是否是wrapperElements数组中的其中一个
      isWrapper(xElements[0]);
      isWrapper(yElements[0]);
    }

    // 如果（emptyPoints 大于等于 18）则屏幕中心区域没有内容,出现白屏现象
    if (emptyPoints >= 18) {
      // 获取屏幕中心点元素
      let centerElements = document.elementsFromPoint(
        window.innerWidth / 2,
        window.innerHeight / 2
      );

      http.post("/plugin/blank", {
        kind: "stability",
        type: "blank",
        emptyPoints,
        screen: window.screen.width + "X" + window.screen.height, //屏幕的宽度
        viewPoint: window.innerWidth + "X" + window.innerHeight, //屏幕的高度
        timeStamp: Date.now(),
        selector: getSelector(centerElements[0]), //获取屏幕中心点元素
      });
    }
  });
};

export default {
  install(Vue, options) {
    const oldRevue = Vue.prototype.$revue;
    Vue.prototype.$revue = Object.assign({}, oldRevue, {
      blankScreen,
    });
  },
  immediate: {
    install(Vue, options) {
      blankScreen();
      const oldRevue = Vue.prototype.$revue;
      Vue.prototype.$revue = Object.assign({}, oldRevue, {
        blankScreen,
      });
    },
  },
  b: blankScreen,
};
