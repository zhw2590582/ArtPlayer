self.onmessage = (event: MessageEvent<number>) => {
  self.postMessage(event.data + 1)
}
