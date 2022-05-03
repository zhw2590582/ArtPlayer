import { useRef } from "react";
import Artplayer from "./Artplayer";

export default function Home() {
  const option = useRef({
    url: "https://artplayer.org/assets/sample/video.mp4",
    autoSize: true,
  });

  return (
    <Artplayer
      option={option.current}
      style={{
        width: "600px",
        height: "400px",
        margin: "60px auto 0",
      }}
      getInstance={(art) => console.log(art)}
    />
  );
}
