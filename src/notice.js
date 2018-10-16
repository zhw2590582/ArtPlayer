export default class Notice {
  constructor(art) {
    this.art = art;
    this.timer = null;
  }

  show(msg, autoHide) {
    const { refs: { $notice } } = this.art;
    $notice.style.display = 'block';
    $notice.innerHTML = msg instanceof Error ? msg.message.trim() : msg;
    if (autoHide) {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.hide();
      }, 1000);
    }
  }

  hide() {
    const { refs: { $notice } } = this.art;
    $notice.style.display = 'none';
  }
}
