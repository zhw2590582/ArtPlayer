---
title: Use with React Portal
sidebar_position: 6
---

It is also very easy to use `React Components` in `layers`, `contextmenu`, `controls`, and `setting`. Handle more complex logic through `ReactDOM.createPortal`.

👉 [Click to open an online demo](https://codesandbox.io/s/artplayer-react-portal-5z32h)

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
