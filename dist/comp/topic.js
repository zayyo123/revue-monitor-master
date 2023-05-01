class Topic {
  eventList = {}
  on(callback, event) {
    ;(this.eventList[event] || (this.eventList[event] = [])).push(callback)
  }
  emit(event, ...arr) {
    this.eventList[event] && this.eventList[event].forEach(e => {
      e(...arr)
    });
  }
}

const topic = new Topic()

export default topic