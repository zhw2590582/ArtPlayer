import bodymovin from "lottie-web/build/player/lottie_light.min.js";


export const createAnimation = (options) => {
    const { name, dom, json,loop = false, autoplay = false  } = options;
    return bodymovin.loadAnimation({
        name,
        animationData: json,
        container: dom,
        renderer: "svg",
        loop,
        autoplay,
    });
}