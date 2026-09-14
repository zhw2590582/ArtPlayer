export const css = `
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #242424;
  .console-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #eee;
    padding: 7px 10px;
    font-size: 12px;
    background-color: #111;
    border-bottom: 1px solid rgb(255 255 255 / 10%);
    user-select: none;
    .console-header-left {
      display: flex;
      align-items: center;
      .console-header-number {
        margin-left: 5px;
        color: rgba(255, 255, 255, 0.4);
      }
    }
    .console-header-right {
      cursor: pointer;
    }
  }
  .console-component {
    scroll-behavior: smooth;
    position: relative;
    overflow: auto;
    height: 200px;
    flex: 1;
  }
`
