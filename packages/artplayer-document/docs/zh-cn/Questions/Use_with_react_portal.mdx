---
title: 与 React Portal 使用
sidebar_position: 6
---

在 layers、contextmenu、controls 里使用 react 组件也是非常容易的事，通过 createPortal 处理更复杂的业务逻辑

👉 [点击打开在线演示](https://codesandbox.io/s/artplayer-react-portal-5z32h)

```jsx
import React, { useState, useEffect } from "react";
import ReactDOM, { createPortal } from "react-dom";
import Artplayer from "artplayer/examples/react/Artplayer";

function Timer({ time }) {
  return <div>{time}</div>;
}

function App() {
  const [art, setArt] = useState(null);
  const [time, setTime] = useState(0);

  useEffect(() => {
    const update = () => setTime((time) => time + 1);
    setInterval(update, 1000);
  }, []);

  return (
    <div>
      <Artplayer
        option={{
          url: "https://artplayer.org/assets/sample/video.mp4",
          layers: [
            {
              html: "",
              name: "portal"
            }
          ],
          controls: [
            {
              position: "right",
              name: "portal",
              html: ""
            }
          ]
        }}
        style={{
          width: "600px",
          height: "400px",
          margin: "60px auto 0"
        }}
        getInstance={(art) => {
          art.on("ready", () => setArt(art));
        }}
      />
      {art ? createPortal(<Timer time={time} />, art.layers.portal) : null}
      {art ? createPortal(<Timer time={time} />, art.controls.portal) : null}
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
```
