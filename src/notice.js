export default class Notice {
  constructor(art) {
    this.art = art;
  }

  show(msg) {
    const { refs: { $notice } } = this.art;
    $notice.style.display = 'block';
    $notice.innerHTML = msg instanceof Error ? msg.message.trim() : msg;
  }

  hide() {
    const { refs: { $notice } } = this.art;
    $notice.style.display = 'none';
  }
}
