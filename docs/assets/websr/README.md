# Network Weights

There are 3 Anime4k networks implemented:

* [cnn-2x-s](https://github.com/bloc97/Anime4K/blob/master/glsl/Upscale/Anime4K_Upscale_CNN_x2_S.glsl)
* [cnn-2x-m](https://github.com/bloc97/Anime4K/blob/master/glsl/Upscale/Anime4K_Upscale_CNN_x2_M.glsl)
* [cnn-2x-l](https://github.com/bloc97/Anime4K/blob/master/glsl/Upscale/Anime4K_Upscale_CNN_x2_VL.glsl)

The original Anime4K network weights are stored in:`cnn-2x-s-an.json`, `cnn-2x-m-an.json` and `cnn-2x-l-an.json`.

I have also retrained the same networks for Real Life and 3D content (e.g. `cnn-2x-m-rl.json` for Real Life content, or `cnn-2x-m-3d.json`). These were trained on data from [Xiph](https://media.xiph.org/video/derf/), however the upscaling results qualitatively don't seem as good as Anime4K weights on animated content. 

I will continue working on improving the networks and training strategy.
