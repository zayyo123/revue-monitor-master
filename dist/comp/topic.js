class Topic {
  eventList = {};
  // 订阅回调函数
  on(callback, event) {
    (this.eventList[event] || (this.eventList[event] = [])).push(callback);
  }
  // 触发指定事件并执行相应的回调函数
  emit(event, ...arr) {
    this.eventList[event] &&
      this.eventList[event].forEach((e) => {
        e(...arr);
      });
  }
}

const topic = new Topic();

export default topic;
