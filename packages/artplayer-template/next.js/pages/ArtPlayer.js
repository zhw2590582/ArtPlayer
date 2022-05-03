import { useEffect, useRef } from "react";
import Artplayer from "artplayer";

export default function ({ option, getInstance, ...rest }) {
  const artRef = useRef();

  useEffect(() => {
    const art = new Artplayer({
      ...option,
      container: artRef.current,
    });

    if (getInstance && typeof getInstance === "function") {
      getInstance(art);
    }

    return () => {
      if (art && art.destroy) {
        art.destroy(false);
      }
    };
  }, [option, getInstance]);

  return <div ref={artRef} {...rest}></div>;
}
