let imageState = null;
let realtimeState = null;

self.onmessage = async (event) => {
  const { data } = event;
  if (!data || !data.cmd) return;

  const { cmd } = data;

  try {
    switch (cmd) {
      case "isSupported": {
        self.postMessage({ cmd: "supported", data: true });
        break;
      }

      case "init": {
        const { upscaled, original, resolution, imageMimeType } = data.data;
        imageState = {
          upscaled,
          original,
          resolution,
          mimeType: imageMimeType || "image/png",
          bitmap: null,
        };
        break;
      }

      case "network": {
        if (!imageState) break;
        const { imageArrayBuffer, imageMimeType } = data.data;
        const mime = imageMimeType || imageState.mimeType || "image/png";

        const blob = new Blob([imageArrayBuffer], { type: mime });
        const bitmap = await createImageBitmap(blob);
        imageState.bitmap = bitmap;

        const origCtx = imageState.original.getContext("2d");
        const upCtx = imageState.upscaled.getContext("2d");

        if (origCtx) {
          origCtx.clearRect(0, 0, imageState.original.width, imageState.original.height);
          origCtx.drawImage(
            bitmap,
            0,
            0,
            imageState.original.width,
            imageState.original.height,
          );
        }

        if (upCtx) {
          upCtx.clearRect(0, 0, imageState.upscaled.width, imageState.upscaled.height);
          upCtx.drawImage(
            bitmap,
            0,
            0,
            imageState.upscaled.width,
            imageState.upscaled.height,
          );
        }
        break;
      }

      case "getImageBlob": {
        if (!imageState || !imageState.upscaled) break;
        const blob = await imageState.upscaled.convertToBlob({
          type: imageState.mimeType || "image/png",
        });
        self.postMessage({ cmd: "imageBlob", imageBlob: blob });
        break;
      }

      case "process": {
        const { file } = data;
        if (file instanceof Blob) {
          self.postMessage({ cmd: "videoBlob", videoBlob: file });
        }
        break;
      }

      case "getVideoBlob": {
        break;
      }

      case "realtimeInit": {
        const { upscaled, resolution } = data.data;
        const ctx = upscaled.getContext("2d");
        realtimeState = {
          upscaled,
          ctx,
          resolution,
        };
        break;
      }

      case "realtimeFrame": {
        if (!realtimeState || !realtimeState.ctx) break;
        const { frame } = data;
        if (!frame) break;

        const { ctx, upscaled } = realtimeState;
        try {
          ctx.clearRect(0, 0, upscaled.width, upscaled.height);
          ctx.drawImage(frame, 0, 0, upscaled.width, upscaled.height);
        } finally {
          if (typeof frame.close === "function") {
            frame.close();
          }
        }
        break;
      }

      default:
        break;
    }
  } catch (err) {
    console.error('[Worker] error', err);
    self.postMessage({ cmd: "error", message: String(err && err.message ? err.message : err) });
  }
};

(() => {
  var __webpack_modules__ = {
      217: (e, t, n) => {
        var r = n(614),
          i = n.n(r);
        class s {
          constructor(e, t, n) {
            ((this.gl = e),
              (this.canvas = n),
              (this.resolution = t),
              (this.textures = {}),
              (this.framebuffers = {}),
              (this.debug = !0),
              (n.width = 2 * t.width),
              (n.height = 2 * t.height));
          }
          texture(e, t) {
            if (!this.textures[e]) {
              const n = this.gl,
                r = (t = t || {}).width || this.resolution.width,
                i = t.height || this.resolution.height,
                s = void 0 !== t.format ? t.format : n.RGBA32F,
                o = void 0 !== t.filter ? t.filter : n.NEAREST,
                a = n.createTexture();
              if (!a) throw new Error(`Failed to create texture: ${e}`);
              if ((n.bindTexture(n.TEXTURE_2D, a), s === n.RGBA32F))
                n.texImage2D(
                  n.TEXTURE_2D,
                  0,
                  n.RGBA32F,
                  r,
                  i,
                  0,
                  n.RGBA,
                  n.FLOAT,
                  null,
                );
              else if (s === n.R32F)
                n.texImage2D(
                  n.TEXTURE_2D,
                  0,
                  n.R32F,
                  r,
                  i,
                  0,
                  n.RED,
                  n.FLOAT,
                  null,
                );
              else {
                if (s !== n.RGBA)
                  throw new Error(`Unsupported texture format: ${s}`);
                n.texImage2D(
                  n.TEXTURE_2D,
                  0,
                  n.RGBA,
                  r,
                  i,
                  0,
                  n.RGBA,
                  n.UNSIGNED_BYTE,
                  null,
                );
              }
              (n.texParameteri(n.TEXTURE_2D, n.TEXTURE_WRAP_S, n.CLAMP_TO_EDGE),
                n.texParameteri(
                  n.TEXTURE_2D,
                  n.TEXTURE_WRAP_T,
                  n.CLAMP_TO_EDGE,
                ),
                n.texParameteri(n.TEXTURE_2D, n.TEXTURE_MIN_FILTER, o),
                n.texParameteri(n.TEXTURE_2D, n.TEXTURE_MAG_FILTER, o),
                (this.textures[e] = a));
            }
            return this.textures[e];
          }
          createTextureFromImage(e, t) {
            const n = this.gl;
            let r = this.textures[e];
            if (!r) {
              if (((r = n.createTexture()), !r))
                throw new Error(`Failed to create texture from image: ${e}`);
              this.textures[e] = r;
            }
            return (
              n.bindTexture(n.TEXTURE_2D, r),
              n.texImage2D(n.TEXTURE_2D, 0, n.RGBA, n.RGBA, n.UNSIGNED_BYTE, t),
              n.texParameteri(n.TEXTURE_2D, n.TEXTURE_WRAP_S, n.CLAMP_TO_EDGE),
              n.texParameteri(n.TEXTURE_2D, n.TEXTURE_WRAP_T, n.CLAMP_TO_EDGE),
              n.texParameteri(n.TEXTURE_2D, n.TEXTURE_MIN_FILTER, n.LINEAR),
              n.texParameteri(n.TEXTURE_2D, n.TEXTURE_MAG_FILTER, n.LINEAR),
              r
            );
          }
          framebuffer(e, t) {
            if (!this.framebuffers[e]) {
              const n = this.gl,
                r = n.createFramebuffer();
              if (!r) throw new Error(`Failed to create framebuffer: ${e}`);
              n.bindFramebuffer(n.FRAMEBUFFER, r);
              for (let e = 0; e < t.length; e++) {
                const r = this.textures[t[e]];
                if (!r) throw new Error(`Texture not found: ${t[e]}`);
                n.framebufferTexture2D(
                  n.FRAMEBUFFER,
                  n.COLOR_ATTACHMENT0 + e,
                  n.TEXTURE_2D,
                  r,
                  0,
                );
              }
              const i = n.checkFramebufferStatus(n.FRAMEBUFFER);
              if (i !== n.FRAMEBUFFER_COMPLETE)
                throw new Error(`Framebuffer incomplete: ${e}, status: ${i}`);
              this.framebuffers[e] = r;
            }
            return this.framebuffers[e];
          }
          readTexture(e) {
            return (
              (t = this),
              (r = function* () {
                const t = this.gl,
                  n = this.textures[e];
                if (
                  (console.log("Texture"), console.log(e), console.log(n), !n)
                )
                  throw new Error(`Texture not found: ${e}`);
                const r = t.createFramebuffer();
                (t.bindFramebuffer(t.FRAMEBUFFER, r),
                  t.framebufferTexture2D(
                    t.FRAMEBUFFER,
                    t.COLOR_ATTACHMENT0,
                    t.TEXTURE_2D,
                    n,
                    0,
                  ));
                let i = this.resolution.width,
                  s = this.resolution.height;
                (e.includes("pixel_shuffle") || e.includes("output")) &&
                  ((i = 2 * this.resolution.width),
                  (s = 2 * this.resolution.height));
                const o = new Float32Array(i * s * 4);
                return (t.readPixels(0, 0, i, s, t.RGBA, t.FLOAT, o), o);
              }),
              new ((n = void 0) || (n = Promise))(function (e, i) {
                function s(e) {
                  try {
                    a(r.next(e));
                  } catch (e) {
                    i(e);
                  }
                }
                function o(e) {
                  try {
                    a(r.throw(e));
                  } catch (e) {
                    i(e);
                  }
                }
                function a(t) {
                  var r;
                  t.done
                    ? e(t.value)
                    : ((r = t.value),
                      r instanceof n
                        ? r
                        : new n(function (e) {
                            e(r);
                          })).then(s, o);
                }
                a((r = r.apply(t, [])).next());
              })
            );
            var t, n, r;
          }
        }
        const o = class {
            constructor(e) {
              ((this.weights = e),
                (this.context = globalThis.context),
                (this.layers = this.model()));
            }
            model() {
              return [];
            }
            lastLayer() {
              return this.layers[this.layers.length - 1];
            }
            feedForward(e) {
              return (
                (t = this),
                (r = function* () {
                  if ((this.context.gl, e)) {
                    const t =
                      e instanceof ImageBitmap ? e : yield createImageBitmap(e);
                    ((this.context.input = this.context.createTextureFromImage(
                      "input",
                      t,
                    )),
                      this.layers.length > 0 &&
                        (this.layers[0].inputTextures[0] = this.context.input));
                  }
                  this.layers.forEach((e) => {
                    e.run();
                  });
                }),
                new ((n = void 0) || (n = Promise))(function (e, i) {
                  function s(e) {
                    try {
                      a(r.next(e));
                    } catch (e) {
                      i(e);
                    }
                  }
                  function o(e) {
                    try {
                      a(r.throw(e));
                    } catch (e) {
                      i(e);
                    }
                  }
                  function a(t) {
                    var r;
                    t.done
                      ? e(t.value)
                      : ((r = t.value),
                        r instanceof n
                          ? r
                          : new n(function (e) {
                              e(r);
                            })).then(s, o);
                  }
                  a((r = r.apply(t, [])).next());
                })
              );
              var t, n, r;
            }
          },
          a = class {
            constructor(e, t, n) {
              ((this.context = globalThis.context),
                (this.gl = this.context.gl),
                (this.resolution = this.context.resolution),
                (this.inputTextures = e),
                (this.outputTexture = t),
                (this.weights = n));
            }
            vertexShader() {
              return "#version 300 es\n        in vec2 a_position;\n        in vec2 a_texCoord;\n        out vec2 v_texCoord;\n\n        void main() {\n            gl_Position = vec4(a_position, 0.0, 1.0);\n            // Flip Y axis (WebGL Y=0 at bottom, textures Y=0 at top)\n            v_texCoord = vec2(a_texCoord.x, 1.0 - a_texCoord.y);\n        }";
            }
            fragmentShader() {
              throw new Error(
                "fragmentShader() must be implemented by subclass",
              );
            }
            compileShader(e, t) {
              const n = this.gl,
                r = n.createShader(e);
              if (!r)
                throw new Error(`Failed to create shader for ${this.label}`);
              if (
                (n.shaderSource(r, t),
                n.compileShader(r),
                !n.getShaderParameter(r, n.COMPILE_STATUS))
              ) {
                const e = n.getShaderInfoLog(r);
                throw new Error(
                  `Shader compile error in ${this.label}: ${e}\n\nSource:\n${t}`,
                );
              }
              return r;
            }
            createProgram() {
              const e = this.gl,
                t = this.compileShader(e.VERTEX_SHADER, this.vertexShader()),
                n = this.compileShader(
                  e.FRAGMENT_SHADER,
                  this.fragmentShader(),
                ),
                r = e.createProgram();
              if (!r)
                throw new Error(`Failed to create program for ${this.label}`);
              if (
                (e.attachShader(r, t),
                e.attachShader(r, n),
                e.linkProgram(r),
                !e.getProgramParameter(r, e.LINK_STATUS))
              ) {
                const t = e.getProgramInfoLog(r);
                throw new Error(`Program link error in ${this.label}: ${t}`);
              }
              ((this.program = r), e.deleteShader(t), e.deleteShader(n));
            }
            setupGeometry() {
              const e = this.gl,
                t = e.createVertexArray();
              if (!t) throw new Error(`Failed to create VAO for ${this.label}`);
              e.bindVertexArray(t);
              const n = new Float32Array([
                  -1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1,
                ]),
                r = e.createBuffer();
              (e.bindBuffer(e.ARRAY_BUFFER, r),
                e.bufferData(e.ARRAY_BUFFER, n, e.STATIC_DRAW));
              const i = e.getAttribLocation(this.program, "a_position");
              (e.enableVertexAttribArray(i),
                e.vertexAttribPointer(i, 2, e.FLOAT, !1, 0, 0));
              const s = new Float32Array([0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0]),
                o = e.createBuffer();
              (e.bindBuffer(e.ARRAY_BUFFER, o),
                e.bufferData(e.ARRAY_BUFFER, s, e.STATIC_DRAW));
              const a = e.getAttribLocation(this.program, "a_texCoord");
              (e.enableVertexAttribArray(a),
                e.vertexAttribPointer(a, 2, e.FLOAT, !1, 0, 0),
                (this.vao = t));
            }
            defaultSetup() {
              (this.createProgram(), this.setupGeometry());
            }
            setupUniforms() {
              throw new Error(
                "setupUniforms() must be implemented by subclass",
              );
            }
            run() {
              const e = this.gl;
              (e.useProgram(this.program),
                e.bindVertexArray(this.vao),
                e.bindFramebuffer(e.FRAMEBUFFER, this.framebuffer),
                null === this.framebuffer
                  ? e.viewport(
                      0,
                      0,
                      this.context.canvas.width,
                      this.context.canvas.height,
                    )
                  : e.viewport(
                      0,
                      0,
                      this.resolution.width,
                      this.resolution.height,
                    ),
                e.clearColor(0, 0, 0, 0),
                e.clear(e.COLOR_BUFFER_BIT),
                this.setupUniforms(),
                e.drawArrays(e.TRIANGLES, 0, 6));
            }
          },
          u = class extends a {
            constructor(e, t) {
              (super(e, t), (this.label = "GaussianBlur"));
            }
            fragmentShader() {
              return "#version 300 es\n        precision highp float;\n\n        in vec2 v_texCoord;\n        out vec4 outColor;\n\n        uniform sampler2D u_input;\n        uniform vec2 u_inputSize;\n\n        void main() {\n            // 3x3 Gaussian kernel offsets\n            vec2 offsets[9] = vec2[9](\n                vec2(-1.0, -1.0), vec2(-1.0, 0.0), vec2(-1.0, 1.0),\n                vec2(0.0, -1.0),  vec2(0.0, 0.0),  vec2(0.0, 1.0),\n                vec2(1.0, -1.0),  vec2(1.0, 0.0),  vec2(1.0, 1.0)\n            );\n\n            // Gaussian weights (sum = 16)\n            float weights[9] = float[9](\n                1.0, 2.0, 1.0,\n                2.0, 4.0, 2.0,\n                1.0, 2.0, 1.0\n            );\n\n            vec4 result = vec4(0.0);\n            ivec2 pixelCoord = ivec2(v_texCoord * u_inputSize);\n\n            for (int i = 0; i < 9; i++) {\n                ivec2 sampleCoord = pixelCoord + ivec2(offsets[i]);\n                vec4 texel = texelFetch(u_input, sampleCoord, 0);\n                result += texel * weights[i];\n            }\n\n            result /= 16.0;\n            outColor = result;\n        }";
            }
            setupUniforms() {
              const e = this.gl,
                t = e.getUniformLocation(this.program, "u_inputSize");
              (e.uniform2f(t, this.resolution.width, this.resolution.height),
                e.activeTexture(e.TEXTURE0),
                e.bindTexture(e.TEXTURE_2D, this.inputTextures[0]));
              const n = e.getUniformLocation(this.program, "u_input");
              (e.uniform1i(n, 0),
                e.viewport(
                  0,
                  0,
                  this.resolution.width,
                  this.resolution.height,
                ));
            }
          },
          c = class extends a {
            constructor(e) {
              (super(e, null),
                (this.label = "Display"),
                (this.framebuffer = null));
            }
            fragmentShader() {
              return "#version 300 es\n        precision highp float;\n\n        in vec2 v_texCoord;\n        out vec4 outColor;\n\n        uniform sampler2D u_input;\n\n        void main() {\n            outColor = texture(u_input, v_texCoord);\n        }";
            }
            setupUniforms() {
              const e = this.gl;
              (e.activeTexture(e.TEXTURE0),
                e.bindTexture(e.TEXTURE_2D, this.inputTextures[0]));
              const t = e.getUniformLocation(this.program, "u_input");
              (e.uniform1i(t, 0),
                e.viewport(0, 0, e.canvas.width, e.canvas.height));
            }
            run() {
              const e = this.gl;
              (e.useProgram(this.program),
                e.bindVertexArray(this.vao),
                e.bindFramebuffer(e.FRAMEBUFFER, null),
                e.clearColor(0, 0, 0, 1),
                e.clear(e.COLOR_BUFFER_BIT),
                this.setupUniforms(),
                e.drawArrays(e.TRIANGLES, 0, 6));
            }
          },
          l = class extends a {
            constructor(e, t, n) {
              (super(e, t, n), (this.label = "Conv2D3x4"));
            }
            fragmentShader() {
              return "#version 300 es\n        precision highp float;\n\n        in vec2 v_texCoord;\n        out vec4 outColor;\n\n        uniform sampler2D u_input;\n        uniform vec2 u_inputSize;\n        uniform mat4 u_kernels[9];\n        uniform vec4 u_bias;\n\n        void main() {\n            // 3×3 convolution offsets\n            vec2 offsets[9] = vec2[9](\n                vec2(-1.0, -1.0), vec2(-1.0, 0.0), vec2(-1.0, 1.0),\n                vec2(0.0, -1.0),  vec2(0.0, 0.0),  vec2(0.0, 1.0),\n                vec2(1.0, -1.0),  vec2(1.0, 0.0),  vec2(1.0, 1.0)\n            );\n\n            vec4 result = vec4(0.0);\n            ivec2 pixelCoord = ivec2(v_texCoord * u_inputSize);\n\n            for (int i = 0; i < 9; i++) {\n                ivec2 sampleCoord = pixelCoord + ivec2(offsets[i]);\n                vec4 texel = texelFetch(u_input, sampleCoord, 0);\n                result += u_kernels[i] * texel;\n            }\n\n            result += u_bias;\n            outColor = result;\n        }";
            }
            setupUniforms() {
              const e = this.gl,
                t = e.getUniformLocation(this.program, "u_inputSize");
              e.uniform2f(t, this.resolution.width, this.resolution.height);
              const n = e.getUniformLocation(this.program, "u_bias");
              e.uniform4fv(n, new Float32Array(this.weights.bias));
              for (let t = 0; t < 9; t++) {
                const n = e.getUniformLocation(this.program, `u_kernels[${t}]`),
                  r = this.weights.weights.slice(16 * t, 16 * (t + 1));
                e.uniformMatrix4fv(n, !1, new Float32Array(r));
              }
              (e.activeTexture(e.TEXTURE0),
                e.bindTexture(e.TEXTURE_2D, this.inputTextures[0]));
              const r = e.getUniformLocation(this.program, "u_input");
              (e.uniform1i(r, 0),
                e.viewport(
                  0,
                  0,
                  this.resolution.width,
                  this.resolution.height,
                ));
            }
          },
          f = class extends a {
            constructor(e, t, n) {
              (super(e, t, n), (this.label = "Conv2D8x4"));
            }
            fragmentShader() {
              return "#version 300 es\n        precision highp float;\n\n        in vec2 v_texCoord;\n        out vec4 outColor;\n\n        uniform sampler2D u_input;\n        uniform vec2 u_inputSize;\n        uniform mat4 u_kernels[18];\n        uniform vec4 u_bias;\n\n        void main() {\n            // 3×3 convolution offsets\n            vec2 offsets[9] = vec2[9](\n                vec2(-1.0, -1.0), vec2(-1.0, 0.0), vec2(-1.0, 1.0),\n                vec2(0.0, -1.0),  vec2(0.0, 0.0),  vec2(0.0, 1.0),\n                vec2(1.0, -1.0),  vec2(1.0, 0.0),  vec2(1.0, 1.0)\n            );\n\n            vec4 result = vec4(0.0);\n            ivec2 pixelCoord = ivec2(v_texCoord * u_inputSize);\n\n            // CReLU positive part: max(input, 0)\n            for (int i = 0; i < 9; i++) {\n                ivec2 sampleCoord = pixelCoord + ivec2(offsets[i]);\n                vec4 texel = texelFetch(u_input, sampleCoord, 0);\n                result += u_kernels[i] * max(texel, vec4(0.0));\n            }\n\n            // CReLU negative part: max(-input, 0)\n            for (int i = 0; i < 9; i++) {\n                ivec2 sampleCoord = pixelCoord + ivec2(offsets[i]);\n                vec4 texel = texelFetch(u_input, sampleCoord, 0);\n                result += u_kernels[i + 9] * max(-texel, vec4(0.0));\n            }\n\n            result += u_bias;\n            outColor = result;\n        }";
            }
            setupUniforms() {
              const e = this.gl,
                t = e.getUniformLocation(this.program, "u_inputSize");
              e.uniform2f(t, this.resolution.width, this.resolution.height);
              const n = e.getUniformLocation(this.program, "u_bias");
              e.uniform4fv(n, new Float32Array(this.weights.bias));
              for (let t = 0; t < 18; t++) {
                const n = e.getUniformLocation(this.program, `u_kernels[${t}]`),
                  r = this.weights.weights.slice(16 * t, 16 * (t + 1));
                e.uniformMatrix4fv(n, !1, new Float32Array(r));
              }
              (e.activeTexture(e.TEXTURE0),
                e.bindTexture(e.TEXTURE_2D, this.inputTextures[0]));
              const r = e.getUniformLocation(this.program, "u_input");
              (e.uniform1i(r, 0),
                e.viewport(
                  0,
                  0,
                  this.resolution.width,
                  this.resolution.height,
                ));
            }
          },
          _ = class extends a {
            constructor(e, t) {
              (super(e, t), (this.label = "PixelShuffle"));
            }
            fragmentShader() {
              return "#version 300 es\n        precision highp float;\n\n        in vec2 v_texCoord;\n        out vec4 outColor;\n\n        uniform sampler2D u_input;\n        uniform vec2 u_outputSize;\n\n        void main() {\n            // Output coordinates (0-511 for 512×512)\n            vec2 outputCoord = v_texCoord * u_outputSize;\n\n            // Determine position within 2×2 block\n            uint x_floor = uint(fract(outputCoord.x / 2.0) * 2.0);  // 0 or 1\n            uint y_floor = uint(fract(outputCoord.y / 2.0) * 2.0);  // 0 or 1\n\n            // Channel index: 0=top-left, 1=top-right, 2=bottom-left, 3=bottom-right\n            uint c_index = x_floor + y_floor * 2u;\n\n            // Input coordinates (0-255 for 256×256)\n            ivec2 inputCoord = ivec2(outputCoord / 2.0);\n\n            // Read input pixel's 4 channels\n            vec4 inputPixel = texelFetch(u_input, inputCoord, 0);\n\n            // Select the appropriate channel\n            float value = inputPixel[c_index];\n\n            // Output single channel (R32F format)\n            outColor = vec4(value, 0.0, 0.0, 0.0);\n        }";
            }
            setupUniforms() {
              const e = this.gl,
                t = e.getUniformLocation(this.program, "u_outputSize");
              (e.uniform2f(
                t,
                2 * this.resolution.width,
                2 * this.resolution.height,
              ),
                e.activeTexture(e.TEXTURE0),
                e.bindTexture(e.TEXTURE_2D, this.inputTextures[0]));
              const n = e.getUniformLocation(this.program, "u_input");
              (e.uniform1i(n, 0),
                e.viewport(
                  0,
                  0,
                  2 * this.resolution.width,
                  2 * this.resolution.height,
                ));
            }
          },
          d = class extends a {
            constructor(e, t) {
              (super(e, t), (this.label = "Anime4KDisplay"));
            }
            fragmentShader() {
              return "#version 300 es\n        precision highp float;\n\n        in vec2 v_texCoord;\n        out vec4 outColor;\n\n        uniform sampler2D u_pixelShuffle;  // Upscaled Y channel (512×512)\n        uniform sampler2D u_original;      // Original image (256×256)\n\n        void main() {\n            // Sample upscaled Y channel (pixel shuffle output, 512×512)\n            // Use texelFetch for pixel-perfect sampling\n            float upscaledY = texelFetch(u_pixelShuffle, ivec2(v_texCoord * vec2(512.0)), 0).r;\n\n            // Sample original image with LINEAR filtering (bilinear upscale 256×256 → 512×512)\n            vec4 bicubic = texture(u_original, v_texCoord);\n\n            // Debug: output just the original to see if it's working\n            // outColor = bicubic;\n\n            // Combine: add upscaled Y to enhance luminance\n            outColor = bicubic + vec4(upscaledY);\n        }";
            }
            setupUniforms() {
              const e = this.gl;
              (e.activeTexture(e.TEXTURE0),
                e.bindTexture(e.TEXTURE_2D, this.inputTextures[0]));
              const t = e.getUniformLocation(this.program, "u_pixelShuffle");
              (e.uniform1i(t, 0),
                e.activeTexture(e.TEXTURE1),
                e.bindTexture(e.TEXTURE_2D, this.inputTextures[1]));
              const n = e.getUniformLocation(this.program, "u_original");
              (e.uniform1i(n, 1),
                e.viewport(
                  0,
                  0,
                  2 * this.resolution.width,
                  2 * this.resolution.height,
                ));
            }
            run() {
              const e = this.gl;
              (e.useProgram(this.program),
                e.bindVertexArray(this.vao),
                e.bindFramebuffer(e.FRAMEBUFFER, this.framebuffer),
                e.viewport(
                  0,
                  0,
                  2 * this.resolution.width,
                  2 * this.resolution.height,
                ),
                e.clearColor(0, 0, 0, 0),
                e.clear(e.COLOR_BUFFER_BIT),
                this.setupUniforms(),
                e.drawArrays(e.TRIANGLES, 0, 6));
            }
          },
          p = class extends a {
            constructor(e, t, n) {
              (super(e, t, n), (this.label = "Conv2D16x4"));
            }
            fragmentShader() {
              return "#version 300 es\n        precision highp float;\n\n        in vec2 v_texCoord;\n        out vec4 outColor;\n\n        uniform sampler2D u_input0;\n        uniform sampler2D u_input1;\n        uniform vec2 u_inputSize;\n        uniform mat4 u_kernels[36];\n        uniform vec4 u_bias;\n\n        void main() {\n            // 3×3 convolution offsets\n            vec2 offsets[9] = vec2[9](\n                vec2(-1.0, -1.0), vec2(-1.0, 0.0), vec2(-1.0, 1.0),\n                vec2(0.0, -1.0),  vec2(0.0, 0.0),  vec2(0.0, 1.0),\n                vec2(1.0, -1.0),  vec2(1.0, 0.0),  vec2(1.0, 1.0)\n            );\n\n            vec4 result = vec4(0.0);\n            ivec2 pixelCoord = ivec2(v_texCoord * u_inputSize);\n\n            // Process both inputs with CReLU\n            for (int i = 0; i < 9; i++) {\n                ivec2 sampleCoord = pixelCoord + ivec2(offsets[i]);\n\n                vec4 pix0 = texelFetch(u_input0, sampleCoord, 0);\n                vec4 pix1 = texelFetch(u_input1, sampleCoord, 0);\n\n                // CReLU: positive parts\n                result += u_kernels[i] * max(pix0, vec4(0.0));\n                result += u_kernels[i + 9] * max(pix1, vec4(0.0));\n\n                // CReLU: negative parts\n                result += u_kernels[i + 18] * max(-pix0, vec4(0.0));\n                result += u_kernels[i + 27] * max(-pix1, vec4(0.0));\n            }\n\n            result += u_bias;\n            outColor = result;\n        }";
            }
            setupUniforms() {
              const e = this.gl,
                t = e.getUniformLocation(this.program, "u_inputSize");
              e.uniform2f(t, this.resolution.width, this.resolution.height);
              const n = e.getUniformLocation(this.program, "u_bias");
              e.uniform4fv(n, new Float32Array(this.weights.bias));
              for (let t = 0; t < 36; t++) {
                const n = e.getUniformLocation(this.program, `u_kernels[${t}]`),
                  r = this.weights.weights.slice(16 * t, 16 * (t + 1));
                e.uniformMatrix4fv(n, !1, new Float32Array(r));
              }
              (e.activeTexture(e.TEXTURE0),
                e.bindTexture(e.TEXTURE_2D, this.inputTextures[0]));
              const r = e.getUniformLocation(this.program, "u_input0");
              (e.uniform1i(r, 0),
                e.activeTexture(e.TEXTURE1),
                e.bindTexture(e.TEXTURE_2D, this.inputTextures[1]));
              const i = e.getUniformLocation(this.program, "u_input1");
              (e.uniform1i(i, 1),
                e.viewport(
                  0,
                  0,
                  this.resolution.width,
                  this.resolution.height,
                ));
            }
          },
          h = class extends a {
            constructor(e, t, n, r) {
              (super(e, t, n), (this.label = "Conv2D112x4"), (this.first = r));
            }
            fragmentShader() {
              const e = [];
              for (let t = 0; t < 7; t++) {
                const n = t;
                this.first
                  ? e.push(
                      `\n                vec4 pixel_val${t} = texelFetch(u_input${n}, pixelCoord, 0);\n                result += u_kernels[${4 * t}] * max(pixel_val${t}, vec4(0.0));\n                result += u_kernels[${4 * t + 2}] * max(-pixel_val${t}, vec4(0.0));`,
                    )
                  : e.push(
                      `\n                vec4 pixel_val${t} = texelFetch(u_input${n}, pixelCoord, 0);\n                result += u_kernels[${4 * t + 1}] * max(pixel_val${t}, vec4(0.0));\n                result += u_kernels[${4 * t + 3}] * max(-pixel_val${t}, vec4(0.0));`,
                    );
              }
              return `#version 300 es\n        precision highp float;\n\n        in vec2 v_texCoord;\n        out vec4 outColor;\n\n        uniform sampler2D u_input0;\n        uniform sampler2D u_input1;\n        uniform sampler2D u_input2;\n        uniform sampler2D u_input3;\n        uniform sampler2D u_input4;\n        uniform sampler2D u_input5;\n        uniform sampler2D u_input6;\n        uniform vec2 u_inputSize;\n        uniform mat4 u_kernels[28];\n\n        void main() {\n            vec4 result = vec4(0.0);\n            ivec2 pixelCoord = ivec2(v_texCoord * u_inputSize);\n\n            // Process all 7 inputs with CReLU\n            ${e.join("\n            ")}\n\n            outColor = result;\n        }`;
            }
            setupUniforms() {
              const e = this.gl,
                t = e.getUniformLocation(this.program, "u_inputSize");
              e.uniform2f(t, this.resolution.width, this.resolution.height);
              for (let t = 0; t < 28; t++) {
                const n = e.getUniformLocation(this.program, `u_kernels[${t}]`),
                  r = this.weights.weights.slice(16 * t, 16 * (t + 1));
                e.uniformMatrix4fv(n, !1, new Float32Array(r));
              }
              for (let t = 0; t < 7; t++) {
                (e.activeTexture(e.TEXTURE0 + t),
                  e.bindTexture(e.TEXTURE_2D, this.inputTextures[t]));
                const n = e.getUniformLocation(this.program, `u_input${t}`);
                e.uniform1i(n, t);
              }
              e.viewport(0, 0, this.resolution.width, this.resolution.height);
            }
          },
          x = class extends a {
            constructor(e, t, n) {
              (super(e, t, n), (this.label = "Concat2"));
            }
            vertexShader() {
              return "#version 300 es\n        in vec2 a_position;\n        in vec2 a_texCoord;\n        out vec2 v_texCoord;\n\n        void main() {\n            gl_Position = vec4(a_position, 0.0, 1.0);\n            // No Y-flip to match DisplayLayer3C expectations\n            v_texCoord = a_texCoord;\n        }";
            }
            fragmentShader() {
              return "#version 300 es\n        precision highp float;\n\n        in vec2 v_texCoord;\n        out vec4 outColor;\n\n        uniform sampler2D u_input0;\n        uniform sampler2D u_input1;\n        uniform vec2 u_inputSize;\n        uniform vec4 u_bias;\n\n        void main() {\n            // Input textures were written with Y-flip, so flip when reading\n            vec2 flippedCoord = vec2(v_texCoord.x, 1.0 - v_texCoord.y);\n            ivec2 pixelCoord = ivec2(flippedCoord * u_inputSize);\n\n            // Simple element-wise addition\n            vec4 val0 = texelFetch(u_input0, pixelCoord, 0);\n            vec4 val1 = texelFetch(u_input1, pixelCoord, 0);\n\n            outColor = val0 + val1 + u_bias;\n        }";
            }
            setupUniforms() {
              const e = this.gl,
                t = e.getUniformLocation(this.program, "u_inputSize");
              e.uniform2f(t, this.resolution.width, this.resolution.height);
              const n = e.getUniformLocation(this.program, "u_bias");
              (e.uniform4fv(n, new Float32Array(this.weights.bias)),
                e.activeTexture(e.TEXTURE0),
                e.bindTexture(e.TEXTURE_2D, this.inputTextures[0]));
              const r = e.getUniformLocation(this.program, "u_input0");
              (e.uniform1i(r, 0),
                e.activeTexture(e.TEXTURE1),
                e.bindTexture(e.TEXTURE_2D, this.inputTextures[1]));
              const i = e.getUniformLocation(this.program, "u_input1");
              (e.uniform1i(i, 1),
                e.viewport(
                  0,
                  0,
                  this.resolution.width,
                  this.resolution.height,
                ));
            }
          },
          m = class extends a {
            constructor(e, t) {
              (super(e, t), (this.label = "DisplayLayer3C"));
            }
            fragmentShader() {
              return "#version 300 es\n        precision highp float;\n\n        in vec2 v_texCoord;\n        out vec4 outColor;\n\n        uniform sampler2D u_channel0;  // Upscaled R channel (256×256, 4 values per pixel)\n        uniform sampler2D u_channel1;  // Upscaled G channel (256×256, 4 values per pixel)\n        uniform sampler2D u_channel2;  // Upscaled B channel (256×256, 4 values per pixel)\n        uniform sampler2D u_original;  // Original image (256×256)\n        uniform vec2 u_inputSize;      // 256×256\n\n        // Bicubic weight function (Catmull-Rom)\n        float bicubic_weight(float t) {\n            float abs_t = abs(t);\n            if (abs_t >= 2.0) {\n                return 0.0;\n            }\n\n            float t2 = t * t;\n            float t3 = abs_t * t2;\n\n            if (abs_t <= 1.0) {\n                return 1.5 * t3 - 2.5 * t2 + 1.0;\n            } else {\n                return -0.5 * t3 + 2.5 * t2 - 4.0 * abs_t + 2.0;\n            }\n        }\n\n        // Bicubic sampling function\n        vec3 sampleBicubic(sampler2D tex, vec2 tex_coord) {\n            vec2 tex_size = u_inputSize;\n            vec2 pixel_coord = tex_coord * tex_size - 0.5;\n            vec2 base_coord = floor(pixel_coord);\n            vec2 fract_coord = pixel_coord - base_coord;\n\n            vec3 result = vec3(0.0);\n            float weight_sum = 0.0;\n\n            // Sample 4×4 neighborhood for bicubic\n            for (int y = -1; y <= 2; y++) {\n                for (int x = -1; x <= 2; x++) {\n                    vec2 sample_coord = (base_coord + vec2(float(x), float(y)) + 0.5) / tex_size;\n                    vec3 sample_color = texture(tex, sample_coord).rgb;\n\n                    float weight_x = bicubic_weight(fract_coord.x - float(x));\n                    float weight_y = bicubic_weight(fract_coord.y - float(y));\n                    float weight = weight_x * weight_y;\n\n                    result += sample_color * weight;\n                    weight_sum += weight;\n                }\n            }\n\n            // Normalize\n            if (weight_sum > 0.0) {\n                result = result / weight_sum;\n            }\n\n            return result;\n        }\n\n        void main() {\n\n            vec2 inputCoord = v_texCoord * u_inputSize;\n\n            // Output coordinates (512×512)\n            vec2 outputCoord = inputCoord * 2.0;\n\n            // Determine which channel to read based on 2×2 block position\n            float x = inputCoord.x;\n            float y = inputCoord.y;\n\n            uint x_floor = uint(fract(x) * 2.0);\n            uint y_floor = uint(fract(y) * 2.0);\n            uint c_index = x_floor + y_floor * 2u;\n\n            // Integer version for texelFetch\n            ivec2 inputCoordU = ivec2(inputCoord);\n\n            // Read pixel shuffle values from all three channels\n            vec4 pixel0 = texelFetch(u_channel0, inputCoordU, 0);\n            vec4 pixel1 = texelFetch(u_channel1, inputCoordU, 0);\n            vec4 pixel2 = texelFetch(u_channel2, inputCoordU, 0);\n\n            float value0 = pixel0[c_index];\n            float value1 = pixel1[c_index];\n            float value2 = pixel2[c_index];\n\n            // Bicubic sample the original image\n            vec3 bicubic = sampleBicubic(u_original, v_texCoord);\n\n            // Combine: bicubic + neural network enhancement\n            outColor = vec4(bicubic+ vec3(value0, value1, value2), 1.0);\n        }";
            }
            setupUniforms() {
              const e = this.gl,
                t = e.getUniformLocation(this.program, "u_inputSize");
              (e.uniform2f(t, this.resolution.width, this.resolution.height),
                e.activeTexture(e.TEXTURE0),
                e.bindTexture(e.TEXTURE_2D, this.inputTextures[0]));
              const n = e.getUniformLocation(this.program, "u_channel0");
              (e.uniform1i(n, 0),
                e.activeTexture(e.TEXTURE1),
                e.bindTexture(e.TEXTURE_2D, this.inputTextures[1]));
              const r = e.getUniformLocation(this.program, "u_channel1");
              (e.uniform1i(r, 1),
                e.activeTexture(e.TEXTURE2),
                e.bindTexture(e.TEXTURE_2D, this.inputTextures[2]));
              const i = e.getUniformLocation(this.program, "u_channel2");
              (e.uniform1i(i, 2),
                e.activeTexture(e.TEXTURE3),
                e.bindTexture(e.TEXTURE_2D, this.inputTextures[3]),
                e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MIN_FILTER, e.LINEAR),
                e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MAG_FILTER, e.LINEAR));
              const s = e.getUniformLocation(this.program, "u_original");
              (e.uniform1i(s, 3),
                e.viewport(
                  0,
                  0,
                  2 * this.resolution.width,
                  2 * this.resolution.height,
                ));
            }
            run() {
              const e = this.gl;
              (e.useProgram(this.program),
                e.bindVertexArray(this.vao),
                e.bindFramebuffer(e.FRAMEBUFFER, this.framebuffer),
                e.viewport(
                  0,
                  0,
                  2 * this.resolution.width,
                  2 * this.resolution.height,
                ),
                e.clearColor(0, 0, 0, 0),
                e.clear(e.COLOR_BUFFER_BIT),
                this.setupUniforms(),
                e.drawArrays(e.TRIANGLES, 0, 6));
            }
          },
          v = class extends a {
            constructor(e, t, n) {
              (super(e, t, n), (this.label = "Conv2D32x4"));
            }
            fragmentShader() {
              return "#version 300 es\n        precision highp float;\n\n        in vec2 v_texCoord;\n        out vec4 outColor;\n\n        uniform sampler2D u_input0;\n        uniform sampler2D u_input1;\n        uniform sampler2D u_input2;\n        uniform sampler2D u_input3;\n        uniform vec2 u_inputSize;\n        uniform mat4 u_kernels[72];\n        uniform vec4 u_bias;\n\n        void main() {\n            // 3×3 convolution offsets\n            vec2 offsets[9] = vec2[9](\n                vec2(-1.0, -1.0), vec2(-1.0, 0.0), vec2(-1.0, 1.0),\n                vec2(0.0, -1.0),  vec2(0.0, 0.0),  vec2(0.0, 1.0),\n                vec2(1.0, -1.0),  vec2(1.0, 0.0),  vec2(1.0, 1.0)\n            );\n\n            vec4 result = vec4(0.0);\n            ivec2 pixelCoord = ivec2(v_texCoord * u_inputSize);\n\n            // Process all four inputs with CReLU\n            for (int i = 0; i < 9; i++) {\n                ivec2 sampleCoord = pixelCoord + ivec2(offsets[i]);\n\n                vec4 pix0 = texelFetch(u_input0, sampleCoord, 0);\n                vec4 pix1 = texelFetch(u_input1, sampleCoord, 0);\n                vec4 pix2 = texelFetch(u_input2, sampleCoord, 0);\n                vec4 pix3 = texelFetch(u_input3, sampleCoord, 0);\n\n                // CReLU: positive parts\n                result += u_kernels[i] * max(pix0, vec4(0.0));\n                result += u_kernels[i + 9] * max(pix1, vec4(0.0));\n                result += u_kernels[i + 18] * max(pix2, vec4(0.0));\n                result += u_kernels[i + 27] * max(pix3, vec4(0.0));\n\n                // CReLU: negative parts\n                result += u_kernels[i + 36] * max(-pix0, vec4(0.0));\n                result += u_kernels[i + 45] * max(-pix1, vec4(0.0));\n                result += u_kernels[i + 54] * max(-pix2, vec4(0.0));\n                result += u_kernels[i + 63] * max(-pix3, vec4(0.0));\n            }\n\n            result += u_bias;\n            outColor = result;\n        }";
            }
            setupUniforms() {
              const e = this.gl,
                t = e.getUniformLocation(this.program, "u_inputSize");
              e.uniform2f(t, this.resolution.width, this.resolution.height);
              const n = e.getUniformLocation(this.program, "u_bias");
              e.uniform4fv(n, new Float32Array(this.weights.bias));
              for (let t = 0; t < 72; t++) {
                const n = e.getUniformLocation(this.program, `u_kernels[${t}]`),
                  r = this.weights.weights.slice(16 * t, 16 * (t + 1));
                e.uniformMatrix4fv(n, !1, new Float32Array(r));
              }
              for (let t = 0; t < 4; t++) {
                (e.activeTexture(e.TEXTURE0 + t),
                  e.bindTexture(e.TEXTURE_2D, this.inputTextures[t]));
                const n = e.getUniformLocation(this.program, `u_input${t}`);
                e.uniform1i(n, t);
              }
              e.viewport(0, 0, this.resolution.width, this.resolution.height);
            }
          },
          g = class extends a {
            constructor(e, t, n, r) {
              (super(e, t, n), (this.label = "Conv2D224x4"), (this.index = r));
            }
            fragmentShader() {
              const e = [];
              for (let t = 0; t < 7; t++) {
                const n = t,
                  r = 8 * t + this.index,
                  i = 8 * t + this.index + 4;
                e.push(
                  `\n            vec4 pixel_val${t} = texelFetch(u_input${n}, pixelCoord, 0);\n            result += u_kernels[${r}] * max(pixel_val${t}, vec4(0.0));\n            result += u_kernels[${i}] * max(-pixel_val${t}, vec4(0.0));`,
                );
              }
              return `#version 300 es\n        precision highp float;\n\n        in vec2 v_texCoord;\n        out vec4 outColor;\n\n        uniform sampler2D u_input0;\n        uniform sampler2D u_input1;\n        uniform sampler2D u_input2;\n        uniform sampler2D u_input3;\n        uniform sampler2D u_input4;\n        uniform sampler2D u_input5;\n        uniform sampler2D u_input6;\n        uniform vec2 u_inputSize;\n        uniform mat4 u_kernels[56];\n\n        void main() {\n            vec4 result = vec4(0.0);\n            ivec2 pixelCoord = ivec2(v_texCoord * u_inputSize);\n\n            // Process all 7 inputs with CReLU (partial based on index)\n            ${e.join("\n            ")}\n\n            outColor = result;\n        }`;
            }
            setupUniforms() {
              const e = this.gl,
                t = e.getUniformLocation(this.program, "u_inputSize");
              e.uniform2f(t, this.resolution.width, this.resolution.height);
              for (let t = 0; t < 56; t++) {
                const n = e.getUniformLocation(this.program, `u_kernels[${t}]`),
                  r = this.weights.weights.slice(16 * t, 16 * (t + 1));
                e.uniformMatrix4fv(n, !1, new Float32Array(r));
              }
              for (let t = 0; t < 7; t++) {
                (e.activeTexture(e.TEXTURE0 + t),
                  e.bindTexture(e.TEXTURE_2D, this.inputTextures[t]));
                const n = e.getUniformLocation(this.program, `u_input${t}`);
                e.uniform1i(n, t);
              }
              e.viewport(0, 0, this.resolution.width, this.resolution.height);
            }
          },
          w = class extends a {
            constructor(e, t, n) {
              (super(e, t, n), (this.label = "Concat4"));
            }
            vertexShader() {
              return "#version 300 es\n        in vec2 a_position;\n        in vec2 a_texCoord;\n        out vec2 v_texCoord;\n\n        void main() {\n            gl_Position = vec4(a_position, 0.0, 1.0);\n            // No Y-flip to match DisplayLayer3C expectations\n            v_texCoord = a_texCoord;\n        }";
            }
            fragmentShader() {
              return "#version 300 es\n        precision highp float;\n\n        in vec2 v_texCoord;\n        out vec4 outColor;\n\n        uniform sampler2D u_input0;\n        uniform sampler2D u_input1;\n        uniform sampler2D u_input2;\n        uniform sampler2D u_input3;\n        uniform vec2 u_inputSize;\n        uniform vec4 u_bias;\n\n        void main() {\n            // Input textures were written with Y-flip, so flip when reading\n            vec2 flippedCoord = vec2(v_texCoord.x, 1.0 - v_texCoord.y);\n            ivec2 pixelCoord = ivec2(flippedCoord * u_inputSize);\n\n            // Simple element-wise addition of all four inputs\n            vec4 val0 = texelFetch(u_input0, pixelCoord, 0);\n            vec4 val1 = texelFetch(u_input1, pixelCoord, 0);\n            vec4 val2 = texelFetch(u_input2, pixelCoord, 0);\n            vec4 val3 = texelFetch(u_input3, pixelCoord, 0);\n\n            outColor = val0 + val1 + val2 + val3 + u_bias;\n        }";
            }
            setupUniforms() {
              const e = this.gl,
                t = e.getUniformLocation(this.program, "u_inputSize");
              e.uniform2f(t, this.resolution.width, this.resolution.height);
              const n = e.getUniformLocation(this.program, "u_bias");
              e.uniform4fv(n, new Float32Array(this.weights.bias));
              for (let t = 0; t < 4; t++) {
                (e.activeTexture(e.TEXTURE0 + t),
                  e.bindTexture(e.TEXTURE_2D, this.inputTextures[t]));
                const n = e.getUniformLocation(this.program, `u_input${t}`);
                e.uniform1i(n, t);
              }
              e.viewport(0, 0, this.resolution.width, this.resolution.height);
            }
          },
          b = {
            poc: class extends o {
              model() {
                const e = this.context,
                  t = [],
                  n = e.texture("input", {
                    width: e.resolution.width,
                    height: e.resolution.height,
                    format: e.gl.RGBA,
                  }),
                  r = e.texture("blur_output", {
                    width: e.resolution.width,
                    height: e.resolution.height,
                    format: e.gl.RGBA,
                  }),
                  i = e.framebuffer("blur_fb", ["blur_output"]),
                  s = new u([n], r);
                s.framebuffer = i;
                const o = new c([r]);
                return (t.push(s, o), t);
              }
            },
            "anime4k/cnn-2x-s": class extends o {
              model() {
                const e = this.context,
                  t = [],
                  n = this.weights.layers,
                  r = e.texture("input", {
                    width: e.resolution.width,
                    height: e.resolution.height,
                    format: e.gl.RGBA,
                  }),
                  i = e.texture("conv2d_tf", { format: e.gl.RGBA32F }),
                  s = e.framebuffer("conv2d_tf_fb", ["conv2d_tf"]),
                  o = new l([r], i, n.conv2d_tf);
                o.framebuffer = s;
                const a = e.texture("conv2d_1_tf", { format: e.gl.RGBA32F }),
                  u = e.framebuffer("conv2d_1_tf_fb", ["conv2d_1_tf"]),
                  c = new f([i], a, n.conv2d_1_tf);
                c.framebuffer = u;
                const p = e.texture("conv2d_2_tf", { format: e.gl.RGBA32F }),
                  h = e.framebuffer("conv2d_2_tf_fb", ["conv2d_2_tf"]),
                  x = new f([a], p, n.conv2d_2_tf);
                x.framebuffer = h;
                const m = e.texture("conv2d_last_tf", { format: e.gl.RGBA32F }),
                  v = e.framebuffer("conv2d_last_tf_fb", ["conv2d_last_tf"]),
                  g = new f([p], m, n.conv2d_last_tf);
                g.framebuffer = v;
                const w = e.texture("pixel_shuffle", {
                    width: 2 * e.resolution.width,
                    height: 2 * e.resolution.height,
                    format: e.gl.R32F,
                  }),
                  b = e.framebuffer("pixel_shuffle_fb", ["pixel_shuffle"]),
                  y = new _([m], w);
                y.framebuffer = b;
                const k = e.texture("output", {
                    format: e.gl.RGBA,
                    width: 2 * e.resolution.width,
                    height: 2 * e.resolution.height,
                  }),
                  T = new d([w, r], k);
                return (
                  (T.framebuffer = e.framebuffer("output_fb", ["output"])),
                  t.push(o, c, x, g, y, T),
                  t
                );
              }
              feedForward(e) {
                const t = Object.create(null, {
                  feedForward: { get: () => super.feedForward },
                });
                return (
                  (n = this),
                  (i = function* () {
                    (yield t.feedForward.call(this, e),
                      this.layers.length > 0 &&
                        (this.layers[this.layers.length - 1].inputTextures[1] =
                          this.context.input));
                  }),
                  new ((r = void 0) || (r = Promise))(function (e, t) {
                    function s(e) {
                      try {
                        a(i.next(e));
                      } catch (e) {
                        t(e);
                      }
                    }
                    function o(e) {
                      try {
                        a(i.throw(e));
                      } catch (e) {
                        t(e);
                      }
                    }
                    function a(t) {
                      var n;
                      t.done
                        ? e(t.value)
                        : ((n = t.value),
                          n instanceof r
                            ? n
                            : new r(function (e) {
                                e(n);
                              })).then(s, o);
                    }
                    a((i = i.apply(n, [])).next());
                  })
                );
                var n, r, i;
              }
            },
            "anime4k/cnn-2x-l": class extends o {
              constructor(e) {
                super(e);
              }
              model() {
                const e = [],
                  t = this.weights.layers,
                  n = this.context,
                  r = n.gl,
                  i = n.texture("input", { format: r.RGBA }),
                  s = new l(
                    [i],
                    n.texture("conv2d_tf", { format: r.RGBA32F }),
                    t.conv2d_tf,
                  );
                ((s.framebuffer = n.framebuffer("conv2d_tf_fb", ["conv2d_tf"])),
                  e.push(s));
                const o = new l(
                  [i],
                  n.texture("conv2d_tf1", { format: r.RGBA32F }),
                  t.conv2d_tf1,
                );
                ((o.framebuffer = n.framebuffer("conv2d_tf1_fb", [
                  "conv2d_tf1",
                ])),
                  e.push(o));
                for (let i = 1; i < 7; i++) {
                  const s = 1 === i ? "conv2d_tf" : `conv2d_${i - 1}_tf`,
                    o = new p(
                      [n.texture(s), n.texture(s + "1")],
                      n.texture(`conv2d_${i}_tf`, { format: r.RGBA32F }),
                      t[`conv2d_${i}_tf`],
                    );
                  ((o.framebuffer = n.framebuffer(`conv2d_${i}_tf_fb`, [
                    `conv2d_${i}_tf`,
                  ])),
                    e.push(o));
                  const a = new p(
                    [n.texture(s), n.texture(s + "1")],
                    n.texture(`conv2d_${i}_tf1`, { format: r.RGBA32F }),
                    t[`conv2d_${i}_tf1`],
                  );
                  ((a.framebuffer = n.framebuffer(`conv2d_${i}_tf1_fb`, [
                    `conv2d_${i}_tf1`,
                  ])),
                    e.push(a));
                }
                for (let i = 0; i < 3; i++) {
                  const s = [],
                    o = [];
                  for (let e = 0; e < 7; e++) {
                    const t = 0 === e ? "conv2d_tf" : `conv2d_${e}_tf`;
                    (s.push(n.texture(t)), o.push(n.texture(t + "1")));
                  }
                  const a = 0 === i ? "conv2d_last_tf" : `conv2d_last_tf${i}`,
                    u = new h(
                      s,
                      n.texture(`conv2d_last_${i}_pt1`, { format: r.RGBA32F }),
                      t[a],
                      !0,
                    );
                  ((u.framebuffer = n.framebuffer(`conv2d_last_${i}_pt1_fb`, [
                    `conv2d_last_${i}_pt1`,
                  ])),
                    e.push(u));
                  const c = new h(
                    o,
                    n.texture(`conv2d_last_${i}_pt2`, { format: r.RGBA32F }),
                    t[a],
                    !1,
                  );
                  ((c.framebuffer = n.framebuffer(`conv2d_last_${i}_pt2_fb`, [
                    `conv2d_last_${i}_pt2`,
                  ])),
                    e.push(c));
                  const l = new x(
                    [
                      n.texture(`conv2d_last_${i}_pt1`),
                      n.texture(`conv2d_last_${i}_pt2`),
                    ],
                    n.texture(a, { format: r.RGBA32F }),
                    t[a],
                  );
                  ((l.framebuffer = n.framebuffer(`${a}_fb`, [a])), e.push(l));
                }
                const a = n.texture("output", {
                    format: r.RGBA,
                    width: 2 * n.resolution.width,
                    height: 2 * n.resolution.height,
                  }),
                  u = new m(
                    [
                      n.texture("conv2d_last_tf"),
                      n.texture("conv2d_last_tf1"),
                      n.texture("conv2d_last_tf2"),
                      i,
                    ],
                    a,
                  );
                return (
                  (u.framebuffer = n.framebuffer("output_fb", ["output"])),
                  e.push(u),
                  e
                );
              }
              feedForward(e) {
                const t = Object.create(null, {
                  feedForward: { get: () => super.feedForward },
                });
                return (
                  (n = this),
                  (i = function* () {
                    (yield t.feedForward.call(this, e),
                      this.layers.length > 0 &&
                        (this.layers[this.layers.length - 1].inputTextures[3] =
                          this.context.input),
                      this.layers.length > 1 &&
                        ((this.layers[0].inputTextures[0] = this.context.input),
                        (this.layers[1].inputTextures[0] =
                          this.context.input)));
                  }),
                  new ((r = void 0) || (r = Promise))(function (e, t) {
                    function s(e) {
                      try {
                        a(i.next(e));
                      } catch (e) {
                        t(e);
                      }
                    }
                    function o(e) {
                      try {
                        a(i.throw(e));
                      } catch (e) {
                        t(e);
                      }
                    }
                    function a(t) {
                      var n;
                      t.done
                        ? e(t.value)
                        : ((n = t.value),
                          n instanceof r
                            ? n
                            : new r(function (e) {
                                e(n);
                              })).then(s, o);
                    }
                    a((i = i.apply(n, [])).next());
                  })
                );
                var n, r, i;
              }
            },
            "anime4k/cnn-2x-16": class extends o {
              constructor(e) {
                super(e);
              }
              model() {
                const e = [],
                  t = this.weights.layers,
                  n = this.context,
                  r = n.gl,
                  i = n.texture("input", { format: r.RGBA });
                for (let s = 0; s < 4; s++) {
                  const o = 0 === s ? "conv2d_tf" : `conv2d_tf${s}`,
                    a = new l([i], n.texture(o, { format: r.RGBA32F }), t[o]);
                  ((a.framebuffer = n.framebuffer(`${o}_fb`, [o])), e.push(a));
                }
                for (let i = 1; i < 7; i++) {
                  const s = 1 === i ? "conv2d_tf" : `conv2d_${i - 1}_tf`,
                    o = [];
                  for (let e = 0; e < 4; e++)
                    0 === e
                      ? o.push(n.texture(s))
                      : o.push(n.texture(s + `${e}`));
                  for (let s = 0; s < 4; s++) {
                    const a = 0 === s ? `conv2d_${i}_tf` : `conv2d_${i}_tf${s}`,
                      u = new v(o, n.texture(a, { format: r.RGBA32F }), t[a]);
                    ((u.framebuffer = n.framebuffer(`${a}_fb`, [a])),
                      e.push(u));
                  }
                }
                for (let i = 0; i < 3; i++) {
                  const s = [],
                    o = [],
                    a = [],
                    u = [];
                  for (let e = 0; e < 7; e++) {
                    const t = 0 === e ? "conv2d_tf" : `conv2d_${e}_tf`;
                    (s.push(n.texture(t)),
                      o.push(n.texture(t + "1")),
                      a.push(n.texture(t + "2")),
                      u.push(n.texture(t + "3")));
                  }
                  const c = 0 === i ? "conv2d_last_tf" : `conv2d_last_tf${i}`,
                    l = new g(
                      s,
                      n.texture(`conv2d_last_${i}_pt1`, { format: r.RGBA32F }),
                      t[c],
                      0,
                    );
                  ((l.framebuffer = n.framebuffer(`conv2d_last_${i}_pt1_fb`, [
                    `conv2d_last_${i}_pt1`,
                  ])),
                    e.push(l));
                  const f = new g(
                    o,
                    n.texture(`conv2d_last_${i}_pt2`, { format: r.RGBA32F }),
                    t[c],
                    1,
                  );
                  ((f.framebuffer = n.framebuffer(`conv2d_last_${i}_pt2_fb`, [
                    `conv2d_last_${i}_pt2`,
                  ])),
                    e.push(f));
                  const _ = new g(
                    a,
                    n.texture(`conv2d_last_${i}_pt3`, { format: r.RGBA32F }),
                    t[c],
                    2,
                  );
                  ((_.framebuffer = n.framebuffer(`conv2d_last_${i}_pt3_fb`, [
                    `conv2d_last_${i}_pt3`,
                  ])),
                    e.push(_));
                  const d = new g(
                    u,
                    n.texture(`conv2d_last_${i}_pt4`, { format: r.RGBA32F }),
                    t[c],
                    3,
                  );
                  ((d.framebuffer = n.framebuffer(`conv2d_last_${i}_pt4_fb`, [
                    `conv2d_last_${i}_pt4`,
                  ])),
                    e.push(d));
                  const p = new w(
                    [
                      n.texture(`conv2d_last_${i}_pt1`),
                      n.texture(`conv2d_last_${i}_pt2`),
                      n.texture(`conv2d_last_${i}_pt3`),
                      n.texture(`conv2d_last_${i}_pt4`),
                    ],
                    n.texture(c, { format: r.RGBA32F }),
                    t[c],
                  );
                  ((p.framebuffer = n.framebuffer(`${c}_fb`, [c])), e.push(p));
                }
                const s = n.texture("output", {
                    format: r.RGBA,
                    width: 2 * n.resolution.width,
                    height: 2 * n.resolution.height,
                  }),
                  o = new m(
                    [
                      n.texture("conv2d_last_tf"),
                      n.texture("conv2d_last_tf1"),
                      n.texture("conv2d_last_tf2"),
                      i,
                    ],
                    s,
                  );
                return (
                  (o.framebuffer = n.framebuffer("output_fb", ["output"])),
                  e.push(o),
                  e
                );
              }
              feedForward(e) {
                const t = Object.create(null, {
                  feedForward: { get: () => super.feedForward },
                });
                return (
                  (n = this),
                  (i = function* () {
                    (yield t.feedForward.call(this, e),
                      this.layers.length > 0 &&
                        (this.layers[this.layers.length - 1].inputTextures[3] =
                          this.context.input),
                      this.layers.length > 3 &&
                        ((this.layers[0].inputTextures[0] = this.context.input),
                        (this.layers[1].inputTextures[0] = this.context.input),
                        (this.layers[2].inputTextures[0] = this.context.input),
                        (this.layers[3].inputTextures[0] =
                          this.context.input)));
                  }),
                  new ((r = void 0) || (r = Promise))(function (e, t) {
                    function s(e) {
                      try {
                        a(i.next(e));
                      } catch (e) {
                        t(e);
                      }
                    }
                    function o(e) {
                      try {
                        a(i.throw(e));
                      } catch (e) {
                        t(e);
                      }
                    }
                    function a(t) {
                      var n;
                      t.done
                        ? e(t.value)
                        : ((n = t.value),
                          n instanceof r
                            ? n
                            : new r(function (e) {
                                e(n);
                              })).then(s, o);
                    }
                    a((i = i.apply(n, [])).next());
                  })
                );
                var n, r, i;
              }
            },
          },
          y = class extends a {
            constructor(e) {
              (super([e], null),
                (this.label = "Passthrough"),
                (this.framebuffer = null));
            }
            vertexShader() {
              return "#version 300 es\n        in vec2 a_position;\n        in vec2 a_texCoord;\n        out vec2 v_texCoord;\n\n        void main() {\n            gl_Position = vec4(a_position, 0.0, 1.0);\n            // No Y-flip for canvas rendering\n            v_texCoord = a_texCoord;\n        }";
            }
            fragmentShader() {
              return "#version 300 es\n        precision highp float;\n\n        in vec2 v_texCoord;\n        out vec4 outColor;\n\n        uniform sampler2D u_input;\n\n        void main() {\n            outColor = texture(u_input, v_texCoord);\n        }";
            }
            setupUniforms() {
              const e = this.gl;
              (e.activeTexture(e.TEXTURE0),
                e.bindTexture(e.TEXTURE_2D, this.inputTextures[0]));
              const t = e.getUniformLocation(this.program, "u_input");
              e.uniform1i(t, 0);
            }
          };
        class k {
          constructor(e) {
            const {
              canvas: t,
              source: n,
              gl: r,
              network_name: i,
              weights: o,
            } = e;
            if (
              ((this.canvas = t),
              (this.source = n),
              (this.resolution = {
                width: n.width || n.naturalWidth || 0,
                height: n.height || n.naturalHeight || 0,
              }),
              (this.context = new s(r, this.resolution, t)),
              (globalThis.context = this.context),
              !b[i])
            )
              throw new Error(`Network ${i} is not defined or implemented`);
            ((this.network = new b[i](o)),
              this.network.layers.forEach((e) => {
                e.defaultSetup();
              }));
          }
          static initWebGL(e) {
            let t;
            if (e) t = e;
            else if ("undefined" != typeof OffscreenCanvas)
              t = new OffscreenCanvas(1024, 1024);
            else {
              if ("undefined" == typeof document) return !1;
              t = document.createElement("canvas");
            }
            const n = t.getContext("webgl2");
            return !!n && !!n.getExtension("EXT_color_buffer_float") && n;
          }
          render(e) {
            return (
              (t = this),
              (r = function* () {
                (yield this.network.feedForward(e || this.source),
                  this.displayToCanvas());
              }),
              new ((n = void 0) || (n = Promise))(function (e, i) {
                function s(e) {
                  try {
                    a(r.next(e));
                  } catch (e) {
                    i(e);
                  }
                }
                function o(e) {
                  try {
                    a(r.throw(e));
                  } catch (e) {
                    i(e);
                  }
                }
                function a(t) {
                  var r;
                  t.done
                    ? e(t.value)
                    : ((r = t.value),
                      r instanceof n
                        ? r
                        : new n(function (e) {
                            e(r);
                          })).then(s, o);
                }
                a((r = r.apply(t, [])).next());
              })
            );
            var t, n, r;
          }
          displayToCanvas() {
            const e = this.context.textures.output;
            if (!e)
              throw new Error(
                "Output texture not found. Did you run render() first?",
              );
            const t = new y(e);
            (t.defaultSetup(), t.run());
          }
          readPixels() {
            const e = this.context.gl,
              t = this.context.textures.output;
            if (!t)
              throw new Error(
                "Output texture not found. Did you run render() first?",
              );
            const n = 2 * this.resolution.width,
              r = 2 * this.resolution.height,
              i = e.createFramebuffer();
            (e.bindFramebuffer(e.FRAMEBUFFER, i),
              e.framebufferTexture2D(
                e.FRAMEBUFFER,
                e.COLOR_ATTACHMENT0,
                e.TEXTURE_2D,
                t,
                0,
              ));
            const s = e.checkFramebufferStatus(e.FRAMEBUFFER);
            if (s !== e.FRAMEBUFFER_COMPLETE)
              throw new Error(`Framebuffer incomplete: ${s}`);
            const o = new Uint8Array(n * r * 4);
            return (
              e.readPixels(0, 0, n, r, e.RGBA, e.UNSIGNED_BYTE, o),
              e.bindFramebuffer(e.FRAMEBUFFER, null),
              e.deleteFramebuffer(i),
              o
            );
          }
        }
        function T() {
          const e = navigator.userAgent;
          return e.includes("Firefox/")
            ? "firefox"
            : e.includes("Safari/") && !e.includes("Chrome/")
              ? "safari"
              : e.includes("Chrome/")
                ? "chromium"
                : "unknown";
        }
        const $ = class {
          constructor(e = 10485760) {
            ((this._chunkSize = e),
              (this.chunks = new Map()),
              (this._size = 0));
          }
          write(e, t) {
            this._size = Math.max(this._size, t + e.byteLength);
            const n = Math.floor(t / this._chunkSize),
              r = Math.floor((t + e.byteLength - 1) / this._chunkSize);
            for (let i = n; i <= r; i++) {
              const n = i * this._chunkSize,
                r = n + this._chunkSize,
                s = Math.max(t, n),
                o = Math.min(t + e.byteLength, r) - s;
              if (o <= 0) continue;
              let a;
              this.chunks.has(i)
                ? (a = this.chunks.get(i))
                : ((a = new Uint8Array(this._chunkSize)),
                  this.chunks.set(i, a));
              const u = s - n,
                c = s - t;
              for (let t = 0; t < o; t++) a[u + t] = e[c + t];
            }
          }
          get size() {
            return this._size;
          }
          toBlob(e = "application/octet-stream") {
            if (0 === this.chunks.size) return new Blob([], { type: e });
            const t = Array.from(this.chunks.keys()).sort((e, t) => e - t),
              n = [];
            for (let e = 0; e < t.length; e++) {
              const r = t[e],
                i = this.chunks.get(r);
              if (e === t.length - 1) {
                const e = this._size - r * this._chunkSize;
                e < this._chunkSize ? n.push(i.slice(0, e)) : n.push(i);
              } else n.push(i);
            }
            return new Blob(n, { type: e });
          }
        };
        var B = n(232);
        const E = async function (e) {
          let t;
          if (
            (console.log(
              "Worker: Reading File as ArrayBuffer in worker thread",
            ),
            e.size > 209715200)
          ) {
            console.log("Reading as stream");
            const n = e.stream().getReader(),
              r = [];
            let i = 0;
            for (;;) {
              const { done: t, value: s } = await n.read();
              if (t) break;
              if ((r.push(s), (i += s.length), e.size > 0)) {
                const t = Math.round((i / e.size) * 80);
                self.postMessage({ cmd: "load_progress", progress: t });
              }
            }
            const s = new Blob(r);
            t = await s.arrayBuffer();
          } else {
            console.log("Reading file as arraybuffer");
            try {
              ((t = new FileReaderSync().readAsArrayBuffer(e)),
                self.postMessage({ cmd: "load_progress", progress: 80 }));
            } catch (n) {
              (console.error(
                "FileReaderSync failed, falling back to async FileReader",
              ),
                (t = await new Promise((t, n) => {
                  const r = new FileReader();
                  ((r.onload = (e) => t(e.target.result)),
                    (r.onerror = (e) => n(e.target.error)),
                    r.readAsArrayBuffer(e));
                })),
                self.postMessage({ cmd: "load_progress", progress: 80 }));
            }
          }
          return t;
        };
        var U = n(41);
        class C {
          onConfig = null;
          onData = null;
          setStatus = null;
          file = null;
          constructor(e, t, { onConfig: n, onData: r, setStatus: i }) {
            ((this.onConfig = n),
              (this.onData = r),
              (this.setStatus = i),
              (this.type = t),
              (this.file = U.createFile()),
              (this.file.onError = (e) => i("demux", e)),
              (this.file.onReady = this.onReady.bind(this)),
              (this.file.onSamples = this.onSamples.bind(this)),
              (e.fileStart = 0),
              this.file.appendBuffer(e),
              this.file.flush());
          }
          description(e) {
            const t = this.file.getTrackById(e.id);
            for (const e of t.mdia.minf.stbl.stsd.entries) {
              const t = e.avcC || e.hvcC || e.vpcC || e.av1C;
              if (t) {
                const e = new U.DataStream(void 0, 0, U.DataStream.BIG_ENDIAN);
                return (t.write(e), new Uint8Array(e.buffer, 8));
              }
            }
            throw new Error("avcC, hvcC, vpcC, or av1C box not found");
          }
          onReady(e) {
            this.setStatus("demux", "Ready");
            const t =
              "video" === this.type ? e.videoTracks[0] : e.audioTracks[0];
            let n = {};
            (console.log("Finding track type"),
              console.log(t),
              console.log("In"),
              (n =
                "video" === t.type
                  ? {
                      codec: t.codec,
                      codedHeight: t.video.height,
                      codedWidth: t.video.width,
                      description: this.description(t),
                    }
                  : {
                      codec: t.codec,
                      sampleRate: t.audio.sample_rate,
                      numberOfChannels: t.audio.channel_count,
                    }),
              this.onConfig(n),
              this.file.setExtractionOptions(t.id),
              this.file.start());
          }
          onSamples(e, t, n) {
            const r = [];
            let i;
            i =
              "undefined" == typeof EncodedAudioChunk || "video" === this.type
                ? EncodedVideoChunk
                : EncodedAudioChunk;
            for (const e of n)
              r.push(
                new i({
                  type: e.is_sync ? "key" : "delta",
                  timestamp: (1e6 * e.cts) / e.timescale,
                  duration: (1e6 * e.duration) / e.timescale,
                  data: e.data,
                }),
              );
            this.onData(r);
          }
          flush() {
            this.file.flush();
          }
        }
        const P = function (e, t, n, r = !1) {
          return new Promise(function (i, s) {
            let o,
              a = [],
              u = !1;
            const c = "audio" === t ? 80 : 85,
              l = "audio" === t ? 85 : 100;
            new C(e, t, {
              onConfig(e) {
                if (((o = e), o && u))
                  return i({ config: o, encoded_chunks: a });
              },
              onData(e) {
                for (let t of e) a.push(t);
                let t = e[e.length - 1].timestamp / 1e6;
                if ((Math.abs(n - t) < 1 && (u = !0), !r)) {
                  const e = c + Math.round((t / n) * (l - c));
                  self.postMessage({
                    cmd: "load_progress",
                    progress: Math.min(e, l),
                  });
                }
                if (o && u) return i({ config: o, encoded_chunks: a });
              },
              setStatus: function () {},
            });
          });
        };
        let R = null,
          S = {},
          A = new Set();
        function F() {
          const e = navigator.userAgent;
          return e.includes("Chrome") && !e.includes("Edg")
            ? "chrome"
            : e.includes("Safari") && !e.includes("Chrome")
              ? "safari"
              : e.includes("Firefox")
                ? "firefox"
                : e.includes("Edg")
                  ? "edge"
                  : "unknown";
        }
        function L() {
          const e = navigator.userAgent;
          return e.includes("Windows")
            ? "windows"
            : e.includes("Mac")
              ? "mac"
              : e.includes("Linux")
                ? "linux"
                : e.includes("Android")
                  ? "android"
                  : e.includes("iOS") ||
                      e.includes("iPhone") ||
                      e.includes("iPad")
                    ? "ios"
                    : "unknown";
        }
        function M() {
          const e = navigator.userAgent;
          return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            e,
          );
        }
        function j(e, t = {}) {
          // try {
          //   if (!R)
          //     return void console.warn(
          //       "[Tracking] Not initialized - skipping event:",
          //       e,
          //     );
          //   if ("error" === e && t.error_stage) {
          //     const e = t.error_stage;
          //     if (A.has(e))
          //       return void console.log(
          //         "[Tracking] Skipping duplicate error for stage:",
          //         e,
          //       );
          //     A.add(e);
          //   }
          //   const n = {
          //     ...S,
          //     event_type: e,
          //     timestamp: new Date().toISOString(),
          //     ...t,
          //   };
          //   (fetch(
          //     "https://axo75x5aol.execute-api.us-east-2.amazonaws.com/default/log",
          //     {
          //       method: "POST",
          //       headers: { "Content-Type": "application/json" },
          //       body: JSON.stringify(n),
          //       keepalive: !0,
          //     },
          //   ).catch((t) => {
          //     console.warn("[Tracking] Failed to send event:", e, t);
          //   }),
          //     console.log("[Tracking] Event logged:", e));
          // } catch (e) {
          //   console.warn("[Tracking] Unexpected error in logEvent:", e);
          // }
        }
        const G = async function (e) {
            const {
              currentNetwork: t,
              currentWeights: n,
              file: r,
              duration: s,
              handle: o,
              adjustedResolution: a,
              skipDemuxProgress: u,
              websr: c,
              gpu: l,
              gl: f,
              backend: _,
              upscaled_canvas: d,
              ctx: p,
              resolution: h,
              progress_preview_ctx: x,
              progress_preview_canvas: m,
            } = e;
            let v = c,
              g = f;
            console.log("Using firefox/safari processor");
            const w = a
                ? { width: a.adjustedInputWidth, height: a.adjustedInputHeight }
                : h,
              b = a
                ? {
                    width: a.adjustedOutputWidth,
                    height: a.adjustedOutputHeight,
                  }
                : { width: 2 * h.width, height: 2 * h.height };
            let y,
              U,
              C = (b.width * b.height * 25e5) / 921600;
            const R = await E(r);
            if (t || a) {
              const e = a ? w : h;
              "webgpu" === _
                ? (v = new (i())({
                    network_name: t || "anime4k/cnn-2x-16",
                    weights: n,
                    resolution: e,
                    gpu: l,
                    canvas: d,
                  }))
                : "webgl" === _ &&
                  ((d.width = 2 * e.width),
                  (d.height = 2 * e.height),
                  console.log(`Upscled canvas: ${d.width}, ${d.height}`),
                  (g && g.canvas === d) || (g = d.getContext("webgl2")),
                  (v = new k({
                    source: { width: e.width, height: e.height },
                    canvas: d,
                    gl: g,
                    network_name: t || "anime4k/cnn-2x-16",
                    weights: n,
                  })));
            }
            const S = new $();
            try {
              U = await P(R, "audio", s, u);
            } catch (e) {
              (console.log("No audio track found, skipping...."),
                console.log(e));
            }
            try {
              y = await P(R, "video", s, u);
            } catch (e) {
              (console.warn("No video data found"),
                j("error", {
                  error_message: e.message,
                  error_stack: e.stack,
                  error_stage: "demux",
                }),
                postMessage({ cmd: "error", data: "No video found" }));
            }
            const A = y.config,
              F = y.encoded_chunks;
            (console.log(`Working with ${F.length} chunks`),
              console.log(`Video config: ${A}`));
            const L = [],
              M = {};
            for (const e of F) (L.push(e.timestamp), (M[`${e.timestamp}`] = e));
            const G = L.sort((e, t) => e - t),
              q = T(),
              D = {
                target: new B.Pl(
                  function (e, t) {
                    S.write(e, t);
                  },
                  function () {},
                  { chunked: !0, chunkSize: 10485760 },
                ),
                video: { codec: "avc", width: b.width, height: b.height },
                firstTimestampBehavior: "offset",
                fastStart: "in-memory",
              };
            U &&
              (D.audio = {
                codec: "aac",
                numberOfChannels: U.config.numberOfChannels,
                sampleRate: U.config.sampleRate,
              });
            const z = new B.fX(D);
            let I = b.width * b.height > 921600 ? "avc1.42003e" : "avc1.42001f",
              O = ["avc1.640028", "avc1.64001e", "avc1.42003e", "avc1.42001f"];
            "firefox" === q && (O = ["avc1.42003e", "avc1.42001f"]);
            for (const e of O) {
              const t = {
                codec: e,
                width: b.width,
                height: b.height,
                bitrate: C,
                framerate: 1e6 / y.encoded_chunks[0].duration,
              };
              if ((await VideoEncoder.isConfigSupported(t)).supported) {
                I = e;
                break;
              }
            }
            const W = {
                codec: I,
                width: b.width,
                height: b.height,
                bitrate: Math.round(C),
                framerate: 1e6 / F[0].duration,
              },
              N = [],
              V = {},
              X = new VideoDecoder({
                output(e) {
                  ((V[`${e.timestamp}`] = e), N.shift()());
                },
                error(e) {
                  (j("error", {
                    error_message: e.message,
                    error_stack: e.stack,
                    error_stage: "decode",
                  }),
                    postMessage({ cmd: "error", data: e.message }));
                },
              }),
              H = [],
              K = [];
            let Y = 0;
            const Q = new VideoEncoder({
              output: (e, t) => {
                const n = H.shift();
                (K.push({ chunk: e, meta: t }), (Y = e.timestamp / 1e6), n());
              },
              error: (e) => {
                (console.log("Error encoding chunk"),
                  console.log(e),
                  j("error", {
                    error_message: e.message,
                    error_stack: e.stack,
                    error_stage: "encode",
                  }),
                  postMessage({ cmd: "error", data: e.message }));
              },
            });
            (Q.configure(W), X.configure(A));
            let J = 0;
            const Z = [],
              ee = {};
            for (let t = 0; t < Math.min(F.length, 20); t++) {
              let n = F[t];
              const r = new Promise(function (e, t) {
                N.push(function (t) {
                  e(t);
                });
              });
              (Z.push(r), (ee[`${n.timestamp}`] = r));
              try {
                X.decode(n);
              } catch (e) {
                (console.log("Error decoding chunk"),
                  console.log(e),
                  j("error", {
                    error_message: e.message,
                    error_stack: e.stack,
                    error_stage: "decode",
                  }),
                  postMessage({ cmd: "error", data: e.message }));
              }
            }
            const te = [],
              ne = performance.now();
            let re,
              ie = performance.now(),
              se = setInterval(function () {
                performance.now() - ie > 20 && F.length - re < 10 && X.flush();
              }, 100),
              oe = 0;
            const ae = Math.round(3 * Math.sqrt(F.length));
            console.log(`Reporting every ${ae} chunks`);
            let ue = !1;
            for (; J < F.length; ) {
              const t = G[J];
              if (!V[`${t}`]) {
                if (
                  (await new Promise((e) => setTimeout(e, 100)),
                  (oe += 1),
                  oe > 10)
                )
                  break;
                continue;
              }
              oe = 0;
              const n = M[`${t}`],
                r = await V[`${t}`];
              ie = performance.now();
              const i = await createImageBitmap(r, {
                resizeHeight: b.height,
                resizeWidth: b.width,
              });
              let o;
              ((o =
                !a ||
                (r.displayWidth === w.width && r.displayHeight === w.height)
                  ? r
                  : await createImageBitmap(r, {
                      resizeWidth: w.width,
                      resizeHeight: w.height,
                    })),
                v.render(o),
                p.transferFromImageBitmap(i));
              const u = J;
              let c;
              if (((re = J), "webgl" === _)) {
                const e = v.readPixels(),
                  t = d.width,
                  n = d.height;
                if (t !== b.width || n !== b.height) {
                  const i = new ImageData(
                      new Uint8ClampedArray(e.buffer),
                      t,
                      n,
                    ),
                    s = await createImageBitmap(i, {
                      resizeWidth: b.width,
                      resizeHeight: b.height,
                      resizeQuality: "high",
                    });
                  ((c = new VideoFrame(s, {
                    timestamp: r.timestamp,
                    duration: r.duration,
                    alpha: "discard",
                  })),
                    s.close());
                } else
                  c = new VideoFrame(e, {
                    format: "RGBA",
                    codedWidth: t,
                    codedHeight: n,
                    timestamp: r.timestamp,
                    duration: r.duration,
                  });
              } else if (d.width !== b.width || d.height !== b.height) {
                const e = await createImageBitmap(d, {
                  resizeWidth: b.width,
                  resizeHeight: b.height,
                  resizeQuality: "high",
                });
                ((c = new VideoFrame(e, {
                  timestamp: r.timestamp,
                  duration: r.duration,
                  alpha: "discard",
                })),
                  e.close());
              } else
                c = new VideoFrame(d, {
                  timestamp: r.timestamp,
                  duration: r.duration,
                  alpha: "discard",
                });
              if (J % 50 == 0)
                try {
                  const e = await createImageBitmap(d);
                  x.transferFromImageBitmap(e);
                } catch (e) {
                  console.warn(e);
                }
              (J % ae == 0 &&
                console.log(`Process frame ${u} out of ${F.length}`),
                (J += 1));
              let l = Math.floor((r.timestamp / 1e6 / s) * 1e5) / 1e3,
                f = performance.now() - ne;
              if (f > 1e3) {
                const e = ((r.timestamp / 1e6 / s) * 100) / f;
                let t = Math.round((100 - l) / e / 1e3);
                postMessage({
                  cmd: "eta",
                  data:
                    ((ce = t),
                    (le = parseInt(ce, 10)),
                    [Math.floor(le / 3600), Math.floor(le / 60) % 60, le % 60]
                      .map((e) => (e < 10 ? "0" + e : e))
                      .filter((e, t) => "00" !== e || t > 0)
                      .join(":")),
                });
              } else postMessage({ cmd: "eta", data: "calculating..." });
              (postMessage({ cmd: "progress", data: l }),
                te.push(
                  new Promise(function (e, t) {
                    H.push(function () {
                      e();
                    });
                  }),
                ));
              try {
                (Q.encodeQueueSize >= 20 &&
                  (await new Promise(function (e) {
                    !(function t() {
                      Q.encodeQueueSize < 20 ? e() : setTimeout(t, 100);
                    })();
                  })),
                  Q.encode(c, { keyFrame: "key" === n.type }));
              } catch (e) {
                (j("error", {
                  error_message: e.message,
                  error_stack: e.stack,
                  error_stage: "upscale",
                }),
                  postMessage({ cmd: "error", data: e.message }));
              }
              if (
                (r.close(), c.close(), o !== r && o.close(), u + 20 < F.length)
              ) {
                let t = F[u + 20];
                Z.push(
                  new Promise(function (e, t) {
                    N.push(function (t) {
                      e(t);
                    });
                  }),
                );
                try {
                  X.decode(t);
                } catch (e) {}
                ie = performance.now();
              }
            }
            var ce, le;
            clearInterval(se);
            let fe = performance.now();
            se = setInterval(function () {
              if (
                (console.log(`Last encoded timestamp ${Y}`),
                console.log("Progress " + Y / s),
                performance.now() - fe > 1e3)
              )
                return Q.flush();
            }, 5e3);
            for (let e = 0; e < te.length; e++) {
              const t = te[e];
              (await t, (fe = performance.now()));
            }
            (clearInterval(se),
              (function () {
                if (ue) return;
                ue = !0;
                const e = K.sort(
                  (e, t) => e.chunk.timestamp - t.chunk.timestamp,
                );
                for (const t of e) z.addVideoChunk(t.chunk, t.meta);
                try {
                  if (U) {
                    const e = U.encoded_chunks;
                    for (let t of e) z.addAudioChunk(t);
                  }
                  z.finalize();
                  const e = S.toBlob("video/mp4");
                  postMessage({ cmd: "finished", data: e });
                } catch (e) {
                  (j("error", {
                    error_message: e.message,
                    error_stack: e.stack,
                    error_stage: "process",
                  }),
                    postMessage({ cmd: "error", data: e.message }));
                }
              })());
          },
          q = async function (e) {
            const {
              currentNetwork: t,
              currentWeights: n,
              file: r,
              duration: s,
              handle: o,
              adjustedResolution: a,
              skipDemuxProgress: u,
              websr: c,
              gpu: l,
              upscaled_canvas: f,
              ctx: _,
              resolution: d,
              progress_preview_ctx: p,
              progress_preview_canvas: h,
            } = e;
            let x = c;
            (console.log("Using standard processor"),
              console.log(`Duration ${s}`));
            const m = performance.now(),
              v = a
                ? { width: a.adjustedInputWidth, height: a.adjustedInputHeight }
                : d,
              g = a
                ? {
                    width: a.adjustedOutputWidth,
                    height: a.adjustedOutputHeight,
                  }
                : { width: 2 * d.width, height: 2 * d.height };
            let w,
              b,
              y = (g.width * g.height * 25e5) / 921600;
            const k = await E(r);
            if (t || a) {
              const e = a ? v : d;
              x = new (i())({
                network_name: t || "anime4k/cnn-2x-16",
                weights: n,
                resolution: e,
                gpu: l,
                canvas: f,
              });
            }
            const T = performance.now();
            console.log("Time to get WebSR: " + (T - m));
            const U = new $();
            try {
              b = await P(k, "audio", s, u);
            } catch (J) {
              console.log("No audio track found, skipping....");
            }
            const C = performance.now();
            console.log("Time to get audio track: " + (C - T));
            try {
              w = await P(k, "video", s, u);
            } catch (J) {
              (console.warn("No video data found"),
                j("error", {
                  error_message: J.message,
                  error_stack: J.stack,
                  error_stage: "demux",
                }),
                postMessage({ cmd: "error", data: "No video found" }));
            }
            const R = w.config,
              S = w.encoded_chunks,
              A = performance.now();
            (console.log("Time to get video track: " + (A - C)),
              console.log(`Working with ${S.length} chunks`),
              console.log(`Video config: ${JSON.stringify(R)}`));
            const F = {
              target: new B.Pl(
                function (e, t) {
                  U.write(e, t);
                },
                function () {},
                { chunked: !0, chunkSize: 10485760 },
              ),
              video: { codec: "avc", width: g.width, height: g.height },
              firstTimestampBehavior: "offset",
              fastStart: "in-memory",
            };
            b &&
              (F.audio = {
                codec: "aac",
                numberOfChannels: b.config.numberOfChannels,
                sampleRate: b.config.sampleRate,
              });
            const L = new B.fX(F);
            let M = g.width * g.height > 921600 ? "avc1.42003e" : "avc1.42001f";
            const G = [
              "avc1.640028",
              "avc1.64001e",
              "avc1.42003e",
              "avc1.42001f",
            ];
            for (const e of G) {
              const t = {
                codec: e,
                width: g.width,
                height: g.height,
                bitrate: y,
                framerate: 1e6 / w.encoded_chunks[0].duration,
              };
              if ((await VideoEncoder.isConfigSupported(t)).supported) {
                M = e;
                break;
              }
            }
            const q = {
                codec: M,
                width: g.width,
                height: g.height,
                bitrate: Math.round(y),
                framerate: 1e6 / w.encoded_chunks[0].duration,
              },
              D = [],
              z = new VideoDecoder({
                output(e) {
                  D.shift()(e);
                },
                error(e) {
                  (j("error", {
                    error_message: e.message,
                    error_stack: e.stack,
                    error_stage: "decode",
                  }),
                    postMessage({ cmd: "error", data: e.message }));
                },
              }),
              I = [];
            let O = 0;
            const W = new VideoEncoder({
              output: (e, t) => {
                const n = I.shift();
                try {
                  (L.addVideoChunk(e, t), (O = e.timestamp / 1e6));
                } catch (e) {
                  (j("error", {
                    error_message: e.message,
                    error_stack: e.stack,
                    error_stage: "mux",
                  }),
                    postMessage({ cmd: "error", data: e.message }));
                }
                n();
              },
              error: (e) => {
                (j("error", {
                  error_message: e.message,
                  error_stack: e.stack,
                  error_stage: "encode",
                }),
                  postMessage({ cmd: "error", data: e.message }));
              },
            });
            (W.configure(q), z.configure(R));
            const N = Math.round(3 * Math.sqrt(S.length));
            console.log(`Reporting every ${N} chunks`);
            const V = [];
            for (let e = 0; e < Math.min(S.length, 20); e++) {
              let t = S[e];
              V.push(
                new Promise(function (e, t) {
                  D.push(function (t) {
                    e(t);
                  });
                }),
              );
              try {
                z.decode(t);
              } catch (J) {
                (j("error", {
                  error_message: J.message,
                  error_stack: J.stack,
                  error_stage: "decode",
                }),
                  postMessage({ cmd: "error", data: J.message }));
              }
            }
            const X = [],
              H = performance.now();
            let K,
              Y = performance.now(),
              Q = setInterval(function () {
                performance.now() - Y > 20 && S.length - K < 10 && z.flush();
              }, 100);
            const J = performance.now();
            console.log("Get to process loop time " + (J - A));
            for (let e = 0; e < V.length; e++) {
              const t = V[e],
                n = S[e],
                r = await t;
              Y = performance.now();
              const i = await createImageBitmap(r, {
                resizeHeight: g.height,
                resizeWidth: g.width,
              });
              let o, u;
              if (
                ((o =
                  !a ||
                  (r.displayWidth === v.width && r.displayHeight === v.height)
                    ? r
                    : await createImageBitmap(r, {
                        resizeWidth: v.width,
                        resizeHeight: v.height,
                      })),
                x.render(o),
                _.transferFromImageBitmap(i),
                (K = e),
                e % N == 0 &&
                  console.log(`Process frame ${e} out of ${S.length}`),
                f.width !== g.width || f.height !== g.height)
              ) {
                const e = await createImageBitmap(f, {
                  resizeWidth: g.width,
                  resizeHeight: g.height,
                  resizeQuality: "high",
                });
                ((u = new VideoFrame(e, {
                  timestamp: r.timestamp,
                  duration: r.duration,
                  alpha: "discard",
                })),
                  e.close());
              } else
                u = new VideoFrame(f, {
                  timestamp: r.timestamp,
                  duration: r.duration,
                  alpha: "discard",
                });
              if (p && e % 50 == 0) {
                const e = await createImageBitmap(f, {
                  resizeWidth: h.width,
                  resizeHeight: h.height,
                  resizeQuality: "high",
                });
                p.transferFromImageBitmap(e);
              }
              let c = Math.floor((r.timestamp / 1e6 / s) * 1e5) / 1e3;
              postMessage({ cmd: "progress", data: c });
              let l = performance.now() - H;
              if (l > 1e3) {
                const e = ((r.timestamp / 1e6 / s) * 100) / l;
                let t = Math.round((100 - c) / e / 1e3);
                postMessage({
                  cmd: "eta",
                  data:
                    ((Z = t),
                    (ee = parseInt(Z, 10)),
                    [Math.floor(ee / 3600), Math.floor(ee / 60) % 60, ee % 60]
                      .map((e) => (e < 10 ? "0" + e : e))
                      .filter((e, t) => "00" !== e || t > 0)
                      .join(":")),
                });
              } else postMessage({ cmd: "eta", data: "calculating..." });
              X.push(
                new Promise(function (e, t) {
                  I.push(function () {
                    e();
                  });
                }),
              );
              try {
                (W.encodeQueueSize >= 20 &&
                  (await new Promise(function (e) {
                    !(function t() {
                      W.encodeQueueSize < 20 ? e() : setTimeout(t, 100);
                    })();
                  })),
                  W.encode(u, { keyFrame: "key" === n.type }));
              } catch (J) {
                (j("error", {
                  error_message: J.message,
                  error_stack: J.stack,
                  error_stage: "upscale",
                }),
                  postMessage({ cmd: "error", data: J.message }));
              }
              if (
                (r.close(), u.close(), o !== r && o.close(), e + 20 < S.length)
              ) {
                let t = S[e + 20];
                V.push(
                  new Promise(function (e, t) {
                    D.push(function (t) {
                      e(t);
                    });
                  }),
                );
                try {
                  z.decode(t);
                } catch (J) {}
                Y = performance.now();
              }
            }
            var Z, ee;
            clearInterval(Q);
            let te = performance.now(),
              ne = !0;
            Q = setInterval(function () {
              if (
                (console.log(`Last encoded timestamp ${O}`),
                console.log("Progress " + O / s),
                performance.now() - te > 1e3)
              )
                return W.flush();
            }, 5e3);
            for (let e = 0; e < X.length; e++) {
              const t = X[e];
              (await t, (te = performance.now()));
            }
            (console.log("All encoded promises resolved, finishing"),
              (function () {
                (console.log("Finishing"), (ne = !0), clearInterval(Q));
                try {
                  if (b) {
                    const e = b.encoded_chunks;
                    for (let t of e) L.addAudioChunk(t);
                  }
                  (console.log("Finish"), L.finalize());
                  const e = U.toBlob("video/mp4");
                  (console.log(`Blob size: ${e.size}`),
                    postMessage({ cmd: "finished", data: e }));
                  try {
                    (console.log("Closing encoder"), W.close());
                  } catch (e) {
                    console.log(`Error Closing encoder ${e}`);
                  }
                  try {
                    (z.close(), console.log("Closing decoder"));
                  } catch (e) {
                    (console.log("Closing decoder"), console.log(e));
                  }
                } catch (e) {
                  (j("error", {
                    error_message: e.message,
                    error_stack: e.stack,
                    error_stage: "process",
                  }),
                    postMessage({ cmd: "error", data: e.message }));
                }
              })());
          };
        var D = n(219),
          z = n(700),
          I = n(176),
          O = n(709),
          W = n(192),
          N = n(547),
          V = n(689),
          X = n(690),
          H = n(291);
        const K = async function (e) {
          const {
            currentNetwork: t,
            currentWeights: n,
            file: r,
            duration: s,
            handle: o,
            adjustedResolution: a,
            skipDemuxProgress: u,
            websr: c,
            gpu: l,
            upscaled_canvas: f,
            ctx: _,
            resolution: d,
            progress_preview_ctx: p,
            progress_preview_canvas: h,
          } = e;
          let x = c;
          (console.log("Using MediaBunny processor"),
            console.log(`Duration ${s}`));
          const m = performance.now(),
            v = a
              ? { width: a.adjustedInputWidth, height: a.adjustedInputHeight }
              : d;
          if (
            (a
              ? (a.adjustedOutputWidth, a.adjustedOutputHeight)
              : (d.width, d.height),
            t || a)
          ) {
            const e = a ? v : d;
            x = new (i())({
              network_name: t || "anime4k/cnn-2x-16",
              weights: n,
              resolution: e,
              gpu: l,
              canvas: f,
            });
          }
          const g = new D.pC(r),
            w = new z.I({ formats: [I.bJ], source: g }),
            b = new $(),
            y = new WritableStream({
              write(e) {
                b.write(e.data, e.position);
              },
            }),
            k = new O.Pl(y),
            T = performance.now();
          console.log("Time to get WebSR: " + (T - m));
          const B = new W.r({ format: new N.E1(), target: k }),
            E = new V.D0(f, {
              codec: "avc",
              bitrate: X.n1,
              keyFrameInterval: 60,
            }),
            U = await w.getPrimaryVideoTrack();
          if (!U && !U)
            return postMessage({
              cmd: "error",
              data: "The video does not have a video track",
            });
          if (!(await U.canDecode()))
            return postMessage({
              cmd: "error",
              data: "The video could not be processed, is it a valid video file?",
            });
          let C, P;
          const R = await w.getPrimaryAudioTrack();
          R && ((C = new V.p7(R.codec)), B.addAudioTrack(C), (P = new H.a6(R)));
          const S = (await U.computePacketStats()).averagePacketRate;
          B.addVideoTrack(E, { frameRate: S });
          const A = new H.dL(U),
            F = performance.now();
          function L(e) {
            const t = performance.now() - F,
              n = Math.floor((e.timestamp / s) * 100);
            if ((postMessage({ cmd: "progress", data: n }), t > 1e3)) {
              const o = ((e.timestamp / s) * 100) / t,
                a = Math.round((100 - n) / o / 1e3);
              postMessage({
                cmd: "eta",
                data:
                  ((r = a),
                  (i = parseInt(r, 10)),
                  [Math.floor(i / 3600), Math.floor(i / 60) % 60, i % 60]
                    .map((e) => (e < 10 ? "0" + e : e))
                    .filter((e, t) => "00" !== e || t > 0)
                    .join(":")),
              });
            } else postMessage({ cmd: "eta", data: "calculating..." });
            var r, i;
          }
          await B.start();
          let M = 0;
          for await (const e of A.samples()) {
            const t = e.toVideoFrame(),
              n = await createImageBitmap(t, {
                resizeHeight: 2 * t.codedHeight,
                resizeWidth: 2 * t.codedWidth,
              });
            let r;
            if (
              ((r =
                !a ||
                (t.displayWidth === v.width && t.displayHeight === v.height)
                  ? t
                  : await createImageBitmap(t, {
                      resizeWidth: v.width,
                      resizeHeight: v.height,
                    })),
              x.render(r),
              _.transferFromImageBitmap(n),
              p && M % 50 == 0)
            ) {
              const e = await createImageBitmap(f, {
                resizeWidth: h.width,
                resizeHeight: h.height,
                resizeQuality: "high",
              });
              p.transferFromImageBitmap(e);
            }
            (E.add(e.timestamp, e.duration),
              L(e),
              t.close(),
              e.close(),
              n.close(),
              M++);
          }
          if (P) {
            const e = await R.getDecoderConfig();
            for await (const t of P.packets())
              t.timestamp > 0 && C.add(t, { decoderConfig: e });
          }
          await B.finalize();
          const j = b.toBlob("video/mp4");
          postMessage({ cmd: "finished", data: j });
        };
        var Y = n(348);
        const Q = async function (e) {
          const {
            currentNetwork: t,
            currentWeights: n,
            file: r,
            duration: s,
            handle: o,
            adjustedResolution: a,
            skipDemuxProgress: u,
            websr: c,
            gpu: l,
            backend: f,
            gl: _,
            upscaled_canvas: d,
            ctx: p,
            resolution: h,
            progress_preview_ctx: x,
            progress_preview_canvas: m,
          } = e;
          let v = c;
          (console.log("Using MediaBunny firefox processor"),
            console.log(`Duration ${s}`));
          const g = performance.now(),
            w = a
              ? { width: a.adjustedInputWidth, height: a.adjustedInputHeight }
              : h;
          if (
            (a
              ? (a.adjustedOutputWidth, a.adjustedOutputHeight)
              : (h.width, h.height),
            t || a)
          ) {
            const e = a ? w : h;
            "webgpu" === f
              ? (v = new (i())({
                  network_name: t || "anime4k/cnn-2x-16",
                  weights: n,
                  resolution: e,
                  gpu: l,
                  canvas: d,
                }))
              : "webgl" === f &&
                ((d.width = 2 * e.width),
                (d.height = 2 * e.height),
                console.log(`Upscled canvas: ${d.width}, ${d.height}`),
                (_ && _.canvas === d) || (_ = d.getContext("webgl2")),
                (v = new k({
                  source: { width: e.width, height: e.height },
                  canvas: d,
                  gl: _,
                  network_name: t || "anime4k/cnn-2x-16",
                  weights: n,
                })));
          }
          const b = new D.pC(r),
            y = new z.I({ formats: [I.bJ], source: b }),
            T = new $(),
            B = new WritableStream({
              write(e) {
                T.write(e.data, e.position);
              },
            }),
            E = new O.Pl(B),
            U = performance.now();
          console.log("Time to get WebSR: " + (U - g));
          const C = new W.r({ format: new N.E1(), target: E }),
            P = new V.Dg({ codec: "avc", bitrate: X.n1, keyFrameInterval: 60 }),
            R = await y.getPrimaryVideoTrack();
          if (!R && !R)
            return postMessage({
              cmd: "error",
              data: "The video does not have a video track",
            });
          if (!(await R.canDecode()))
            return postMessage({
              cmd: "error",
              data: "The video could not be processed, is it a valid video file?",
            });
          let S, A;
          const F = await y.getPrimaryAudioTrack();
          F && ((S = new V.p7(F.codec)), C.addAudioTrack(S), (A = new H.a6(F)));
          const L = (await R.computePacketStats()).averagePacketRate;
          C.addVideoTrack(P, { frameRate: L });
          const M = new H.dL(R),
            j = performance.now();
          function G(e) {
            const t = performance.now() - j,
              n = Math.floor((e.timestamp / s) * 100);
            if ((postMessage({ cmd: "progress", data: n }), t > 1e3)) {
              const o = ((e.timestamp / s) * 100) / t,
                a = Math.round((100 - n) / o / 1e3);
              postMessage({
                cmd: "eta",
                data:
                  ((r = a),
                  (i = parseInt(r, 10)),
                  [Math.floor(i / 3600), Math.floor(i / 60) % 60, i % 60]
                    .map((e) => (e < 10 ? "0" + e : e))
                    .filter((e, t) => "00" !== e || t > 0)
                    .join(":")),
              });
            } else postMessage({ cmd: "eta", data: "calculating..." });
            var r, i;
          }
          await C.start();
          let q = 0;
          for await (const e of M.samples()) {
            const t = e.toVideoFrame(),
              n = await createImageBitmap(t, {
                resizeHeight: 2 * t.codedHeight,
                resizeWidth: 2 * t.codedWidth,
              });
            let r, i;
            if (
              ((r =
                !a ||
                (t.displayWidth === w.width && t.displayHeight === w.height)
                  ? t
                  : await createImageBitmap(t, {
                      resizeWidth: w.width,
                      resizeHeight: w.height,
                    })),
              v.render(r),
              p.transferFromImageBitmap(n),
              "webgl" === f)
            ) {
              const e = v.readPixels();
              i = new VideoFrame(e, {
                format: "RGBA",
                codedWidth: d.width,
                codedHeight: d.height,
                timestamp: t.timestamp,
                duration: t.duration,
              });
            } else
              i = new VideoFrame(d, {
                timestamp: t.timestamp,
                duration: t.duration,
                alpha: "discard",
              });
            const s = new Y._A(i);
            if ((P.add(s), x && q % 50 == 0)) {
              const e = await createImageBitmap(i, {
                resizeWidth: m.width,
                resizeHeight: m.height,
                resizeQuality: "high",
              });
              x.transferFromImageBitmap(e);
            }
            (G(e), t.close(), e.close(), n.close(), i.close(), s.close(), q++);
          }
          if (A) {
            const e = await F.getDecoderConfig();
            for await (const t of A.packets())
              t.timestamp > 0 && S.add(t, { decoderConfig: e });
          }
          await C.finalize();
          const K = T.toBlob("video/mp4");
          postMessage({ cmd: "finished", data: K });
        };
        let J, Z, ee, te, ne, re, ie, se, oe, ae, ue, ce;
        self.onmessage = async function (e) {
          var t;
          if (e.data.cmd)
            if ("init" === e.data.cmd)
              await (async function (e) {
                let t;
                if (
                  ((ue = e.resolution),
                  (ne = e.upscaled),
                  (re = e.original),
                  (ie = e.progressPreview),
                  (oe = e.debugCanvas),
                  ie && (se = ie.getContext("bitmaprenderer")),
                  oe &&
                    ((ae = oe.getContext("2d")),
                    (oe.width = 2 * e.resolution.width),
                    (oe.height = 2 * e.resolution.height)),
                  e.videoFrame)
                ) {
                  console.log("[Worker] Creating bitmap from VideoFrame...");
                  const n = performance.now();
                  ((t = await createImageBitmap(e.videoFrame)),
                    console.log(
                      `[Worker] Bitmap creation from VideoFrame took ${Math.round(performance.now() - n)}ms`,
                    ),
                    e.videoFrame.close());
                } else if (e.imageArrayBuffer) {
                  console.log(
                    "[Worker] Creating bitmap from image ArrayBuffer...",
                  );
                  const n = performance.now(),
                    r = new Blob([e.imageArrayBuffer], {
                      type: e.imageMimeType,
                    });
                  ((t = await createImageBitmap(r)),
                    console.log(
                      `[Worker] Bitmap creation took ${Math.round(performance.now() - n)}ms`,
                    ));
                } else e.bitmap && (t = e.bitmap);
                if ("webgpu" === ee)
                  (J || (J = await i().initWebGPU()),
                    (te = new (i())({
                      network_name: e.network_name || "anime4k/cnn-2x-16",
                      weights: e.weights,
                      resolution: e.resolution,
                      gpu: J,
                      canvas: e.upscaled,
                    })));
                else if ("webgl" === ee) {
                  if (
                    ((e.upscaled.width = 2 * e.resolution.width),
                    (e.upscaled.height = 2 * e.resolution.height),
                    !Z)
                  ) {
                    if (((Z = e.upscaled.getContext("webgl2")), !Z))
                      return void console.error(
                        "Failed to get WebGL2 context from canvas",
                      );
                    if (!Z.getExtension("EXT_color_buffer_float"))
                      return void console.error(
                        "EXT_color_buffer_float not supported",
                      );
                  }
                  const n = await createImageBitmap(t, {
                    resizeWidth: e.resolution.width,
                    resizeHeight: e.resolution.height,
                  });
                  te = new k({
                    source: n,
                    canvas: e.upscaled,
                    gl: Z,
                    network_name: e.network_name || "anime4k/cnn-2x-16",
                    weights: e.weights,
                  });
                }
                ce = re.getContext("bitmaprenderer");
                const n = await createImageBitmap(t, {
                  resizeHeight: 2 * e.resolution.height,
                  resizeWidth: 2 * e.resolution.width,
                });
                ce.transferFromImageBitmap(n);
              })(e.data.data);
            else if ("isSupported" === e.data.cmd)
              await (async function () {
                if (
                  "undefined" == typeof VideoEncoder ||
                  "undefined" == typeof VideoDecoder ||
                  "undefined" == typeof EncodedVideoChunk
                )
                  return (
                    (ee = null),
                    postMessage({
                      cmd: "isSupported",
                      data: {
                        supported: !1,
                        backend: null,
                        missingFeature: "WebCodecs",
                      },
                    })
                  );
                if (
                  ((J = await i().initWebGPU()), J && J.importExternalTexture)
                )
                  return (
                    (ee = "webgpu"),
                    postMessage({
                      cmd: "isSupported",
                      data: { supported: !0, backend: "webgpu" },
                    })
                  );
                const e = new OffscreenCanvas(1, 1).getContext("webgl2");
                if (e && e.getExtension("EXT_color_buffer_float"))
                  return (
                    (ee = "webgl"),
                    postMessage({
                      cmd: "isSupported",
                      data: { supported: !0, backend: "webgl" },
                    })
                  );
                ((ee = null),
                  postMessage({
                    cmd: "isSupported",
                    data: {
                      supported: !1,
                      backend: null,
                      missingFeature: "WebGPU/WebGL",
                    },
                  }));
              })();
            else if ("process" === e.data.cmd) {
              const n = performance.now(),
                r = e.data.skipDemuxProgress || !1;
              if (
                (!ue &&
                  e.data.adjustedResolution &&
                  (ue = {
                    width: e.data.adjustedResolution.adjustedInputWidth,
                    height: e.data.adjustedResolution.adjustedInputHeight,
                  }),
                !ne && e.data.upscaled && (ne = e.data.upscaled),
                !re && e.data.original && (re = e.data.original),
                !fe && e.data.weights && (fe = e.data.weights),
                !le && e.data.network_name && (le = e.data.network_name),
                !ce && re)
              )
                try {
                  ce = re.getContext("bitmaprenderer");
                } catch (e) {
                  console.error(
                    "[Worker] Failed to get bitmaprenderer context:",
                    e,
                  );
                }
              const i = {
                  currentNetwork: le,
                  currentWeights: fe,
                  file: e.data.file,
                  duration: e.data.duration,
                  handle: e.data.handle,
                  adjustedResolution: e.data.adjustedResolution,
                  skipDemuxProgress: r,
                  websr: te,
                  gpu: J,
                  gl: Z,
                  backend: ee,
                  upscaled_canvas: ne,
                  original_canvas: re,
                  ctx: ce,
                  resolution: ue,
                  progress_preview_ctx: se,
                  progress_preview_canvas: ie,
                },
                s = T();
              let o, a;
              (Math.random() < 0
                ? "firefox" === s || "safari" === s || "webgl" == ee
                  ? ((o = "mediabunny-firefox"),
                    (a = Q),
                    postMessage({
                      cmd: "analytics",
                      event: "firefox-mediabunny-processor",
                    }))
                  : ((o = "mediabunny"),
                    (a = K),
                    postMessage({
                      cmd: "analytics",
                      event: "mediabunny-processor",
                    }))
                : "firefox" === s || "safari" === s || "webgl" == ee
                  ? ((o = "firefox"),
                    (a = G),
                    postMessage({
                      cmd: "analytics",
                      event: "firefox-processor",
                    }))
                  : ((o = "standard"),
                    (a = q),
                    postMessage({
                      cmd: "analytics",
                      event: "standard-processor",
                    })),
                (t = {
                  backend: ee,
                  processor: o,
                  network: le,
                  video_duration_sec: e.data.duration,
                  video_width: ue.width,
                  video_height: ue.height,
                  video_size_bytes: e.data.file ? e.data.file.size : 0,
                  video_fps: 30,
                }),
                (R = crypto.randomUUID()),
                A.clear(),
                (S = {
                  session_id: R,
                  browser: F(),
                  browser_version:
                    navigator.userAgent.match(
                      /(?:Chrome|Firefox|Safari|Edge)\/(\d+)/,
                    )?.[1] || "unknown",
                  os: L(),
                  is_mobile: M(),
                  backend: t.backend,
                  processor: t.processor,
                  network: t.network,
                  video_duration_sec: t.video_duration_sec,
                  video_width: t.video_width,
                  video_height: t.video_height,
                  video_size_bytes: t.video_size_bytes,
                  video_fps: t.video_fps,
                }),
                console.log("[Tracking] Session initialized:", R),
                j("start"));
              const u = performance.now();
              (console.log(`Worker: Data ready in ${u - n}ms`),
                await a(i),
                j("complete", { time_elapsed_ms: performance.now() - n }));
            } else if ("realtimeInit" === e.data.cmd) {
              const { upscaled, resolution, network_name, weights } =
                  e.data.data,
                baseResolution = {
                  width: resolution.width,
                  height: resolution.height,
                };

              if ("webgpu" === ee) {
                if (!J) J = await i().initWebGPU();
                te = new (i())({
                  network_name: network_name || "anime4k/cnn-2x-16",
                  weights,
                  resolution: baseResolution,
                  gpu: J,
                  canvas: upscaled,
                });
                realtimeState = {
                  backend: "webgpu",
                  upscaled,
                  resolution: baseResolution,
                };
              } else {
                const ctx = upscaled.getContext("2d");
                realtimeState = {
                  backend: ee || "2d",
                  upscaled,
                  ctx,
                  resolution: baseResolution,
                };
              }

              
            } else if ("realtimeFrame" === e.data.cmd) {
              if (!realtimeState) return;
              const { frame } = e.data;
              if (!frame) return;

              const { backend, upscaled, resolution } = realtimeState;

              if ("webgpu" === backend && te) {
                try {
                  const resized = await createImageBitmap(frame, {
                    resizeWidth: resolution.width,
                    resizeHeight: resolution.height,
                  });
                  await te.render(resized);
                  if (typeof resized.close === "function") resized.close();
                } finally {
                  if (typeof frame.close === "function") frame.close();
                }
              } else if (realtimeState.ctx) {
                const ctx = realtimeState.ctx;
                try {
                  ctx.clearRect(0, 0, upscaled.width, upscaled.height);
                  ctx.drawImage(frame, 0, 0, upscaled.width, upscaled.height);
                } finally {
                  if (typeof frame.close === "function") frame.close();
                }
              }
            } else
              "getImageBlob" === e.data.cmd
                ? await (async function (e, t = !1) {
                    (console.log("Bitmap or Data"),
                      console.log(e),
                      console.log("Preview"),
                      console.log(t));
                    try {
                      let n = e;
                      if (e.imageArrayBuffer) {
                        console.log(
                          "[Worker] Creating bitmap from ArrayBuffer for image blob...",
                        );
                        const t = new Blob([e.imageArrayBuffer], {
                          type: e.imageMimeType,
                        });
                        n = await createImageBitmap(t);
                      }
                      const r = new OffscreenCanvas(
                          2 * ue.width,
                          2 * ue.height,
                        ),
                        s = new OffscreenCanvas(2 * ue.width, 2 * ue.height),
                        o = new OffscreenCanvas(2 * ue.width, 2 * ue.height),
                        a = s.getContext("bitmaprenderer"),
                        u = o.getContext("2d");
                      if ("webgpu" === ee)
                        ((te = new (i())({
                          network_name: "anime4k/cnn-2x-16",
                          weights: fe,
                          resolution: ue,
                          gpu: J,
                          canvas: r,
                        })),
                          await te.render(n));
                      else if ("webgl" === ee) {
                        const e = await createImageBitmap(n, {
                            resizeWidth: ue.width,
                            resizeHeight: ue.height,
                          }),
                          t = r.getContext("webgl2");
                        (t.getExtension("EXT_color_buffer_float"),
                          (te = new k({
                            source: e,
                            canvas: r,
                            gl: t,
                            network_name: le || "anime4k/cnn-2x-16",
                            weights: fe,
                          })),
                          await te.render());
                      }
                      const c = await createImageBitmap(r);
                      a.transferFromImageBitmap(c);
                      const l = await createImageBitmap(s);
                      u.drawImage(l, 0, 0);
                      const f = await o.convertToBlob({
                        type: "image/png",
                        quality: 1,
                      });
                      postMessage({ cmd: "imageBlob", data: f, preview: t });
                    } catch (e) {
                      postMessage({ cmd: "error", data: e.message });
                    }
                  })(e.data.data, e.data.data.preview)
                : "network" === e.data.cmd
                  ? await (async function (e, t, n) {
                      let r;
                      if (((le = e), (fe = t), n.videoFrame)) {
                        console.log(
                          "[Worker] Creating bitmap from VideoFrame for network switch...",
                        );
                        const e = performance.now();
                        ((r = await createImageBitmap(n.videoFrame)),
                          console.log(
                            `[Worker] Bitmap creation from VideoFrame took ${Math.round(performance.now() - e)}ms`,
                          ),
                          n.videoFrame.close());
                      } else if (n.imageArrayBuffer) {
                        console.log(
                          "[Worker] Creating bitmap from ArrayBuffer for network switch...",
                        );
                        const e = new Blob([n.imageArrayBuffer], {
                          type: n.imageMimeType,
                        });
                        r = await createImageBitmap(e);
                      } else n.bitmap && (r = n.bitmap);
                      if ("webgpu" === ee)
                        if (
                          (te.switchNetwork(e, t),
                          r.width !== te.resolution.width ||
                            r.height !== te.resolution.height)
                        ) {
                          const e = await createImageBitmap(r, {
                            resizeWidth: te.resolution.width,
                            resizeHeight: te.resolution.height,
                          });
                          await te.render(e);
                        } else await te.render(r);
                      else if ("webgl" === ee) {
                        const n = await createImageBitmap(r, {
                          resizeWidth: ue.width,
                          resizeHeight: ue.height,
                        });
                        ((te = new k({
                          source: n,
                          canvas: ne,
                          gl: Z,
                          network_name: e,
                          weights: t,
                        })),
                          await te.render());
                      }
                      self.postMessage({ cmd: "imagePreview" });
                    })(e.data.data.name, e.data.data.weights, e.data.data)
                  : "loadImageFile" === e.data.cmd &&
                    (await (async function (e, t, n, r) {
                      try {
                        console.log("[Worker] Loading image file:", t);
                        const i = performance.now(),
                          s = await e.arrayBuffer(),
                          o = performance.now();
                        console.log(
                          `[Worker] File read time: ${Math.round(o - i)}ms`,
                        );
                        const a = await (async function (e, t, n, r) {
                            console.log(
                              "[Worker] Checking if image resize needed...",
                            );
                            const i = Math.floor(1 * n),
                              s = Math.floor(1 * r),
                              o = new Blob([e], { type: t }),
                              a = await createImageBitmap(o);
                            (console.log("Data"),
                              console.log(e),
                              console.log("Blog"),
                              console.log(o));
                            const u = a.width * a.height,
                              c = u > i,
                              l = a.width > s || a.height > s;
                            if (
                              (console.log("Iage bitmap"),
                              console.log(a),
                              console.log("Max pixels", n),
                              console.log("Max dimension", r),
                              console.log(
                                `[Worker] Image: ${a.width}×${a.height} (${u.toLocaleString()} pixels)`,
                              ),
                              console.log(
                                `[Worker] Limits: ${s}px dimension, ${i.toLocaleString()} pixels`,
                              ),
                              !c && !l)
                            )
                              return (
                                console.log(
                                  "[Worker] Image within limits, no resize needed",
                                ),
                                a.close(),
                                { data: e, mimeType: t }
                              );
                            let f = 1;
                            if (c) {
                              const e = Math.sqrt(i / u);
                              f = Math.min(f, e);
                            }
                            if (l) {
                              const e = s / a.width,
                                t = s / a.height,
                                n = Math.min(e, t);
                              f = Math.min(f, n);
                            }
                            const _ = Math.floor(a.width * f),
                              d = Math.floor(a.height * f);
                            console.log(
                              `[Worker] Resizing to ${_}×${d} (${(_ * d).toLocaleString()} pixels)`,
                            );
                            const p = new OffscreenCanvas(_, d);
                            (p.getContext("2d").drawImage(a, 0, 0, _, d),
                              a.close());
                            const h = await p.convertToBlob({
                              type: "image/png",
                              quality: 1,
                            });
                            return {
                              data: await h.arrayBuffer(),
                              mimeType: "image/png",
                            };
                          })(s, e.type, n, r),
                          u = performance.now();
                        (console.log(
                          `[Worker] Total processing time: ${Math.round(u - i)}ms`,
                        ),
                          postMessage(
                            {
                              cmd: "imageFileLoaded",
                              arrayBuffer: a.data,
                              mimeType: a.mimeType,
                              fileName: t,
                            },
                            [a.data],
                          ));
                      } catch (e) {
                        (console.error("[Worker] Error loading image file:", e),
                          postMessage({
                            cmd: "error",
                            data: `Error loading image: ${e.message}`,
                          }));
                      }
                    })(
                      e.data.file,
                      e.data.fileName,
                      e.data.maxPixels,
                      e.data.maxDimension,
                    ));
        };
        let le = null,
          fe = null;
      },
      614: (module) => {
        var factory;
        (self,
          (factory = () =>
            (() => {
              var __webpack_modules__ = {
                  "./src/context.ts": function (
                    __unused_webpack_module,
                    exports,
                  ) {
                    eval(
                      "{\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nclass WebGPUContext {\n    constructor(device, resolution, canvas, scale, debug) {\n        this.device = device;\n        this.canvas = canvas;\n        this.resolution = resolution;\n        this.textures = {};\n        this.buffers = {};\n        this.destroyed = false;\n        this.scale = scale;\n        this.debug = debug;\n        let context = this.canvas.getContext('webgpu');\n        if (context instanceof GPUCanvasContext) {\n            this.context = context;\n        }\n        else {\n            throw new Error(\"Unable to load WebGPU context\");\n        }\n        this.textureUsage = GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC;\n        this.bufferUsage = GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST;\n        this.context.configure({\n            device: this.device,\n            format: navigator.gpu.getPreferredCanvasFormat()\n        });\n        if (this.debug) {\n            // Read output pixel value\n            this.bufferUsage = this.bufferUsage | GPUBufferUsage.COPY_SRC;\n        }\n        this.textures['output'] = this.context.getCurrentTexture();\n    }\n    readBuffer(bufferName) {\n        return __awaiter(this, void 0, void 0, function* () {\n            if (!this.buffers[bufferName])\n                throw new Error(`No buffer with name ${bufferName}`);\n            const readEncoder = this.device.createCommandEncoder({\n                label: `Read ${bufferName} buffer encoder`,\n            });\n            const buffer = this.buffers[bufferName];\n            const resultBuffer = this.device.createBuffer({\n                label: 'result buffer',\n                size: buffer.size,\n                usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST\n            });\n            readEncoder.copyBufferToBuffer(buffer, 0, resultBuffer, 0, resultBuffer.size);\n            this.device.queue.submit([readEncoder.finish()]);\n            yield resultBuffer.mapAsync(GPUMapMode.READ);\n            let range = resultBuffer.getMappedRange();\n            return new Float32Array(range);\n        });\n    }\n    readTexture(textureName) {\n        return __awaiter(this, void 0, void 0, function* () {\n            if (!this.textures[textureName])\n                throw new Error(`No texture with name ${textureName}`);\n            const readEncoder = this.device.createCommandEncoder({\n                label: `Read ${textureName} texture encoder`,\n            });\n            const texture = this.textures[textureName];\n            let bitsPerPixel = 16;\n            if (texture.format === 'rgba8unorm')\n                bitsPerPixel = 4;\n            if (texture.format === 'r32float')\n                bitsPerPixel = 4;\n            const resultBuffer = this.device.createBuffer({\n                label: 'result buffer',\n                size: texture.width * texture.height * bitsPerPixel,\n                usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST\n            });\n            readEncoder.copyTextureToBuffer({\n                texture: this.textures[textureName],\n            }, {\n                buffer: resultBuffer,\n                bytesPerRow: texture.width * bitsPerPixel\n            }, {\n                width: texture.width,\n                height: texture.height,\n                depthOrArrayLayers: 1,\n            });\n            this.device.queue.submit([readEncoder.finish()]);\n            yield resultBuffer.mapAsync(GPUMapMode.READ);\n            if (texture.format === 'r32float')\n                return new Float32Array(resultBuffer.getMappedRange());\n            else if (texture.format === 'rgba32float')\n                return new Float32Array(resultBuffer.getMappedRange());\n            else if (texture.format === 'rgba8unorm')\n                return new Uint8ClampedArray(resultBuffer.getMappedRange());\n            return new Float32Array(0);\n        });\n    }\n    destroy() {\n        this.device.destroy();\n        this.destroyed = true;\n    }\n    buffer(key, options) {\n        if (!this.buffers[key]) {\n            options = options || {};\n            const width = options.width || this.resolution.width;\n            const height = options.height || this.resolution.height;\n            const channels = options.channels || 4;\n            const bitdepth = options.bitdepth || 4;\n            this.buffers[key] = this.device.createBuffer({\n                label: key,\n                size: width * height * channels * bitdepth,\n                usage: this.bufferUsage\n            });\n        }\n        return this.buffers[key];\n    }\n    texture(key, options) {\n        if (!this.textures[key]) {\n            options = options || {};\n            this.textures[key] = this.device.createTexture({\n                label: key,\n                size: [options.width || this.resolution.width, options.height || this.resolution.height],\n                format: options.format || 'rgba32float',\n                usage: this.textureUsage\n            });\n        }\n        return this.textures[key];\n    }\n}\nexports[\"default\"] = WebGPUContext;\n\n\n//# sourceURL=webpack://WebSR/./src/context.ts?\n}",
                    );
                  },
                  "./src/layers/anime4k/conv2d-112x4.ts": (
                    __unused_webpack_module,
                    exports,
                    __webpack_require__,
                  ) => {
                    eval(
                      '{\nObject.defineProperty(exports, "__esModule", ({ value: true }));\nconst base_compute_layer_1 = __webpack_require__(/*! ../base_compute_layer */ "./src/layers/base_compute_layer.ts");\nclass Anime4KConv112x4 extends base_compute_layer_1.default {\n    constructor(inputs, outputBuffer, weights, first) {\n        super(inputs, outputBuffer, weights);\n        this.label = "Anime4KConv112x4";\n        const kernels = weights.weights;\n        this.createUniform("kernels", "array<mat4x4f, 28>");\n        let read_buffers = \'\';\n        for (let i = 0; i < 7; i++) {\n            if (first) {\n                read_buffers += `\n                let pixel_val${i} = inputBuffer${i}[buff_ind];\n                result += kernels[${4 * i}]*max(pixel_val${i}, vec4f(0.0));\n                result += kernels[${4 * i + 2}]*max(-1.0*pixel_val${i}, vec4f(0.0));\n            `;\n            }\n            else {\n                read_buffers += `\n                let pixel_val${i} = inputBuffer${i}[buff_ind];\n                result += kernels[${4 * i + 1}]*max(pixel_val${i}, vec4f(0.0));\n                result += kernels[${4 * i + 3}]*max(-1.0*pixel_val${i}, vec4f(0.0));`;\n            }\n        }\n        this.shader = this.createStandardShader(`\n        \n          @compute @workgroup_size(${this.num_work_groups}, ${this.num_work_groups}) fn main( @builtin(global_invocation_id) id: vec3<u32>) {\n          \n                let x = id.x;\n                let y = id.y;\n                \n                let i = id.y*${this.resolution.width} + x;\n                var result  = vec4f(0.0, 0.0, 0.0, 0.0);\n                \n                let coord = vec2<i32>( i32(x), i32(y));\n               \n                let buff_ind = coord.y*${this.resolution.width} + coord.x;\n                ${read_buffers}\n                \n                outputBuffer[i] = result;\n          }\n        `);\n        this.setUniform("kernels", new Float32Array(kernels));\n        this.defaultSetup();\n    }\n    defaultPipelineConfig() {\n        return {\n            label: `${this.label}-pipeline`,\n            layout: \'auto\',\n            compute: {\n                module: this.shader,\n                entryPoint: \'main\',\n            },\n        };\n    }\n    defaultBindGroup() {\n        const entries = [];\n        this.inputs.forEach(function (input, i) {\n            if (input instanceof GPUExternalTexture) {\n                entries.push({ binding: i, resource: input });\n            }\n            else if (input instanceof GPUTexture) {\n                entries.push({ binding: i, resource: input.createView() });\n            }\n            else if (input instanceof GPUBuffer) {\n                entries.push({ binding: i, resource: { buffer: input } });\n            }\n        });\n        this.uniforms.forEach((uniform, i) => {\n            entries.push({\n                binding: i + this.inputs.length,\n                resource: {\n                    buffer: this.buffers[uniform.name]\n                }\n            });\n        });\n        if (this.output instanceof GPUBuffer) {\n            entries.push({\n                binding: this.inputs.length + this.uniforms.length,\n                resource: {\n                    buffer: this.output\n                }\n            });\n        }\n        if (entries.length === 0)\n            return null;\n        return this.device.createBindGroup({\n            layout: this.pipeline.getBindGroupLayout(0),\n            entries\n        });\n    }\n}\nexports["default"] = Anime4KConv112x4;\n\n\n//# sourceURL=webpack://WebSR/./src/layers/anime4k/conv2d-112x4.ts?\n}',
                    );
                  },
                  "./src/layers/anime4k/conv2d-16x4.ts": (
                    __unused_webpack_module,
                    exports,
                    __webpack_require__,
                  ) => {
                    eval(
                      '{\nObject.defineProperty(exports, "__esModule", ({ value: true }));\nconst base_compute_layer_1 = __webpack_require__(/*! ../base_compute_layer */ "./src/layers/base_compute_layer.ts");\nclass Anime4KConv16x4 extends base_compute_layer_1.default {\n    constructor(inputs, outputBuffer, weights) {\n        super(inputs, outputBuffer, weights);\n        this.label = "Anime4KConv16x4";\n        const kernels = weights.weights;\n        const bias = weights.bias;\n        this.createUniform("kernel_offsets", "array<vec4f, 9>");\n        this.createUniform("kernels", "array<mat4x4f, 36>");\n        this.createUniform("bias", "vec4f");\n        this.shader = this.createStandardShader(`\n        \n          @compute @workgroup_size(${this.num_work_groups}, ${this.num_work_groups}) fn main( @builtin(global_invocation_id) id: vec3<u32>) {\n          \n                let x = id.x;\n                let y = id.y;\n                \n                let i = id.y*${this.resolution.width} + x;\n                var result  = vec4f(0.0, 0.0, 0.0, 0.0);\n                \n                let coord = vec2<i32>( i32(x), i32(y));\n                      \n                 for(var i = 0u; i < 9; i++){\n                   let pixel_loc = coord + vec2<i32>(kernel_offsets[i].xy);\n                   let buff_ind = pixel_loc.y*${this.resolution.width} + pixel_loc.x;\n                   \n                   let pix_val0 = inputBuffer0[buff_ind];\n                   let pix_val1 = inputBuffer1[buff_ind];\n                  \n                   result += kernels[i]*max(pix_val0, vec4f(0.0));\n                   result += kernels[i+9]*max(pix_val1, vec4f(0.0));\n                   result += kernels[i+18]*max(-1.0*pix_val0, vec4f(0.0));\n                   result += kernels[i+27]*max(-1.0*pix_val1, vec4f(0.0));\n                 } \n                 \n\n                    \n                result += bias;\n                \n                outputBuffer[i] = result;\n          }\n        `);\n        this.setUniform("kernel_offsets", new Float32Array([\n            -1, -1, 0, 0,\n            -1, 0, 0, 0,\n            -1, 1, 0, 0,\n            0, -1, 0, 0,\n            0, 0, 0, 0,\n            0, 1, 0, 0,\n            1, -1, 0, 0,\n            1, 0, 0, 0,\n            1, 1, 0, 0,\n        ]));\n        this.setUniform("kernels", new Float32Array(kernels));\n        this.setUniform("bias", new Float32Array(bias));\n        this.defaultSetup();\n    }\n}\nexports["default"] = Anime4KConv16x4;\n\n\n//# sourceURL=webpack://WebSR/./src/layers/anime4k/conv2d-16x4.ts?\n}',
                    );
                  },
                  "./src/layers/anime4k/conv2d-224x4.ts": (
                    __unused_webpack_module,
                    exports,
                    __webpack_require__,
                  ) => {
                    eval(
                      '{\nObject.defineProperty(exports, "__esModule", ({ value: true }));\nconst base_compute_layer_1 = __webpack_require__(/*! ../base_compute_layer */ "./src/layers/base_compute_layer.ts");\nclass Anime4KConv224x4 extends base_compute_layer_1.default {\n    constructor(inputs, outputBuffer, weights, index) {\n        super(inputs, outputBuffer, weights);\n        this.label = "Anime4KConv224x4";\n        const kernels = weights.weights;\n        this.createUniform("kernels", "array<mat4x4f, 56>");\n        let read_buffers = \'\';\n        for (let i = 0; i < 7; i++) {\n            if (index == 0) {\n                read_buffers += `\n                let pixel_val${i} = inputBuffer${i}[buff_ind];\n                result += kernels[${8 * i}]*max(pixel_val${i}, vec4f(0.0));\n                result += kernels[${8 * i + 4}]*max(-1.0*pixel_val${i}, vec4f(0.0));\n            `;\n            }\n            else if (index == 1) {\n                read_buffers += `\n                let pixel_val${i} = inputBuffer${i}[buff_ind];\n                result += kernels[${8 * i + 1}]*max(pixel_val${i}, vec4f(0.0));\n                result += kernels[${8 * i + 5}]*max(-1.0*pixel_val${i}, vec4f(0.0));`;\n            }\n            else if (index == 2) {\n                read_buffers += `\n                let pixel_val${i} = inputBuffer${i}[buff_ind];\n                result += kernels[${8 * i + 2}]*max(pixel_val${i}, vec4f(0.0));\n                result += kernels[${8 * i + 6}]*max(-1.0*pixel_val${i}, vec4f(0.0));`;\n            }\n            else if (index == 3) {\n                read_buffers += `\n                let pixel_val${i} = inputBuffer${i}[buff_ind];\n                result += kernels[${8 * i + 3}]*max(pixel_val${i}, vec4f(0.0));\n                result += kernels[${8 * i + 7}]*max(-1.0*pixel_val${i}, vec4f(0.0));`;\n            }\n        }\n        this.shader = this.createStandardShader(`\n        \n          @compute @workgroup_size(${this.num_work_groups}, ${this.num_work_groups}) fn main( @builtin(global_invocation_id) id: vec3<u32>) {\n          \n                let x = id.x;\n                let y = id.y;\n                \n                let i = id.y*${this.resolution.width} + x;\n                var result  = vec4f(0.0, 0.0, 0.0, 0.0);\n                \n                let coord = vec2<i32>( i32(x), i32(y));\n               \n                let buff_ind = coord.y*${this.resolution.width} + coord.x;\n                ${read_buffers}\n                \n                outputBuffer[i] = result;\n          }\n        `);\n        this.setUniform("kernels", new Float32Array(kernels));\n        this.defaultSetup();\n    }\n    defaultPipelineConfig() {\n        return {\n            label: `${this.label}-pipeline`,\n            layout: \'auto\',\n            compute: {\n                module: this.shader,\n                entryPoint: \'main\',\n            },\n        };\n    }\n    defaultBindGroup() {\n        const entries = [];\n        this.inputs.forEach(function (input, i) {\n            if (input instanceof GPUExternalTexture) {\n                entries.push({ binding: i, resource: input });\n            }\n            else if (input instanceof GPUTexture) {\n                entries.push({ binding: i, resource: input.createView() });\n            }\n            else if (input instanceof GPUBuffer) {\n                entries.push({ binding: i, resource: { buffer: input } });\n            }\n        });\n        this.uniforms.forEach((uniform, i) => {\n            entries.push({\n                binding: i + this.inputs.length,\n                resource: {\n                    buffer: this.buffers[uniform.name]\n                }\n            });\n        });\n        if (this.output instanceof GPUBuffer) {\n            entries.push({\n                binding: this.inputs.length + this.uniforms.length,\n                resource: {\n                    buffer: this.output\n                }\n            });\n        }\n        if (entries.length === 0)\n            return null;\n        return this.device.createBindGroup({\n            layout: this.pipeline.getBindGroupLayout(0),\n            entries\n        });\n    }\n}\nexports["default"] = Anime4KConv224x4;\n\n\n//# sourceURL=webpack://WebSR/./src/layers/anime4k/conv2d-224x4.ts?\n}',
                    );
                  },
                  "./src/layers/anime4k/conv2d-32x4.ts": (
                    __unused_webpack_module,
                    exports,
                    __webpack_require__,
                  ) => {
                    eval(
                      '{\nObject.defineProperty(exports, "__esModule", ({ value: true }));\nconst base_compute_layer_1 = __webpack_require__(/*! ../base_compute_layer */ "./src/layers/base_compute_layer.ts");\nclass Anime4KConv32x4 extends base_compute_layer_1.default {\n    constructor(inputs, outputBuffer, weights) {\n        super(inputs, outputBuffer, weights);\n        this.label = "Anime4KConv32x4";\n        const kernels = weights.weights;\n        const bias = weights.bias;\n        this.createUniform("kernel_offsets", "array<vec4f, 9>");\n        this.createUniform("kernels", "array<mat4x4f, 72>");\n        this.createUniform("bias", "vec4f");\n        this.shader = this.createStandardShader(`\n        \n          @compute @workgroup_size(${this.num_work_groups}, ${this.num_work_groups}) fn main( @builtin(global_invocation_id) id: vec3<u32>) {\n          \n                let x = id.x;\n                let y = id.y;\n                \n                let i = id.y*${this.resolution.width} + x;\n                var result  = vec4f(0.0, 0.0, 0.0, 0.0);\n                \n                let coord = vec2<i32>( i32(x), i32(y));\n                      \n                 for(var i = 0u; i < 9; i++){\n                   let pixel_loc = coord + vec2<i32>(kernel_offsets[i].xy);\n                   let buff_ind = pixel_loc.y*${this.resolution.width} + pixel_loc.x;\n                   \n                   let pix_val0 = inputBuffer0[buff_ind];\n                   let pix_val1 = inputBuffer1[buff_ind];\n                   let pix_val2 = inputBuffer2[buff_ind];\n                   let pix_val3 = inputBuffer3[buff_ind];\n                  \n                   result += kernels[i]*max(pix_val0, vec4f(0.0));\n                   result += kernels[i+9]*max(pix_val1, vec4f(0.0));\n                   result += kernels[i+18]*max(pix_val2, vec4f(0.0));\n                   result += kernels[i+27]*max(pix_val3, vec4f(0.0));\n                   \n                   result += kernels[i+36]*max(-1.0*pix_val0, vec4f(0.0));\n                   result += kernels[i+45]*max(-1.0*pix_val1, vec4f(0.0));\n                   result += kernels[i+54]*max(-1.0*pix_val2, vec4f(0.0));\n                   result += kernels[i+63]*max(-1.0*pix_val3, vec4f(0.0));\n   \n                 } \n                 \n\n                    \n                result += bias;\n                \n                outputBuffer[i] = result;\n          }\n        `);\n        this.setUniform("kernel_offsets", new Float32Array([\n            -1, -1, 0, 0,\n            -1, 0, 0, 0,\n            -1, 1, 0, 0,\n            0, -1, 0, 0,\n            0, 0, 0, 0,\n            0, 1, 0, 0,\n            1, -1, 0, 0,\n            1, 0, 0, 0,\n            1, 1, 0, 0,\n        ]));\n        this.setUniform("kernels", new Float32Array(kernels));\n        this.setUniform("bias", new Float32Array(bias));\n        this.defaultSetup();\n    }\n}\nexports["default"] = Anime4KConv32x4;\n\n\n//# sourceURL=webpack://WebSR/./src/layers/anime4k/conv2d-32x4.ts?\n}',
                    );
                  },
                  "./src/layers/anime4k/conv2d-336x4.ts": (
                    __unused_webpack_module,
                    exports,
                    __webpack_require__,
                  ) => {
                    eval(
                      '{\nObject.defineProperty(exports, "__esModule", ({ value: true }));\nconst base_compute_layer_1 = __webpack_require__(/*! ../base_compute_layer */ "./src/layers/base_compute_layer.ts");\nclass Anime4KConv336x4 extends base_compute_layer_1.default {\n    constructor(inputs, outputBuffer, weights, index) {\n        super(inputs, outputBuffer, weights);\n        this.label = "Anime4KConv336x4";\n        const kernels = weights.weights;\n        this.createUniform("kernels", "array<mat4x4f, 84>");\n        let read_buffers = \'\';\n        for (let i = 0; i < 7; i++) {\n            if (index == 0) {\n                read_buffers += `\n                let pixel_val${i} = inputBuffer${i}[buff_ind];\n                result += kernels[${12 * i}]*max(pixel_val${i}, vec4f(0.0));\n                result += kernels[${12 * i + 6}]*max(-1.0*pixel_val${i}, vec4f(0.0));\n            `;\n            }\n            else if (index == 1) {\n                read_buffers += `\n                let pixel_val${i} = inputBuffer${i}[buff_ind];\n                result += kernels[${12 * i + 1}]*max(pixel_val${i}, vec4f(0.0));\n                result += kernels[${12 * i + 7}]*max(-1.0*pixel_val${i}, vec4f(0.0));`;\n            }\n            else if (index == 2) {\n                read_buffers += `\n                let pixel_val${i} = inputBuffer${i}[buff_ind];\n                result += kernels[${12 * i + 2}]*max(pixel_val${i}, vec4f(0.0));\n                result += kernels[${12 * i + 8}]*max(-1.0*pixel_val${i}, vec4f(0.0));`;\n            }\n            else if (index == 3) {\n                read_buffers += `\n                let pixel_val${i} = inputBuffer${i}[buff_ind];\n                result += kernels[${12 * i + 3}]*max(pixel_val${i}, vec4f(0.0));\n                result += kernels[${12 * i + 9}]*max(-1.0*pixel_val${i}, vec4f(0.0));`;\n            }\n            else if (index == 4) {\n                read_buffers += `\n                let pixel_val${i} = inputBuffer${i}[buff_ind];\n                result += kernels[${12 * i + 4}]*max(pixel_val${i}, vec4f(0.0));\n                result += kernels[${12 * i + 10}]*max(-1.0*pixel_val${i}, vec4f(0.0));`;\n            }\n            else if (index == 5) {\n                read_buffers += `\n                let pixel_val${i} = inputBuffer${i}[buff_ind];\n                result += kernels[${12 * i + 5}]*max(pixel_val${i}, vec4f(0.0));\n                result += kernels[${12 * i + 11}]*max(-1.0*pixel_val${i}, vec4f(0.0));`;\n            }\n        }\n        this.shader = this.createStandardShader(`\n        \n          @compute @workgroup_size(${this.num_work_groups}, ${this.num_work_groups}) fn main( @builtin(global_invocation_id) id: vec3<u32>) {\n          \n                let x = id.x;\n                let y = id.y;\n                \n                let i = id.y*${this.resolution.width} + x;\n                var result  = vec4f(0.0, 0.0, 0.0, 0.0);\n                \n                let coord = vec2<i32>( i32(x), i32(y));\n               \n                let buff_ind = coord.y*${this.resolution.width} + coord.x;\n                ${read_buffers}\n                \n                outputBuffer[i] = result;\n          }\n        `);\n        this.setUniform("kernels", new Float32Array(kernels));\n        this.defaultSetup();\n    }\n    defaultPipelineConfig() {\n        return {\n            label: `${this.label}-pipeline`,\n            layout: \'auto\',\n            compute: {\n                module: this.shader,\n                entryPoint: \'main\',\n            },\n        };\n    }\n    defaultBindGroup() {\n        const entries = [];\n        this.inputs.forEach(function (input, i) {\n            if (input instanceof GPUExternalTexture) {\n                entries.push({ binding: i, resource: input });\n            }\n            else if (input instanceof GPUTexture) {\n                entries.push({ binding: i, resource: input.createView() });\n            }\n            else if (input instanceof GPUBuffer) {\n                entries.push({ binding: i, resource: { buffer: input } });\n            }\n        });\n        this.uniforms.forEach((uniform, i) => {\n            entries.push({\n                binding: i + this.inputs.length,\n                resource: {\n                    buffer: this.buffers[uniform.name]\n                }\n            });\n        });\n        if (this.output instanceof GPUBuffer) {\n            entries.push({\n                binding: this.inputs.length + this.uniforms.length,\n                resource: {\n                    buffer: this.output\n                }\n            });\n        }\n        if (entries.length === 0)\n            return null;\n        return this.device.createBindGroup({\n            layout: this.pipeline.getBindGroupLayout(0),\n            entries\n        });\n    }\n}\nexports["default"] = Anime4KConv336x4;\n\n\n//# sourceURL=webpack://WebSR/./src/layers/anime4k/conv2d-336x4.ts?\n}',
                    );
                  },
                  "./src/layers/anime4k/conv2d-392x4.ts": (
                    __unused_webpack_module,
                    exports,
                    __webpack_require__,
                  ) => {
                    eval(
                      '{\nObject.defineProperty(exports, "__esModule", ({ value: true }));\nconst base_compute_layer_1 = __webpack_require__(/*! ../base_compute_layer */ "./src/layers/base_compute_layer.ts");\nclass Anime4KConv392x4 extends base_compute_layer_1.default {\n    constructor(inputs, outputBuffer, weights, index) {\n        super(inputs, outputBuffer, weights);\n        this.label = "Anime4KConv392x4";\n        const kernels = weights.weights;\n        this.createUniform("kernels", "array<mat4x4f, 98>");\n        let read_buffers = \'\';\n        for (let i = 0; i < 7; i++) {\n            if (index == 0) {\n                read_buffers += `\n                let pixel_val${i} = inputBuffer${i}[buff_ind];\n                result += kernels[${14 * i}]*max(pixel_val${i}, vec4f(0.0));\n                result += kernels[${14 * i + 7}]*max(-1.0*pixel_val${i}, vec4f(0.0));\n            `;\n            }\n            else if (index == 1) {\n                read_buffers += `\n                let pixel_val${i} = inputBuffer${i}[buff_ind];\n                result += kernels[${14 * i + 1}]*max(pixel_val${i}, vec4f(0.0));\n                result += kernels[${14 * i + 8}]*max(-1.0*pixel_val${i}, vec4f(0.0));`;\n            }\n            else if (index == 2) {\n                read_buffers += `\n                let pixel_val${i} = inputBuffer${i}[buff_ind];\n                result += kernels[${14 * i + 2}]*max(pixel_val${i}, vec4f(0.0));\n                result += kernels[${14 * i + 9}]*max(-1.0*pixel_val${i}, vec4f(0.0));`;\n            }\n            else if (index == 3) {\n                read_buffers += `\n                let pixel_val${i} = inputBuffer${i}[buff_ind];\n                result += kernels[${14 * i + 3}]*max(pixel_val${i}, vec4f(0.0));\n                result += kernels[${14 * i + 10}]*max(-1.0*pixel_val${i}, vec4f(0.0));`;\n            }\n            else if (index == 4) {\n                read_buffers += `\n                let pixel_val${i} = inputBuffer${i}[buff_ind];\n                result += kernels[${14 * i + 4}]*max(pixel_val${i}, vec4f(0.0));\n                result += kernels[${14 * i + 11}]*max(-1.0*pixel_val${i}, vec4f(0.0));`;\n            }\n            else if (index == 5) {\n                read_buffers += `\n                let pixel_val${i} = inputBuffer${i}[buff_ind];\n                result += kernels[${14 * i + 5}]*max(pixel_val${i}, vec4f(0.0));\n                result += kernels[${14 * i + 12}]*max(-1.0*pixel_val${i}, vec4f(0.0));`;\n            }\n            else if (index == 6) {\n                read_buffers += `\n                let pixel_val${i} = inputBuffer${i}[buff_ind];\n                result += kernels[${14 * i + 6}]*max(pixel_val${i}, vec4f(0.0));\n                result += kernels[${14 * i + 13}]*max(-1.0*pixel_val${i}, vec4f(0.0));`;\n            }\n        }\n        this.shader = this.createStandardShader(`\n        \n          @compute @workgroup_size(${this.num_work_groups}, ${this.num_work_groups}) fn main( @builtin(global_invocation_id) id: vec3<u32>) {\n          \n                let x = id.x;\n                let y = id.y;\n                \n                let i = id.y*${this.resolution.width} + x;\n                var result  = vec4f(0.0, 0.0, 0.0, 0.0);\n                \n                let coord = vec2<i32>( i32(x), i32(y));\n               \n                let buff_ind = coord.y*${this.resolution.width} + coord.x;\n                ${read_buffers}\n                \n                outputBuffer[i] = result;\n          }\n        `);\n        this.setUniform("kernels", new Float32Array(kernels));\n        this.defaultSetup();\n    }\n    defaultPipelineConfig() {\n        return {\n            label: `${this.label}-pipeline`,\n            layout: \'auto\',\n            compute: {\n                module: this.shader,\n                entryPoint: \'main\',\n            },\n        };\n    }\n    defaultBindGroup() {\n        const entries = [];\n        this.inputs.forEach(function (input, i) {\n            if (input instanceof GPUExternalTexture) {\n                entries.push({ binding: i, resource: input });\n            }\n            else if (input instanceof GPUTexture) {\n                entries.push({ binding: i, resource: input.createView() });\n            }\n            else if (input instanceof GPUBuffer) {\n                entries.push({ binding: i, resource: { buffer: input } });\n            }\n        });\n        this.uniforms.forEach((uniform, i) => {\n            entries.push({\n                binding: i + this.inputs.length,\n                resource: {\n                    buffer: this.buffers[uniform.name]\n                }\n            });\n        });\n        if (this.output instanceof GPUBuffer) {\n            entries.push({\n                binding: this.inputs.length + this.uniforms.length,\n                resource: {\n                    buffer: this.output\n                }\n            });\n        }\n        if (entries.length === 0)\n            return null;\n        return this.device.createBindGroup({\n            layout: this.pipeline.getBindGroupLayout(0),\n            entries\n        });\n    }\n}\nexports["default"] = Anime4KConv392x4;\n\n\n//# sourceURL=webpack://WebSR/./src/layers/anime4k/conv2d-392x4.ts?\n}',
                    );
                  },
                  "./src/layers/anime4k/conv2d-3x4.ts": (
                    __unused_webpack_module,
                    exports,
                    __webpack_require__,
                  ) => {
                    eval(
                      '{\nObject.defineProperty(exports, "__esModule", ({ value: true }));\nconst base_compute_layer_1 = __webpack_require__(/*! ../base_compute_layer */ "./src/layers/base_compute_layer.ts");\nclass Anime4KConv3x4 extends base_compute_layer_1.default {\n    constructor(inputTextures, outputBuffer, weights) {\n        super(inputTextures, outputBuffer, weights);\n        this.label = "Anime4KConv3x4";\n        const kernels = weights.weights;\n        const bias = weights.bias;\n        this.createUniform("kernel_offsets", "array<vec4f, 9>");\n        this.createUniform("kernels", "array<mat4x4f, 9>");\n        this.createUniform("bias", "vec4f");\n        // Set up pipeline in Lazy Load\n        this.setUniform("kernel_offsets", new Float32Array([\n            -1, -1, 0, 0,\n            -1, 0, 0, 0,\n            -1, 1, 0, 0,\n            0, -1, 0, 0,\n            0, 0, 0, 0,\n            0, 1, 0, 0,\n            1, -1, 0, 0,\n            1, 0, 0, 0,\n            1, 1, 0, 0,\n        ]));\n        this.setUniform("kernels", new Float32Array(kernels));\n        this.setUniform("bias", new Float32Array(bias));\n    }\n    lazyLoadSetup() {\n        const externalTexture = this.inputs[0] instanceof GPUExternalTexture;\n        const textureLoad = externalTexture ? \'textureLoad(inputTexture0, coord + offset)\' :\n            \'textureLoad(inputTexture0, coord + offset, 0)\';\n        this.shader = this.createStandardShader(`\n        \n          @compute @workgroup_size(${this.num_work_groups}, ${this.num_work_groups}) fn main( @builtin(global_invocation_id) id: vec3<u32>) {\n          \n                let x = id.x;\n                let y = id.y;\n                \n                let i = id.y*${this.resolution.width} + x;\n                var result  = vec4f(0.0, 0.0, 0.0, 0.0);\n                \n                let coord = vec2<i32>( i32(x), i32(y));\n                      \n                 for(var i = 0u; i < 9; i++){\n                   let offset = vec2<i32>(kernel_offsets[i].xy);\n                   result += kernels[i]*vec4f(${textureLoad});\n                 } \n                    \n                result += bias;\n                \n                outputBuffer[i] = result;\n          }\n        `);\n        this.pipeline = this.device.createComputePipeline(this.defaultPipelineConfig());\n        this.bindGroup = this.defaultBindGroup();\n    }\n}\nexports["default"] = Anime4KConv3x4;\n\n\n//# sourceURL=webpack://WebSR/./src/layers/anime4k/conv2d-3x4.ts?\n}',
                    );
                  },
                  "./src/layers/anime4k/conv2d-48x4.ts": (
                    __unused_webpack_module,
                    exports,
                    __webpack_require__,
                  ) => {
                    eval(
                      '{\nObject.defineProperty(exports, "__esModule", ({ value: true }));\nconst base_compute_layer_1 = __webpack_require__(/*! ../base_compute_layer */ "./src/layers/base_compute_layer.ts");\nclass Anime4KConv32x4 extends base_compute_layer_1.default {\n    constructor(inputs, outputBuffer, weights) {\n        super(inputs, outputBuffer, weights);\n        this.label = "Anime4KConv32x4";\n        const kernels = weights.weights;\n        const bias = weights.bias;\n        this.createUniform("kernel_offsets", "array<vec4f, 9>");\n        this.createUniform("kernels", "array<mat4x4f, 108>");\n        this.createUniform("bias", "vec4f");\n        this.shader = this.createStandardShader(`\n        \n          @compute @workgroup_size(${this.num_work_groups}, ${this.num_work_groups}) fn main( @builtin(global_invocation_id) id: vec3<u32>) {\n          \n                let x = id.x;\n                let y = id.y;\n                \n                let i = id.y*${this.resolution.width} + x;\n                var result  = vec4f(0.0, 0.0, 0.0, 0.0);\n                \n                let coord = vec2<i32>( i32(x), i32(y));\n                      \n                 for(var i = 0u; i < 9; i++){\n                   let pixel_loc = coord + vec2<i32>(kernel_offsets[i].xy);\n                   let buff_ind = pixel_loc.y*${this.resolution.width} + pixel_loc.x;\n                   \n                   let pix_val0 = inputBuffer0[buff_ind];\n                   let pix_val1 = inputBuffer1[buff_ind];\n                   let pix_val2 = inputBuffer2[buff_ind];\n                   let pix_val3 = inputBuffer3[buff_ind];\n                   let pix_val4 = inputBuffer4[buff_ind];\n                   let pix_val5 = inputBuffer5[buff_ind];\n                  \n                   result += kernels[i]*max(pix_val0, vec4f(0.0));\n                   result += kernels[i+9]*max(pix_val1, vec4f(0.0));\n                   result += kernels[i+18]*max(pix_val2, vec4f(0.0));\n                   result += kernels[i+27]*max(pix_val3, vec4f(0.0));\n                   result += kernels[i+36]*max(pix_val4, vec4f(0.0));\n                   result += kernels[i+45]*max(pix_val5, vec4f(0.0));\n                   \n                   result += kernels[i+54]*max(-1.0*pix_val0, vec4f(0.0));\n                   result += kernels[i+63]*max(-1.0*pix_val1, vec4f(0.0));\n                   result += kernels[i+72]*max(-1.0*pix_val2, vec4f(0.0));\n                   result += kernels[i+81]*max(-1.0*pix_val3, vec4f(0.0));\n                   result += kernels[i+90]*max(-1.0*pix_val4, vec4f(0.0));\n                   result += kernels[i+99]*max(-1.0*pix_val5, vec4f(0.0));\n   \n                 } \n                 \n\n                    \n                result += bias;\n                \n                outputBuffer[i] = result;\n          }\n        `);\n        this.setUniform("kernel_offsets", new Float32Array([\n            -1, -1, 0, 0,\n            -1, 0, 0, 0,\n            -1, 1, 0, 0,\n            0, -1, 0, 0,\n            0, 0, 0, 0,\n            0, 1, 0, 0,\n            1, -1, 0, 0,\n            1, 0, 0, 0,\n            1, 1, 0, 0,\n        ]));\n        this.setUniform("kernels", new Float32Array(kernels));\n        this.setUniform("bias", new Float32Array(bias));\n        this.defaultSetup();\n    }\n}\nexports["default"] = Anime4KConv32x4;\n\n\n//# sourceURL=webpack://WebSR/./src/layers/anime4k/conv2d-48x4.ts?\n}',
                    );
                  },
                  "./src/layers/anime4k/conv2d-56x4-2.ts": (
                    __unused_webpack_module,
                    exports,
                    __webpack_require__,
                  ) => {
                    eval(
                      '{\nObject.defineProperty(exports, "__esModule", ({ value: true }));\nconst base_compute_layer_1 = __webpack_require__(/*! ../base_compute_layer */ "./src/layers/base_compute_layer.ts");\nclass Anime4KConv56x4 extends base_compute_layer_1.default {\n    constructor(inputs, outputBuffer, weights) {\n        super(inputs, outputBuffer, weights);\n        this.label = "Anime4KConv56x4";\n        const kernels = weights.weights;\n        const bias = weights.bias;\n        this.createUniform("kernel_offsets", "array<vec4f, 9>");\n        this.createUniform("kernels", "array<mat4x4f, 126>");\n        this.createUniform("bias", "vec4f");\n        this.shader = this.createStandardShader(`\n        \n          @compute @workgroup_size(${this.num_work_groups}, ${this.num_work_groups}) fn main( @builtin(global_invocation_id) id: vec3<u32>) {\n          \n                let x = id.x;\n                let y = id.y;\n                \n                let i = id.y*${this.resolution.width} + x;\n                var result  = vec4f(0.0, 0.0, 0.0, 0.0);\n                \n                let coord = vec2<i32>( i32(x), i32(y));\n                      \n                 for(var i = 0u; i < 9; i++){\n                   let pixel_loc = coord + vec2<i32>(kernel_offsets[i].xy);\n                   let buff_ind = pixel_loc.y*${this.resolution.width} + pixel_loc.x;\n                   \n                   let pix_val0 = inputBuffer0[buff_ind];\n                   let pix_val1 = inputBuffer1[buff_ind];\n                   let pix_val2 = inputBuffer2[buff_ind];\n                   let pix_val3 = inputBuffer3[buff_ind];\n                   let pix_val4 = inputBuffer4[buff_ind];\n                   let pix_val5 = inputBuffer5[buff_ind];\n                   let pix_val6 = inputBuffer6[buff_ind];\n                  \n                   result += kernels[i]*max(pix_val0, vec4f(0.0));\n                   result += kernels[i+9]*max(pix_val1, vec4f(0.0));\n                   result += kernels[i+18]*max(pix_val2, vec4f(0.0));\n                   result += kernels[i+27]*max(pix_val3, vec4f(0.0));\n                   result += kernels[i+36]*max(pix_val4, vec4f(0.0));\n                   result += kernels[i+45]*max(pix_val5, vec4f(0.0));\n                   result += kernels[i+54]*max(pix_val6, vec4f(0.0));\n                   \n                   result += kernels[i+63]*max(-1.0*pix_val0, vec4f(0.0));\n                   result += kernels[i+72]*max(-1.0*pix_val1, vec4f(0.0));\n                   result += kernels[i+81]*max(-1.0*pix_val2, vec4f(0.0));\n                   result += kernels[i+90]*max(-1.0*pix_val3, vec4f(0.0));\n                   result += kernels[i+99]*max(-1.0*pix_val4, vec4f(0.0));\n                   result += kernels[i+108]*max(-1.0*pix_val5, vec4f(0.0));\n                   result += kernels[i+117]*max(-1.0*pix_val6, vec4f(0.0));\n                 } \n                 \n\n                    \n                result += bias;\n                \n                outputBuffer[i] = result;\n          }\n        `);\n        this.setUniform("kernel_offsets", new Float32Array([\n            -1, -1, 0, 0,\n            -1, 0, 0, 0,\n            -1, 1, 0, 0,\n            0, -1, 0, 0,\n            0, 0, 0, 0,\n            0, 1, 0, 0,\n            1, -1, 0, 0,\n            1, 0, 0, 0,\n            1, 1, 0, 0,\n        ]));\n        this.setUniform("kernels", new Float32Array(kernels));\n        this.setUniform("bias", new Float32Array(bias));\n        this.defaultSetup();\n    }\n}\nexports["default"] = Anime4KConv56x4;\n\n\n//# sourceURL=webpack://WebSR/./src/layers/anime4k/conv2d-56x4-2.ts?\n}',
                    );
                  },
                  "./src/layers/anime4k/conv2d-56x4.ts": (
                    __unused_webpack_module,
                    exports,
                    __webpack_require__,
                  ) => {
                    eval(
                      '{\nObject.defineProperty(exports, "__esModule", ({ value: true }));\nconst base_compute_layer_1 = __webpack_require__(/*! ../base_compute_layer */ "./src/layers/base_compute_layer.ts");\nclass Anime4KConv56x4 extends base_compute_layer_1.default {\n    constructor(inputs, outputBuffer, weights) {\n        super(inputs, outputBuffer, weights);\n        this.label = "Anime4KConv56x4";\n        const kernels = weights.weights;\n        const bias = weights.bias;\n        this.createUniform("kernels", "array<mat4x4f, 14>");\n        this.createUniform("bias", "vec4f");\n        let read_buffers = \'\';\n        for (let i = 0; i < 7; i++) {\n            read_buffers += `\n            let pixel_val${i} = inputBuffer${i}[buff_ind];\n            result += kernels[${2 * i}]*max(pixel_val${i}, vec4f(0.0));\n            result += kernels[${2 * i + 1}]*max(-1.0*pixel_val${i}, vec4f(0.0));\n            `;\n        }\n        this.shader = this.createStandardShader(`\n        \n          @compute @workgroup_size(${this.num_work_groups}, ${this.num_work_groups}) fn main( @builtin(global_invocation_id) id: vec3<u32>) {\n          \n                let x = id.x;\n                let y = id.y;\n                \n                let i = id.y*${this.resolution.width} + x;\n                var result  = vec4f(0.0, 0.0, 0.0, 0.0);\n                \n                let coord = vec2<i32>( i32(x), i32(y));\n               \n                let buff_ind = coord.y*${this.resolution.width} + coord.x;\n                ${read_buffers}\n                      \n                result += bias;\n                \n                outputBuffer[buff_ind] = result;\n          }\n        `);\n        this.setUniform("kernels", new Float32Array(kernels));\n        this.setUniform("bias", new Float32Array(bias));\n        this.defaultSetup();\n    }\n    defaultPipelineConfig() {\n        return {\n            label: `${this.label}-pipeline`,\n            layout: \'auto\',\n            compute: {\n                module: this.shader,\n                entryPoint: \'main\',\n            },\n        };\n    }\n    defaultBindGroup() {\n        const entries = [];\n        this.inputs.forEach(function (input, i) {\n            if (input instanceof GPUExternalTexture) {\n                entries.push({ binding: i, resource: input });\n            }\n            else if (input instanceof GPUTexture) {\n                entries.push({ binding: i, resource: input.createView() });\n            }\n            else if (input instanceof GPUBuffer) {\n                entries.push({ binding: i, resource: { buffer: input } });\n            }\n        });\n        this.uniforms.forEach((uniform, i) => {\n            entries.push({\n                binding: i + this.inputs.length,\n                resource: {\n                    buffer: this.buffers[uniform.name]\n                }\n            });\n        });\n        if (this.output instanceof GPUBuffer) {\n            entries.push({\n                binding: this.inputs.length + this.uniforms.length,\n                resource: {\n                    buffer: this.output\n                }\n            });\n        }\n        if (entries.length === 0)\n            return null;\n        return this.device.createBindGroup({\n            layout: this.pipeline.getBindGroupLayout(0),\n            entries\n        });\n    }\n}\nexports["default"] = Anime4KConv56x4;\n\n\n//# sourceURL=webpack://WebSR/./src/layers/anime4k/conv2d-56x4.ts?\n}',
                    );
                  },
                  "./src/layers/anime4k/conv2d-8x4.ts": (
                    __unused_webpack_module,
                    exports,
                    __webpack_require__,
                  ) => {
                    eval(
                      '{\nObject.defineProperty(exports, "__esModule", ({ value: true }));\nconst base_compute_layer_1 = __webpack_require__(/*! ../base_compute_layer */ "./src/layers/base_compute_layer.ts");\nclass Anime4KConv8x4 extends base_compute_layer_1.default {\n    constructor(inputs, outputBuffer, weights) {\n        super(inputs, outputBuffer, weights);\n        this.label = "Anime4KConv8x4";\n        const kernels = weights.weights;\n        const bias = weights.bias;\n        this.createUniform("kernel_offsets", "array<vec4f, 9>");\n        this.createUniform("kernels", "array<mat4x4f, 18>");\n        this.createUniform("bias", "vec4f");\n        this.shader = this.createStandardShader(`\n        \n          @compute @workgroup_size(${this.num_work_groups}, ${this.num_work_groups}) fn main( @builtin(global_invocation_id) id: vec3<u32>) {\n          \n                let x = id.x;\n                let y = id.y;\n                \n                let i = id.y*${this.resolution.width} + x;\n                var result  = vec4f(0.0, 0.0, 0.0, 0.0);\n                \n                let coord = vec2<i32>( i32(x), i32(y));\n                      \n                 for(var i = 0u; i < 9; i++){\n                   let pixel_loc = coord + vec2<i32>(kernel_offsets[i].xy);\n                   let buff_ind = pixel_loc.y*${this.resolution.width} + pixel_loc.x;\n                   \n                   let pix_val = inputBuffer0[buff_ind];\n                  \n                   result += kernels[i]*max(pix_val, vec4f(0.0));\n                   result += kernels[i+9]*max(-1.0*pix_val, vec4f(0.0));\n                 } \n                    \n                result += bias;\n                \n                outputBuffer[i] = result;\n          }\n        `);\n        this.setUniform("kernel_offsets", new Float32Array([\n            -1, -1, 0, 0,\n            -1, 0, 0, 0,\n            -1, 1, 0, 0,\n            0, -1, 0, 0,\n            0, 0, 0, 0,\n            0, 1, 0, 0,\n            1, -1, 0, 0,\n            1, 0, 0, 0,\n            1, 1, 0, 0,\n        ]));\n        this.setUniform("kernels", new Float32Array(kernels));\n        this.setUniform("bias", new Float32Array(bias));\n        this.defaultSetup();\n    }\n}\nexports["default"] = Anime4KConv8x4;\n\n\n//# sourceURL=webpack://WebSR/./src/layers/anime4k/conv2d-8x4.ts?\n}',
                    );
                  },
                  "./src/layers/anime4k/conv2d-concat2.ts": (
                    __unused_webpack_module,
                    exports,
                    __webpack_require__,
                  ) => {
                    eval(
                      '{\nObject.defineProperty(exports, "__esModule", ({ value: true }));\nconst base_compute_layer_1 = __webpack_require__(/*! ../base_compute_layer */ "./src/layers/base_compute_layer.ts");\nclass Anime4KConcat2 extends base_compute_layer_1.default {\n    constructor(inputs, outputBuffer, weights) {\n        super(inputs, outputBuffer, weights);\n        this.label = "Anime4KConcat2";\n        this.createUniform("bias", "vec4f");\n        const bias = weights.bias;\n        this.shader = this.createStandardShader(`\n        \n          @compute @workgroup_size(${this.num_work_groups}, ${this.num_work_groups}) fn main( @builtin(global_invocation_id) id: vec3<u32>) {\n          \n                let x = id.x;\n                let y = id.y;\n                \n                let i = id.y*${this.resolution.width} + x;\n                var result  = vec4f(0.0, 0.0, 0.0, 0.0);\n                \n                let coord = vec2<i32>( i32(x), i32(y));\n               \n                let buff_ind = coord.y*${this.resolution.width} + coord.x;\n               \n                outputBuffer[buff_ind] = inputBuffer0[buff_ind] + inputBuffer1[buff_ind] + bias;\n          }\n        `);\n        this.setUniform("bias", new Float32Array(bias));\n        this.defaultSetup();\n    }\n}\nexports["default"] = Anime4KConcat2;\n\n\n//# sourceURL=webpack://WebSR/./src/layers/anime4k/conv2d-concat2.ts?\n}',
                    );
                  },
                  "./src/layers/anime4k/conv2d-concat4.ts": (
                    __unused_webpack_module,
                    exports,
                    __webpack_require__,
                  ) => {
                    eval(
                      '{\nObject.defineProperty(exports, "__esModule", ({ value: true }));\nconst base_compute_layer_1 = __webpack_require__(/*! ../base_compute_layer */ "./src/layers/base_compute_layer.ts");\nclass Anime4KConcat4 extends base_compute_layer_1.default {\n    constructor(inputs, outputBuffer, weights) {\n        super(inputs, outputBuffer, weights);\n        this.label = "Anime4KConcat4";\n        this.createUniform("bias", "vec4f");\n        const bias = weights.bias;\n        this.shader = this.createStandardShader(`\n        \n          @compute @workgroup_size(${this.num_work_groups}, ${this.num_work_groups}) fn main( @builtin(global_invocation_id) id: vec3<u32>) {\n          \n                let x = id.x;\n                let y = id.y;\n                \n                let i = id.y*${this.resolution.width} + x;\n                var result  = vec4f(0.0, 0.0, 0.0, 0.0);\n                \n                let coord = vec2<i32>( i32(x), i32(y));\n               \n                let buff_ind = coord.y*${this.resolution.width} + coord.x;\n               \n                outputBuffer[buff_ind] = inputBuffer0[buff_ind] + inputBuffer1[buff_ind] + inputBuffer2[buff_ind] + inputBuffer3[buff_ind] + bias;\n          }\n        `);\n        this.setUniform("bias", new Float32Array(bias));\n        this.defaultSetup();\n    }\n}\nexports["default"] = Anime4KConcat4;\n\n\n//# sourceURL=webpack://WebSR/./src/layers/anime4k/conv2d-concat4.ts?\n}',
                    );
                  },
                  "./src/layers/anime4k/conv2d-concat6.ts": (
                    __unused_webpack_module,
                    exports,
                    __webpack_require__,
                  ) => {
                    eval(
                      '{\nObject.defineProperty(exports, "__esModule", ({ value: true }));\nconst base_compute_layer_1 = __webpack_require__(/*! ../base_compute_layer */ "./src/layers/base_compute_layer.ts");\nclass Anime4KConcat6 extends base_compute_layer_1.default {\n    constructor(inputs, outputBuffer, weights) {\n        super(inputs, outputBuffer, weights);\n        this.label = "Anime4KConcat6";\n        this.createUniform("bias", "vec4f");\n        const bias = weights.bias;\n        this.shader = this.createStandardShader(`\n        \n          @compute @workgroup_size(${this.num_work_groups}, ${this.num_work_groups}) fn main( @builtin(global_invocation_id) id: vec3<u32>) {\n          \n                let x = id.x;\n                let y = id.y;\n                \n                let i = id.y*${this.resolution.width} + x;\n                var result  = vec4f(0.0, 0.0, 0.0, 0.0);\n                \n                let coord = vec2<i32>( i32(x), i32(y));\n               \n                let buff_ind = coord.y*${this.resolution.width} + coord.x;\n               \n                outputBuffer[buff_ind] = inputBuffer0[buff_ind] + inputBuffer1[buff_ind] + inputBuffer2[buff_ind] + inputBuffer3[buff_ind] + inputBuffer4[buff_ind] + inputBuffer5[buff_ind] + bias;\n          }\n        `);\n        this.setUniform("bias", new Float32Array(bias));\n        this.defaultSetup();\n    }\n}\nexports["default"] = Anime4KConcat6;\n\n\n//# sourceURL=webpack://WebSR/./src/layers/anime4k/conv2d-concat6.ts?\n}',
                    );
                  },
                  "./src/layers/anime4k/conv2d-concat7.ts": (
                    __unused_webpack_module,
                    exports,
                    __webpack_require__,
                  ) => {
                    eval(
                      '{\nObject.defineProperty(exports, "__esModule", ({ value: true }));\nconst base_compute_layer_1 = __webpack_require__(/*! ../base_compute_layer */ "./src/layers/base_compute_layer.ts");\nclass Anime4KConcat7 extends base_compute_layer_1.default {\n    constructor(inputs, outputBuffer, weights) {\n        super(inputs, outputBuffer, weights);\n        this.label = "Anime4KConcat7";\n        this.createUniform("bias", "vec4f");\n        const bias = weights.bias;\n        this.shader = this.createStandardShader(`\n        \n          @compute @workgroup_size(${this.num_work_groups}, ${this.num_work_groups}) fn main( @builtin(global_invocation_id) id: vec3<u32>) {\n          \n                let x = id.x;\n                let y = id.y;\n                \n                let i = id.y*${this.resolution.width} + x;\n                var result  = vec4f(0.0, 0.0, 0.0, 0.0);\n                \n                let coord = vec2<i32>( i32(x), i32(y));\n               \n                let buff_ind = coord.y*${this.resolution.width} + coord.x;\n               \n                outputBuffer[buff_ind] = inputBuffer0[buff_ind] + inputBuffer1[buff_ind] + inputBuffer2[buff_ind] + inputBuffer3[buff_ind] + inputBuffer4[buff_ind] + inputBuffer5[buff_ind] + inputBuffer6[buff_ind] + bias;\n          }\n        `);\n        this.setUniform("bias", new Float32Array(bias));\n        this.defaultSetup();\n    }\n}\nexports["default"] = Anime4KConcat7;\n\n\n//# sourceURL=webpack://WebSR/./src/layers/anime4k/conv2d-concat7.ts?\n}',
                    );
                  },
                  "./src/layers/anime4k/display.ts": (
                    __unused_webpack_module,
                    exports,
                    __webpack_require__,
                  ) => {
                    eval(
                      '{\nObject.defineProperty(exports, "__esModule", ({ value: true }));\nconst base_render_layer_1 = __webpack_require__(/*! ../base_render_layer */ "./src/layers/base_render_layer.ts");\nclass DisplayLayer extends base_render_layer_1.default {\n    constructor(inputs, output) {\n        super(inputs, output);\n        this.label = "DisplayLayer";\n        this.vertexScale = {\n            width: 1,\n            height: 1\n        };\n        this.sampler = this.device.createSampler({\n            addressModeU: "repeat",\n            addressModeV: "repeat",\n            magFilter: "linear",\n            minFilter: "linear",\n            mipmapFilter: "linear",\n        });\n    }\n    lazyLoadSetup() {\n        const externalTexture = this.inputs[1] instanceof GPUExternalTexture;\n        const textureLoad = externalTexture ? \'textureSampleBaseClampToEdge(inputTexture, ourSampler, input.tex_coord)\' :\n            \'textureSample(inputTexture, ourSampler, input.tex_coord)\';\n        this.shader = this.device.createShaderModule({\n            label: `${this.label}-shader`,\n            code: `\n                \n                   ${this.defaultVertexShader()}\n                   @group(0) @binding(0) var<storage, read_write> inputBuffer0: array<vec4f>;\n                   @group(0) @binding(1) var inputTexture: ${externalTexture ? \'texture_external\' : \'texture_2d<f32>\'};\n                   @group(0) @binding(2) var ourSampler: sampler;\n                  \n                   @fragment fn fragmentMain(input: VertexShaderOutput) -> @location(0) vec4f {\n                      \n                        let x = ${this.resolution.width}.0*(input.tex_coord.x);\n                        let y = ${this.resolution.height}.0*(input.tex_coord.y);\n                        \n                        let y2 = u32(floor(y));\n                        let x2 = u32(floor(x));\n                        \n                        let i = y2*${Math.floor(this.resolution.width)} +  x2;\n                       \n                        let x_floor  = u32(fract(x)*2.0);\n                        let y_floor  = u32(fract(y)*2.0);\n                        \n                        //I don t know, I think this is right? I found this by trial and error\n                        let c_index: u32 = x_floor + y_floor*2;  \n        \n                        let value = inputBuffer0[i][c_index];\n                        \n                        let bicubic = ${textureLoad};\n                        \n                        return bicubic + vec4f(value)*0.001;\n                    \n                      }            \n            `\n        });\n        this.pipeline = this.device.createRenderPipeline(this.defaultPipelineConfig());\n        this.bindGroup = this.defaultBindGroup();\n        this.renderPassDescriptor = this.defaultRenderPassDescriptor();\n    }\n    defaultBindGroup() {\n        const entries = [];\n        this.inputs.forEach(function (input, i) {\n            if (input instanceof GPUExternalTexture) {\n                entries.push({ binding: i, resource: input });\n            }\n            else if (input instanceof GPUTexture) {\n                entries.push({ binding: i, resource: input.createView() });\n            }\n            else if (input instanceof GPUBuffer) {\n                entries.push({ binding: i, resource: { buffer: input } });\n            }\n        });\n        entries.push({ binding: this.inputs.length, resource: this.sampler });\n        return this.device.createBindGroup({\n            layout: this.pipeline.getBindGroupLayout(0),\n            entries\n        });\n    }\n}\nexports["default"] = DisplayLayer;\n\n\n//# sourceURL=webpack://WebSR/./src/layers/anime4k/display.ts?\n}',
                    );
                  },
                  "./src/layers/anime4k/display_1x.ts": (
                    __unused_webpack_module,
                    exports,
                    __webpack_require__,
                  ) => {
                    eval(
                      '{\nObject.defineProperty(exports, "__esModule", ({ value: true }));\nconst base_render_layer_1 = __webpack_require__(/*! ../base_render_layer */ "./src/layers/base_render_layer.ts");\nclass DisplayLayer extends base_render_layer_1.default {\n    constructor(inputs, output) {\n        super(inputs, output);\n        this.label = "DisplayLayer";\n        this.vertexScale = {\n            width: 1,\n            height: 1\n        };\n        this.sampler = this.device.createSampler({\n            addressModeU: "repeat",\n            addressModeV: "repeat",\n            magFilter: "linear",\n            minFilter: "linear",\n            mipmapFilter: "linear",\n        });\n    }\n    lazyLoadSetup() {\n        const externalTexture = this.inputs[1] instanceof GPUExternalTexture;\n        const textureLoad = externalTexture ? \'textureSampleBaseClampToEdge(inputTexture, ourSampler, input.tex_coord)\' :\n            \'textureSample(inputTexture, ourSampler, input.tex_coord)\';\n        this.shader = this.device.createShaderModule({\n            label: `${this.label}-shader`,\n            code: `\n                \n                   ${this.defaultVertexShader()}\n                   @group(0) @binding(0) var<storage, read_write> inputBuffer0: array<vec4f>;\n                   @group(0) @binding(1) var inputTexture: ${externalTexture ? \'texture_external\' : \'texture_2d<f32>\'};\n                   @group(0) @binding(2) var ourSampler: sampler;\n                  \n                   @fragment fn fragmentMain(input: VertexShaderOutput) -> @location(0) vec4f {\n                      \n                        let x = ${this.resolution.width}.0*(input.tex_coord.x);\n                        let y = ${this.resolution.height}.0*(input.tex_coord.y);\n                        \n                        let y2 = u32(floor(y));\n                        let x2 = u32(floor(x));\n                        \n                        let i = y2*${Math.floor(this.resolution.width)} +  x2;\n      \n                        let bicubic = ${textureLoad};\n                        \n                        return bicubic + inputBuffer0[i];\n                    \n                      }            \n            `\n        });\n        this.pipeline = this.device.createRenderPipeline(this.defaultPipelineConfig());\n        this.bindGroup = this.defaultBindGroup();\n        this.renderPassDescriptor = this.defaultRenderPassDescriptor();\n    }\n    defaultBindGroup() {\n        const entries = [];\n        this.inputs.forEach(function (input, i) {\n            if (input instanceof GPUExternalTexture) {\n                entries.push({ binding: i, resource: input });\n            }\n            else if (input instanceof GPUTexture) {\n                entries.push({ binding: i, resource: input.createView() });\n            }\n            else if (input instanceof GPUBuffer) {\n                entries.push({ binding: i, resource: { buffer: input } });\n            }\n        });\n        entries.push({ binding: this.inputs.length, resource: this.sampler });\n        return this.device.createBindGroup({\n            layout: this.pipeline.getBindGroupLayout(0),\n            entries\n        });\n    }\n}\nexports["default"] = DisplayLayer;\n\n\n//# sourceURL=webpack://WebSR/./src/layers/anime4k/display_1x.ts?\n}',
                    );
                  },
                  "./src/layers/anime4k/display_3c.ts": (
                    __unused_webpack_module,
                    exports,
                    __webpack_require__,
                  ) => {
                    eval(
                      "{\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst base_render_layer_1 = __webpack_require__(/*! ../base_render_layer */ \"./src/layers/base_render_layer.ts\");\nclass DisplayLayer3C extends base_render_layer_1.default {\n    constructor(inputs, output) {\n        super(inputs, output);\n        this.label = \"DisplayLayer3C\";\n        this.vertexScale = {\n            width: 1,\n            height: 1\n        };\n        // Use nearest neighbor since we'll do manual bicubic sampling in the shader\n        this.sampler = this.device.createSampler({\n            addressModeU: \"clamp-to-edge\",\n            addressModeV: \"clamp-to-edge\",\n            magFilter: \"nearest\",\n            minFilter: \"nearest\",\n        });\n    }\n    lazyLoadSetup() {\n        const externalTexture = this.inputs[3] instanceof GPUExternalTexture;\n        // We'll replace this with bicubic sampling function\n        const textureLoad = 'sampleBicubic(inputTexture, ourSampler, input.tex_coord)';\n        this.shader = this.device.createShaderModule({\n            label: `${this.label}-shader`,\n            code: `\n                   ${this.defaultVertexShader()}\n                   @group(0) @binding(0) var<storage, read_write> inputBuffer0: array<vec4f>;\n                   @group(0) @binding(1) var<storage, read_write> inputBuffer1: array<vec4f>;\n                   @group(0) @binding(2) var<storage, read_write> inputBuffer2: array<vec4f>;\n                   @group(0) @binding(3) var inputTexture: ${externalTexture ? 'texture_external' : 'texture_2d<f32>'};\n                   @group(0) @binding(4) var ourSampler: sampler;\n                   \n                   // Bicubic weight function (Catmull-Rom)\n                   fn bicubic_weight(t: f32) -> f32 {\n                        let abs_t = abs(t);\n                        if (abs_t >= 2.0) {\n                            return 0.0;\n                        }\n                        \n                        let t2 = t * t;\n                        let t3 = abs_t * t2;\n                        \n                        if (abs_t <= 1.0) {\n                            return 1.5 * t3 - 2.5 * t2 + 1.0;\n                        } else {\n                            return -0.5 * t3 + 2.5 * t2 - 4.0 * abs_t + 2.0;\n                        }\n                   }\n                   \n                   // Bicubic sampling function\n                   fn sampleBicubic(texture: ${externalTexture ? 'texture_external' : 'texture_2d<f32>'}, sampler: sampler, tex_coord: vec2<f32>) -> vec4<f32> {\n                        let tex_size = vec2<f32>(textureDimensions(texture));\n                        let pixel_coord = tex_coord * tex_size - 0.5;\n                        let base_coord = floor(pixel_coord);\n                        let fract_coord = pixel_coord - base_coord;\n                        \n                        var result = vec3<f32>(0.0);\n                        var weight_sum = 0.0;\n                        \n                        // Sample 4x4 neighborhood for bicubic\n                        for (var y = -1; y <= 2; y = y + 1) {\n                            for (var x = -1; x <= 2; x = x + 1) {\n                                let sample_coord = (base_coord + vec2<f32>(f32(x), f32(y)) + 0.5) / tex_size;\n                                let sample_color = ${externalTexture ? 'textureSampleBaseClampToEdge(texture, sampler, sample_coord).rgb' : 'textureSample(texture, sampler, sample_coord).rgb'};\n                                \n                                let weight_x = bicubic_weight(fract_coord.x - f32(x));\n                                let weight_y = bicubic_weight(fract_coord.y - f32(y));\n                                let weight = weight_x * weight_y;\n                                \n                                result += sample_color * weight;\n                                weight_sum += weight;\n                            }\n                        }\n                        \n                        // Normalize\n                        if (weight_sum > 0.0) {\n                            result = result / weight_sum;\n                        }\n                        \n                        return vec4<f32>(result, 1.0);\n                   }\n                  \n                   @fragment fn fragmentMain(input: VertexShaderOutput) -> @location(0) vec4f {\n                      \n                        let x = ${this.resolution.width}.0*(input.tex_coord.x);\n                        let y = ${this.resolution.height}.0*(input.tex_coord.y);\n                        \n                        let y2 = u32(floor(y));\n                        let x2 = u32(floor(x));\n                        \n                        let i = y2*${Math.floor(this.resolution.width)} +  x2;\n                       \n                        let x_floor  = u32(fract(x)*2.0);\n                        let y_floor  = u32(fract(y)*2.0);\n                        \n                        //I don t know, I think this is right? I found this by trial and error\n                        let c_index: u32 = x_floor + y_floor*2;  \n        \n                        let value = f32(inputBuffer0[i][c_index]);\n                        let value1 = f32(inputBuffer1[i][c_index]);\n                        let value2 = f32(inputBuffer2[i][c_index]);\n                        \n                        let bicubic = ${textureLoad};\n                        \n                        return bicubic + vec4f(value, value1, value2, 1.0);\n                    \n                      }            \n            `\n        });\n        this.pipeline = this.device.createRenderPipeline(this.defaultPipelineConfig());\n        this.bindGroup = this.defaultBindGroup();\n        this.renderPassDescriptor = this.defaultRenderPassDescriptor();\n    }\n    defaultPipelineConfig() {\n        return {\n            label: `${this.label}-pipeline`,\n            layout: 'auto',\n            vertex: {\n                module: this.shader,\n                entryPoint: 'vertexMain',\n            },\n            fragment: {\n                module: this.shader,\n                entryPoint: 'fragmentMain',\n                targets: [{ format: this.output.format }],\n            },\n        };\n    }\n    defaultBindGroup() {\n        const entries = [];\n        this.inputs.forEach(function (input, i) {\n            if (input instanceof GPUExternalTexture) {\n                entries.push({ binding: i, resource: input });\n            }\n            else if (input instanceof GPUTexture) {\n                entries.push({ binding: i, resource: input.createView() });\n            }\n            else if (input instanceof GPUBuffer) {\n                entries.push({ binding: i, resource: { buffer: input } });\n            }\n        });\n        entries.push({ binding: this.inputs.length, resource: this.sampler });\n        return this.device.createBindGroup({\n            layout: this.pipeline.getBindGroupLayout(0),\n            entries\n        });\n    }\n}\nexports[\"default\"] = DisplayLayer3C;\n\n\n//# sourceURL=webpack://WebSR/./src/layers/anime4k/display_3c.ts?\n}",
                    );
                  },
                  "./src/layers/base_compute_layer.ts": (
                    __unused_webpack_module,
                    exports,
                    __webpack_require__,
                  ) => {
                    eval(
                      "{\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst base_layer_1 = __webpack_require__(/*! ./base_layer */ \"./src/layers/base_layer.ts\");\nclass ComputeLayer extends base_layer_1.default {\n    constructor(inputTextures, outputBuffer, weights) {\n        super(inputTextures, outputBuffer, weights);\n        this.num_work_groups = 8;\n    }\n    createStandardShader(computeShader) {\n        return this.device.createShaderModule({\n            label: `${this.label}-shader`,\n            code: `\n              ${this.computeShaderInputs()}\n              \n              ${computeShader}\n        `\n        });\n    }\n    computeShaderInputs() {\n        const inputs = [];\n        for (let i = 0; i < this.inputs.length; i++) {\n            if (this.inputs[i] instanceof GPUTexture) {\n                inputs.push(`@group(0) @binding(${i}) var inputTexture${i}: texture_2d<f32>;`);\n            }\n            else if (this.inputs[i] instanceof GPUExternalTexture) {\n                inputs.push(`@group(0) @binding(${i}) var inputTexture${i}: texture_external;`);\n            }\n            else if (this.inputs[i] instanceof GPUBuffer) {\n                inputs.push(`@group(0) @binding(${i}) var<storage, read_write> inputBuffer${i}: array<vec4f>;`);\n            }\n            else {\n                throw new Error(\"Input is undefined or non of the correct input type\");\n            }\n        }\n        this.uniforms.forEach((uniform, i) => {\n            inputs.push(`@group(0) @binding(${i + this.inputs.length}) var <uniform> ${uniform.name}: ${uniform.type};`);\n        });\n        inputs.push(`@group(0) @binding(${this.inputs.length + this.uniforms.length}) var <storage, read_write> outputBuffer: array<vec4f>;`);\n        return inputs.join('\\n');\n    }\n    defaultPipelineConfig() {\n        return {\n            label: `${this.label}-pipeline`,\n            layout: 'auto',\n            compute: {\n                module: this.shader,\n                entryPoint: 'main',\n            },\n        };\n    }\n    defaultSetup() {\n        this.pipeline = this.device.createComputePipeline(this.defaultPipelineConfig());\n        this.bindGroup = this.defaultBindGroup();\n    }\n    lazyLoadSetup() {\n    }\n    run() {\n        const encoder = this.device.createCommandEncoder({ label: this.label });\n        if (!this.pipeline)\n            this.lazyLoadSetup();\n        const pass = encoder.beginComputePass({ label: this.label });\n        pass.setPipeline(this.pipeline);\n        if (this.hasExternalTexture()) {\n            this.bindGroup = this.defaultBindGroup();\n        }\n        if (this.bindGroup) {\n            pass.setBindGroup(0, this.bindGroup);\n        }\n        // Dividing into work groups speeds up inference. If width or height aren't cleandly divided by work groups, we round to the nearest multiple of work-groups\n        // Physically, this means shaving a few pixels (up to num_work_groups-1) off the bottom and right edges of the canvas but users shouldn't notice?\n        pass.dispatchWorkgroups(Math.floor(this.resolution.width / this.num_work_groups), Math.floor(this.resolution.height / this.num_work_groups));\n        pass.end();\n        this.device.queue.submit([encoder.finish()]);\n    }\n}\nexports[\"default\"] = ComputeLayer;\n\n\n//# sourceURL=webpack://WebSR/./src/layers/base_compute_layer.ts?\n}",
                    );
                  },
                  "./src/layers/base_layer.ts": (
                    __unused_webpack_module,
                    exports,
                  ) => {
                    eval(
                      '{\nObject.defineProperty(exports, "__esModule", ({ value: true }));\nclass Layer {\n    constructor(inputs, output, weights) {\n        this.context = globalThis.context;\n        this.device = this.context.device;\n        this.resolution = this.context.resolution;\n        this.inputs = inputs;\n        this.output = output;\n        this.uniforms = [];\n        this.buffers = {};\n        this.weights = weights;\n    }\n    createUniform(name, type) {\n        this.uniforms.push({ name, type });\n    }\n    setUniform(name, value) {\n        const buffer = this.device.createBuffer({\n            label: `layer-${this.label}-buffer-${name}`,\n            size: value.byteLength,\n            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,\n        });\n        this.device.queue.writeBuffer(buffer, /*bufferOffset=*/ 0, value);\n        this.buffers[name] = buffer;\n    }\n    defaultBindGroup() {\n        const entries = [];\n        this.inputs.forEach(function (input, i) {\n            if (input instanceof GPUExternalTexture) {\n                entries.push({ binding: i, resource: input });\n            }\n            else if (input instanceof GPUTexture) {\n                entries.push({ binding: i, resource: input.createView() });\n            }\n            else if (input instanceof GPUBuffer) {\n                entries.push({ binding: i, resource: { buffer: input } });\n            }\n        });\n        this.uniforms.forEach((uniform, i) => {\n            entries.push({\n                binding: i + this.inputs.length,\n                resource: {\n                    buffer: this.buffers[uniform.name]\n                }\n            });\n        });\n        if (this.output instanceof GPUBuffer) {\n            entries.push({\n                binding: this.inputs.length + this.uniforms.length,\n                resource: {\n                    buffer: this.output\n                }\n            });\n        }\n        if (entries.length === 0)\n            return null;\n        return this.device.createBindGroup({\n            layout: this.pipeline.getBindGroupLayout(0),\n            entries\n        });\n    }\n    hasExternalTexture() {\n        for (const input of this.inputs) {\n            if (input instanceof GPUExternalTexture)\n                return true;\n        }\n        return false;\n    }\n    lazyLoadSetup() { }\n    run() { }\n}\nexports["default"] = Layer;\n\n\n//# sourceURL=webpack://WebSR/./src/layers/base_layer.ts?\n}',
                    );
                  },
                  "./src/layers/base_render_layer.ts": (
                    __unused_webpack_module,
                    exports,
                    __webpack_require__,
                  ) => {
                    eval(
                      "{\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst base_layer_1 = __webpack_require__(/*! ./base_layer */ \"./src/layers/base_layer.ts\");\nclass RenderLayer extends base_layer_1.default {\n    constructor(inputs, output, weights) {\n        super(inputs, output, weights);\n        this.vertexScale = this.context.resolution;\n    }\n    defaultVertexShader() {\n        return `\n        \n             struct VertexShaderOutput {\n                @builtin(position) position: vec4f,\n                @location(0) tex_coord: vec2f,\n              };\n\n            @vertex\n            fn vertexMain( @builtin(vertex_index) vertexIndex : u32) ->  VertexShaderOutput{\n                let pos = array(\n                // 1st triangle\n                vec2f( -1.0,  -1.0),  // center\n                vec2f( 1.0,  -1.0),  // right, center\n                vec2f( -1.0,  1.0),  // center, top\n             \n                // 2st triangle\n                vec2f( -1.0,  1.0),  // center, top\n                vec2f( 1.0,  -1.0),  // right, center\n                vec2f( 1.0,  1.0),  // right, top\n              );\n             \n              var vsOutput: VertexShaderOutput;\n              let xy = pos[vertexIndex];\n              vsOutput.position = vec4f(xy, 0.0, 1.0);\n              vsOutput.tex_coord = xy*0.5 + 0.5;\n              vsOutput.tex_coord.y = - 1.0* vsOutput.tex_coord.y  + 1.0;\n               vsOutput.tex_coord.x =  vsOutput.tex_coord.x*${this.vertexScale.width};\n               vsOutput.tex_coord.y =  vsOutput.tex_coord.y*${this.vertexScale.height};\n              return vsOutput;\n            }\n        `;\n    }\n    defaultPipelineConfig() {\n        return {\n            label: `${this.label}-pipeline`,\n            layout: 'auto',\n            vertex: {\n                module: this.shader,\n                entryPoint: 'vertexMain',\n            },\n            fragment: {\n                module: this.shader,\n                entryPoint: 'fragmentMain',\n                targets: [{ format: this.output.format }],\n            },\n        };\n    }\n    defaultSetup() {\n        this.pipeline = this.device.createRenderPipeline(this.defaultPipelineConfig());\n        this.bindGroup = this.defaultBindGroup();\n        this.renderPassDescriptor = this.defaultRenderPassDescriptor();\n    }\n    defaultRenderPassDescriptor() {\n        return {\n            label: `${this.label}-render-pass`,\n            colorAttachments: [\n                {\n                    view: this.output.createView(),\n                    clearValue: [0, 0, 0, 1],\n                    loadOp: 'clear',\n                    storeOp: 'store',\n                },\n            ],\n        };\n    }\n    createStandardShader(fragmentShader) {\n        return this.device.createShaderModule({\n            label: `${this.label}-shader`,\n            code: `\n          \n              ${this.defaultVertexShader()}\n              \n              ${this.fragmentShaderInputs()}\n              \n              ${fragmentShader}\n        `\n        });\n    }\n    fragmentShaderInputs() {\n        const inputs = [];\n        for (let i = 0; i < this.inputs.length; i++) {\n            let type = (this.inputs[i] instanceof GPUTexture) ? 'texture_2d<f32>' : 'texture_external';\n            inputs.push(`@group(0) @binding(0) var inputTexture${i}: ${type};`);\n        }\n        this.uniforms.forEach((uniform, i) => {\n            inputs.push(`@group(0) @binding(${i + this.inputs.length}) var <uniform> ${uniform.name}: ${uniform.type};`);\n        });\n        return inputs.join('\\n');\n    }\n    run() {\n        const encoder = this.device.createCommandEncoder({ label: this.label });\n        if (!this.pipeline)\n            this.lazyLoadSetup();\n        const pass = encoder.beginRenderPass(this.renderPassDescriptor);\n        pass.setPipeline(this.pipeline);\n        if (this.hasExternalTexture()) {\n            this.bindGroup = this.defaultBindGroup();\n        }\n        if (this.bindGroup) {\n            pass.setBindGroup(0, this.bindGroup);\n        }\n        pass.draw(6); // call our vertex shader 6 times\n        pass.end();\n        this.device.queue.submit([encoder.finish()]);\n    }\n    setOutput(outputTexture) {\n        this.output = outputTexture;\n        this.renderPassDescriptor = this.defaultRenderPassDescriptor();\n    }\n}\nexports[\"default\"] = RenderLayer;\n\n\n//# sourceURL=webpack://WebSR/./src/layers/base_render_layer.ts?\n}",
                    );
                  },
                  "./src/layers/utils/gaussian.ts": (
                    __unused_webpack_module,
                    exports,
                    __webpack_require__,
                  ) => {
                    eval(
                      '{\nObject.defineProperty(exports, "__esModule", ({ value: true }));\nconst base_render_layer_1 = __webpack_require__(/*! ../base_render_layer */ "./src/layers/base_render_layer.ts");\nclass GuassianLayer extends base_render_layer_1.default {\n    constructor(inputTextures, outputTexture) {\n        super(inputTextures, outputTexture);\n        this.label = "Gaussian";\n        this.createUniform("gaussian", "array<vec3f, 3>");\n        this.createUniform("kernel_offsets", "array<vec4f, 9>");\n        this.shader = this.createStandardShader(`\n        \n                  @fragment fn fragmentMain(input: VertexShaderOutput) -> @location(0) vec4f {\n                  \n                     var val  = 0.0;\n                      \n                     for(var i = 0u; i < 3; i++){\n                     \n                        let a = vec3f(\n                            textureLoad(inputTexture0, vec2<i32>(input.tex_coord + kernel_offsets[i*3].xy), 0).x,\n                            textureLoad(inputTexture0, vec2<i32>(input.tex_coord + kernel_offsets[i*3].xy), 0).x,\n                            textureLoad(inputTexture0, vec2<i32>(input.tex_coord + kernel_offsets[i*3].xy), 0).x\n                        );\n                        \n                        val += dot(a, gaussian[i]);\n                      \n                    } \n                  \n                    \n                    return vec4f(val, val, val, 1.0);\n                  }                 \n        `);\n        this.setUniform("gaussian", new Float32Array([\n            0.0675, 0.125, 0.0675, 0.0,\n            0.125, 0.250, 0.1250, 0.0,\n            0.0675, 0.125, 0.0675, 0.0\n        ]));\n        this.setUniform("kernel_offsets", new Float32Array([\n            -1, -1, 0, 0,\n            0, -1, 0, 0,\n            1, -1, 0, 0,\n            -1, 0, 0, 0,\n            0, 0, 0, 0,\n            1, 0, 0, 0,\n            -1, 1, 0, 0,\n            0, 1, 0, 0,\n            1, 1, 0, 0,\n        ]));\n        this.defaultSetup();\n    }\n}\nexports["default"] = GuassianLayer;\n\n\n//# sourceURL=webpack://WebSR/./src/layers/utils/gaussian.ts?\n}',
                    );
                  },
                  "./src/layers/utils/rgb_2_yuv.ts": (
                    __unused_webpack_module,
                    exports,
                    __webpack_require__,
                  ) => {
                    eval(
                      '{\nObject.defineProperty(exports, "__esModule", ({ value: true }));\nconst base_render_layer_1 = __webpack_require__(/*! ../base_render_layer */ "./src/layers/base_render_layer.ts");\nclass RGB2YUV extends base_render_layer_1.default {\n    constructor(inputTextures, outputTexture) {\n        super(inputTextures, outputTexture);\n        this.createUniform("rgb2yuv", "mat3x3f");\n        this.shader = this.createStandardShader(`\n        \n               @fragment fn fragmentMain(input: VertexShaderOutput) -> @location(0) vec4f {\n              \n                    let color = textureLoad(inputTexture0, vec2<i32>(input.tex_coord), 0);       \n                    let yuv = rgb2yuv*color.xyz;\n          \n                return vec4f(yuv, 1.0);\n              }     \n        `);\n        this.setUniform("rgb2yuv", new Float32Array([\n            0.299, -0.1473, 0.615, 1.0,\n            0.587, -.2886, -.51499, 1.0,\n            0.114, 0.436, -.1001, 1.0\n        ]));\n        this.defaultSetup();\n    }\n}\nexports["default"] = RGB2YUV;\n\n\n//# sourceURL=webpack://WebSR/./src/layers/utils/rgb_2_yuv.ts?\n}',
                    );
                  },
                  "./src/main.ts": function (
                    __unused_webpack_module,
                    exports,
                    __webpack_require__,
                  ) {
                    eval(
                      '{\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\nObject.defineProperty(exports, "__esModule", ({ value: true }));\nconst context_1 = __webpack_require__(/*! ./context */ "./src/context.ts");\nconst renderer_1 = __webpack_require__(/*! ./renderer */ "./src/renderer.ts");\nconst network_list_1 = __webpack_require__(/*! ./networks/network_list */ "./src/networks/network_list.ts");\nclass WebSR {\n    constructor(params) {\n        if (!network_list_1.NetworkList[params.network_name])\n            throw Error(`Network ${params.network_name} is not defined or implemented`);\n        this.source = params.source;\n        const source = this.source;\n        this.resolution = params.resolution ? params.resolution : {\n            width: (source instanceof HTMLVideoElement) ? source.videoWidth : (source instanceof HTMLImageElement) ? source.naturalWidth : source.width,\n            height: (source instanceof HTMLVideoElement) ? source.videoHeight : (source instanceof HTMLImageElement) ? source.naturalHeight : source.height\n        };\n        const scale = network_list_1.NetworkScales[params.network_name];\n        if (params.canvas)\n            this.canvas = params.canvas;\n        else {\n            this.canvas = new HTMLCanvasElement();\n            this.canvas.width = this.resolution.width * scale;\n            this.canvas.height = this.resolution.height * scale;\n        }\n        this.scale = scale;\n        this.context = new context_1.default(params.gpu, this.resolution, this.canvas, this.scale, this.debug);\n        globalThis.context = this.context;\n        this.network = new network_list_1.NetworkList[params.network_name](params.weights);\n        this.renderer = new renderer_1.default(this.network, this.source);\n    }\n    switchNetwork(network, weights) {\n        if (!network_list_1.NetworkList[network])\n            throw Error(`Network ${network} is not defined or implemented`);\n        this.network = new network_list_1.NetworkList[network](weights);\n        this.renderer.switchNetwork(this.network);\n    }\n    static initWebGPU() {\n        return __awaiter(this, void 0, void 0, function* () {\n            if (!navigator.gpu)\n                return false;\n            const adapter = yield navigator.gpu.requestAdapter();\n            if (!adapter)\n                return false;\n            const device = yield adapter.requestDevice({});\n            if (!device)\n                return false;\n            return device;\n        });\n    }\n    start() {\n        return __awaiter(this, void 0, void 0, function* () {\n            yield this.renderer.start();\n        });\n    }\n    stop() {\n        return __awaiter(this, void 0, void 0, function* () {\n            yield this.renderer.stop();\n        });\n    }\n    render(source) {\n        return __awaiter(this, void 0, void 0, function* () {\n            yield this.renderer.render(source);\n        });\n    }\n    destroy() {\n        return __awaiter(this, void 0, void 0, function* () {\n            yield this.renderer.stop();\n            this.context.destroy();\n        });\n    }\n}\nexports["default"] = WebSR;\n\n\n//# sourceURL=webpack://WebSR/./src/main.ts?\n}',
                    );
                  },
                  "./src/networks/anime4k/cnn-2x-16.ts": function (
                    __unused_webpack_module,
                    exports,
                    __webpack_require__,
                  ) {
                    eval(
                      "{\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst base_network_1 = __webpack_require__(/*! ../base_network */ \"./src/networks/base_network.ts\");\nconst conv2d_3x4_1 = __webpack_require__(/*! ../../layers/anime4k/conv2d-3x4 */ \"./src/layers/anime4k/conv2d-3x4.ts\");\nconst display_3c_1 = __webpack_require__(/*! ../../layers/anime4k/display_3c */ \"./src/layers/anime4k/display_3c.ts\");\nconst conv2d_32x4_1 = __webpack_require__(/*! ../../layers/anime4k/conv2d-32x4 */ \"./src/layers/anime4k/conv2d-32x4.ts\");\nconst conv2d_concat4_1 = __webpack_require__(/*! ../../layers/anime4k/conv2d-concat4 */ \"./src/layers/anime4k/conv2d-concat4.ts\");\nconst conv2d_224x4_1 = __webpack_require__(/*! ../../layers/anime4k/conv2d-224x4 */ \"./src/layers/anime4k/conv2d-224x4.ts\");\nclass Anime4KCNN2X16 extends base_network_1.default {\n    constructor(weights) {\n        super(weights);\n    }\n    model() {\n        const layers = [];\n        const weights = this.weights.layers;\n        const context = this.context;\n        layers.push(new conv2d_3x4_1.default([context.input], context.buffer('conv2d_tf'), weights['conv2d_tf']));\n        layers.push(new conv2d_3x4_1.default([context.input], context.buffer('conv2d_tf1'), weights['conv2d_tf1']));\n        layers.push(new conv2d_3x4_1.default([context.input], context.buffer('conv2d_tf2'), weights['conv2d_tf2']));\n        layers.push(new conv2d_3x4_1.default([context.input], context.buffer('conv2d_tf3'), weights['conv2d_tf3']));\n        for (let i = 1; i < 7; i++) {\n            let source = (i == 1) ? `conv2d_tf` : `conv2d_${i - 1}_tf`;\n            const sources = [];\n            for (let j = 0; j < 4; j++) {\n                if (j == 0) {\n                    sources.push(context.buffer(source));\n                }\n                else {\n                    sources.push(context.buffer(source + `${j}`));\n                }\n            }\n            for (let j = 0; j < 4; j++) {\n                if (j == 0) {\n                    layers.push(new conv2d_32x4_1.default(sources, context.buffer(`conv2d_${i}_tf`), weights[`conv2d_${i}_tf`]));\n                }\n                else {\n                    layers.push(new conv2d_32x4_1.default(sources, context.buffer(`conv2d_${i}_tf${j}`), weights[`conv2d_${i}_tf${j}`]));\n                }\n            }\n        }\n        for (let c = 0; c < 3; c++) {\n            const sources_0 = [];\n            const sources_1 = [];\n            const sources_2 = [];\n            const sources_3 = [];\n            for (let i = 0; i < 7; i++) {\n                let source = (i == 0) ? `conv2d_tf` : `conv2d_${i}_tf`;\n                sources_0.push(context.buffer(source));\n                sources_1.push(context.buffer(source + \"1\"));\n                sources_2.push(context.buffer(source + \"2\"));\n                sources_3.push(context.buffer(source + \"3\"));\n            }\n            const dest = (c == 0) ? `conv2d_last_tf` : `conv2d_last_tf${c}`;\n            layers.push(new conv2d_224x4_1.default(sources_0, context.buffer(`conv2d_last_${c}_pt1`), weights[dest], 0));\n            layers.push(new conv2d_224x4_1.default(sources_1, context.buffer(`conv2d_last_${c}_pt2`), weights[dest], 1));\n            layers.push(new conv2d_224x4_1.default(sources_2, context.buffer(`conv2d_last_${c}_pt3`), weights[dest], 2));\n            layers.push(new conv2d_224x4_1.default(sources_3, context.buffer(`conv2d_last_${c}_pt4`), weights[dest], 3));\n            layers.push(new conv2d_concat4_1.default([context.buffer(`conv2d_last_${c}_pt1`), context.buffer(`conv2d_last_${c}_pt2`), context.buffer(`conv2d_last_${c}_pt3`), context.buffer(`conv2d_last_${c}_pt4`)], context.buffer(dest), weights[dest]));\n        }\n        const paint = new display_3c_1.default([context.buffer('conv2d_last_tf'), context.buffer('conv2d_last_tf1'), context.buffer('conv2d_last_tf2'), context.input], context.texture('output'));\n        layers.push(paint);\n        return layers;\n    }\n    feedForward(source) {\n        return __awaiter(this, void 0, void 0, function* () {\n            if (source instanceof VideoFrame) {\n                this.context.input = this.context.device.importExternalTexture({ source });\n            }\n            else {\n                //        const sourceFrame = new VideoFrame(source);\n                const bitmap = source instanceof ImageBitmap ? source : yield createImageBitmap(source);\n                const width = source.width;\n                const height = source.height;\n                this.context.device.queue.copyExternalImageToTexture({ source: bitmap }, { texture: this.context.texture('input', { format: \"rgba8unorm\" }) }, [width, height]);\n                this.context.input = this.context.texture('input');\n                //  this.context.input = this.context.device.importExternalTexture({source: sourceFrame});\n            }\n            this.layers[0].inputs[0] = this.context.input;\n            this.layers[1].inputs[0] = this.context.input;\n            this.layers[2].inputs[0] = this.context.input;\n            this.layers[3].inputs[0] = this.context.input;\n            this.layers[this.layers.length - 1].inputs[3] = this.context.input;\n            this.layers[this.layers.length - 1].output = this.context.context.getCurrentTexture();\n            this.layers[0].lazyLoadSetup();\n            this.layers[1].lazyLoadSetup();\n            this.layers[2].lazyLoadSetup();\n            this.layers[3].lazyLoadSetup();\n            this.layers[this.layers.length - 1].lazyLoadSetup();\n            this.layers.forEach(function (layer) {\n                layer.run();\n            });\n        });\n    }\n}\nexports[\"default\"] = Anime4KCNN2X16;\n\n\n//# sourceURL=webpack://WebSR/./src/networks/anime4k/cnn-2x-16.ts?\n}",
                    );
                  },
                  "./src/networks/anime4k/cnn-2x-24.ts": function (
                    __unused_webpack_module,
                    exports,
                    __webpack_require__,
                  ) {
                    eval(
                      "{\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst base_network_1 = __webpack_require__(/*! ../base_network */ \"./src/networks/base_network.ts\");\nconst conv2d_3x4_1 = __webpack_require__(/*! ../../layers/anime4k/conv2d-3x4 */ \"./src/layers/anime4k/conv2d-3x4.ts\");\nconst display_3c_1 = __webpack_require__(/*! ../../layers/anime4k/display_3c */ \"./src/layers/anime4k/display_3c.ts\");\nconst conv2d_48x4_1 = __webpack_require__(/*! ../../layers/anime4k/conv2d-48x4 */ \"./src/layers/anime4k/conv2d-48x4.ts\");\nconst conv2d_336x4_1 = __webpack_require__(/*! ../../layers/anime4k/conv2d-336x4 */ \"./src/layers/anime4k/conv2d-336x4.ts\");\nconst conv2d_concat6_1 = __webpack_require__(/*! ../../layers/anime4k/conv2d-concat6 */ \"./src/layers/anime4k/conv2d-concat6.ts\");\nclass Anime4KCNN2X16 extends base_network_1.default {\n    constructor(weights) {\n        super(weights);\n    }\n    model() {\n        const layers = [];\n        const weights = this.weights.layers;\n        const context = this.context;\n        layers.push(new conv2d_3x4_1.default([context.input], context.buffer('conv2d_tf'), weights['conv2d_tf']));\n        layers.push(new conv2d_3x4_1.default([context.input], context.buffer('conv2d_tf1'), weights['conv2d_tf1']));\n        layers.push(new conv2d_3x4_1.default([context.input], context.buffer('conv2d_tf2'), weights['conv2d_tf2']));\n        layers.push(new conv2d_3x4_1.default([context.input], context.buffer('conv2d_tf3'), weights['conv2d_tf3']));\n        layers.push(new conv2d_3x4_1.default([context.input], context.buffer('conv2d_tf4'), weights['conv2d_tf4']));\n        layers.push(new conv2d_3x4_1.default([context.input], context.buffer('conv2d_tf5'), weights['conv2d_tf5']));\n        for (let i = 1; i < 7; i++) {\n            let source = (i == 1) ? `conv2d_tf` : `conv2d_${i - 1}_tf`;\n            const sources = [];\n            for (let j = 0; j < 6; j++) {\n                if (j == 0) {\n                    sources.push(context.buffer(source));\n                }\n                else {\n                    sources.push(context.buffer(source + `${j}`));\n                }\n            }\n            for (let j = 0; j < 6; j++) {\n                if (j == 0) {\n                    layers.push(new conv2d_48x4_1.default(sources, context.buffer(`conv2d_${i}_tf`), weights[`conv2d_${i}_tf`]));\n                }\n                else {\n                    layers.push(new conv2d_48x4_1.default(sources, context.buffer(`conv2d_${i}_tf${j}`), weights[`conv2d_${i}_tf${j}`]));\n                }\n            }\n        }\n        for (let c = 0; c < 3; c++) {\n            const sources_0 = [];\n            const sources_1 = [];\n            const sources_2 = [];\n            const sources_3 = [];\n            const sources_4 = [];\n            const sources_5 = [];\n            for (let i = 0; i < 7; i++) {\n                let source = (i == 0) ? `conv2d_tf` : `conv2d_${i}_tf`;\n                sources_0.push(context.buffer(source));\n                sources_1.push(context.buffer(source + \"1\"));\n                sources_2.push(context.buffer(source + \"2\"));\n                sources_3.push(context.buffer(source + \"3\"));\n                sources_4.push(context.buffer(source + \"4\"));\n                sources_5.push(context.buffer(source + \"5\"));\n            }\n            const dest = (c == 0) ? `conv2d_last_tf` : `conv2d_last_tf${c}`;\n            layers.push(new conv2d_336x4_1.default(sources_0, context.buffer(`conv2d_last_${c}_pt1`), weights[dest], 0));\n            layers.push(new conv2d_336x4_1.default(sources_1, context.buffer(`conv2d_last_${c}_pt2`), weights[dest], 1));\n            layers.push(new conv2d_336x4_1.default(sources_2, context.buffer(`conv2d_last_${c}_pt3`), weights[dest], 2));\n            layers.push(new conv2d_336x4_1.default(sources_3, context.buffer(`conv2d_last_${c}_pt4`), weights[dest], 3));\n            layers.push(new conv2d_336x4_1.default(sources_4, context.buffer(`conv2d_last_${c}_pt5`), weights[dest], 4));\n            layers.push(new conv2d_336x4_1.default(sources_5, context.buffer(`conv2d_last_${c}_pt6`), weights[dest], 5));\n            layers.push(new conv2d_concat6_1.default([context.buffer(`conv2d_last_${c}_pt1`), context.buffer(`conv2d_last_${c}_pt2`), context.buffer(`conv2d_last_${c}_pt3`), context.buffer(`conv2d_last_${c}_pt4`), context.buffer(`conv2d_last_${c}_pt5`), context.buffer(`conv2d_last_${c}_pt6`)], context.buffer(dest), weights[dest]));\n        }\n        const paint = new display_3c_1.default([context.buffer('conv2d_last_tf'), context.buffer('conv2d_last_tf1'), context.buffer('conv2d_last_tf2'), context.input], context.texture('output'));\n        layers.push(paint);\n        return layers;\n    }\n    feedForward(source) {\n        return __awaiter(this, void 0, void 0, function* () {\n            if (source instanceof VideoFrame) {\n                this.context.input = this.context.device.importExternalTexture({ source });\n            }\n            else {\n                //        const sourceFrame = new VideoFrame(source);\n                const bitmap = source instanceof ImageBitmap ? source : yield createImageBitmap(source);\n                const width = source.width;\n                const height = source.height;\n                this.context.device.queue.copyExternalImageToTexture({ source: bitmap }, { texture: this.context.texture('input', { format: \"rgba8unorm\" }) }, [width, height]);\n                this.context.input = this.context.texture('input');\n                //  this.context.input = this.context.device.importExternalTexture({source: sourceFrame});\n            }\n            this.layers[0].inputs[0] = this.context.input;\n            this.layers[1].inputs[0] = this.context.input;\n            this.layers[2].inputs[0] = this.context.input;\n            this.layers[3].inputs[0] = this.context.input;\n            this.layers[4].inputs[0] = this.context.input;\n            this.layers[5].inputs[0] = this.context.input;\n            this.layers[this.layers.length - 1].inputs[3] = this.context.input;\n            this.layers[this.layers.length - 1].output = this.context.context.getCurrentTexture();\n            this.layers[0].lazyLoadSetup();\n            this.layers[1].lazyLoadSetup();\n            this.layers[this.layers.length - 1].lazyLoadSetup();\n            this.layers.forEach(function (layer) {\n                layer.run();\n            });\n        });\n    }\n}\nexports[\"default\"] = Anime4KCNN2X16;\n\n\n//# sourceURL=webpack://WebSR/./src/networks/anime4k/cnn-2x-24.ts?\n}",
                    );
                  },
                  "./src/networks/anime4k/cnn-2x-28.ts": function (
                    __unused_webpack_module,
                    exports,
                    __webpack_require__,
                  ) {
                    eval(
                      "{\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst base_network_1 = __webpack_require__(/*! ../base_network */ \"./src/networks/base_network.ts\");\nconst conv2d_3x4_1 = __webpack_require__(/*! ../../layers/anime4k/conv2d-3x4 */ \"./src/layers/anime4k/conv2d-3x4.ts\");\nconst display_3c_1 = __webpack_require__(/*! ../../layers/anime4k/display_3c */ \"./src/layers/anime4k/display_3c.ts\");\nconst conv2d_56x4_2_1 = __webpack_require__(/*! ../../layers/anime4k/conv2d-56x4-2 */ \"./src/layers/anime4k/conv2d-56x4-2.ts\");\nconst conv2d_392x4_1 = __webpack_require__(/*! ../../layers/anime4k/conv2d-392x4 */ \"./src/layers/anime4k/conv2d-392x4.ts\");\nconst conv2d_concat7_1 = __webpack_require__(/*! ../../layers/anime4k/conv2d-concat7 */ \"./src/layers/anime4k/conv2d-concat7.ts\");\nclass Anime4KCNN2X28 extends base_network_1.default {\n    constructor(weights) {\n        super(weights);\n    }\n    model() {\n        const layers = [];\n        const weights = this.weights.layers;\n        const context = this.context;\n        layers.push(new conv2d_3x4_1.default([context.input], context.buffer('conv2d_tf'), weights['conv2d_tf']));\n        layers.push(new conv2d_3x4_1.default([context.input], context.buffer('conv2d_tf1'), weights['conv2d_tf1']));\n        layers.push(new conv2d_3x4_1.default([context.input], context.buffer('conv2d_tf2'), weights['conv2d_tf2']));\n        layers.push(new conv2d_3x4_1.default([context.input], context.buffer('conv2d_tf3'), weights['conv2d_tf3']));\n        layers.push(new conv2d_3x4_1.default([context.input], context.buffer('conv2d_tf4'), weights['conv2d_tf4']));\n        layers.push(new conv2d_3x4_1.default([context.input], context.buffer('conv2d_tf5'), weights['conv2d_tf5']));\n        layers.push(new conv2d_3x4_1.default([context.input], context.buffer('conv2d_tf6'), weights['conv2d_tf6']));\n        for (let i = 1; i < 7; i++) {\n            let source = (i == 1) ? `conv2d_tf` : `conv2d_${i - 1}_tf`;\n            const sources = [];\n            for (let j = 0; j < 7; j++) {\n                if (j == 0) {\n                    sources.push(context.buffer(source));\n                }\n                else {\n                    sources.push(context.buffer(source + `${j}`));\n                }\n            }\n            for (let j = 0; j < 7; j++) {\n                if (j == 0) {\n                    layers.push(new conv2d_56x4_2_1.default(sources, context.buffer(`conv2d_${i}_tf`), weights[`conv2d_${i}_tf`]));\n                }\n                else {\n                    layers.push(new conv2d_56x4_2_1.default(sources, context.buffer(`conv2d_${i}_tf${j}`), weights[`conv2d_${i}_tf${j}`]));\n                }\n            }\n        }\n        for (let c = 0; c < 3; c++) {\n            const sources_0 = [];\n            const sources_1 = [];\n            const sources_2 = [];\n            const sources_3 = [];\n            const sources_4 = [];\n            const sources_5 = [];\n            const sources_6 = [];\n            for (let i = 0; i < 7; i++) {\n                let source = (i == 0) ? `conv2d_tf` : `conv2d_${i}_tf`;\n                sources_0.push(context.buffer(source));\n                sources_1.push(context.buffer(source + \"1\"));\n                sources_2.push(context.buffer(source + \"2\"));\n                sources_3.push(context.buffer(source + \"3\"));\n                sources_4.push(context.buffer(source + \"4\"));\n                sources_5.push(context.buffer(source + \"5\"));\n                sources_6.push(context.buffer(source + \"6\"));\n            }\n            const dest = (c == 0) ? `conv2d_last_tf` : `conv2d_last_tf${c}`;\n            layers.push(new conv2d_392x4_1.default(sources_0, context.buffer(`conv2d_last_${c}_pt1`), weights[dest], 0));\n            layers.push(new conv2d_392x4_1.default(sources_1, context.buffer(`conv2d_last_${c}_pt2`), weights[dest], 1));\n            layers.push(new conv2d_392x4_1.default(sources_2, context.buffer(`conv2d_last_${c}_pt3`), weights[dest], 2));\n            layers.push(new conv2d_392x4_1.default(sources_3, context.buffer(`conv2d_last_${c}_pt4`), weights[dest], 3));\n            layers.push(new conv2d_392x4_1.default(sources_4, context.buffer(`conv2d_last_${c}_pt5`), weights[dest], 4));\n            layers.push(new conv2d_392x4_1.default(sources_5, context.buffer(`conv2d_last_${c}_pt6`), weights[dest], 5));\n            layers.push(new conv2d_392x4_1.default(sources_6, context.buffer(`conv2d_last_${c}_pt7`), weights[dest], 6));\n            layers.push(new conv2d_concat7_1.default([context.buffer(`conv2d_last_${c}_pt1`), context.buffer(`conv2d_last_${c}_pt2`), context.buffer(`conv2d_last_${c}_pt3`), context.buffer(`conv2d_last_${c}_pt4`), context.buffer(`conv2d_last_${c}_pt5`), context.buffer(`conv2d_last_${c}_pt6`), context.buffer(`conv2d_last_${c}_pt7`)], context.buffer(dest), weights[dest]));\n        }\n        const paint = new display_3c_1.default([context.buffer('conv2d_last_tf'), context.buffer('conv2d_last_tf1'), context.buffer('conv2d_last_tf2'), context.input], context.texture('output'));\n        layers.push(paint);\n        return layers;\n    }\n    feedForward(source) {\n        return __awaiter(this, void 0, void 0, function* () {\n            if (source instanceof VideoFrame) {\n                this.context.input = this.context.device.importExternalTexture({ source });\n            }\n            else {\n                //        const sourceFrame = new VideoFrame(source);\n                const bitmap = source instanceof ImageBitmap ? source : yield createImageBitmap(source);\n                const width = source.width;\n                const height = source.height;\n                this.context.device.queue.copyExternalImageToTexture({ source: bitmap }, { texture: this.context.texture('input', { format: \"rgba8unorm\" }) }, [width, height]);\n                this.context.input = this.context.texture('input');\n                //  this.context.input = this.context.device.importExternalTexture({source: sourceFrame});\n            }\n            this.layers[0].inputs[0] = this.context.input;\n            this.layers[1].inputs[0] = this.context.input;\n            this.layers[2].inputs[0] = this.context.input;\n            this.layers[3].inputs[0] = this.context.input;\n            this.layers[4].inputs[0] = this.context.input;\n            this.layers[5].inputs[0] = this.context.input;\n            this.layers[6].inputs[0] = this.context.input;\n            this.layers[this.layers.length - 1].inputs[3] = this.context.input;\n            this.layers[this.layers.length - 1].output = this.context.context.getCurrentTexture();\n            this.layers[0].lazyLoadSetup();\n            this.layers[1].lazyLoadSetup();\n            this.layers[this.layers.length - 1].lazyLoadSetup();\n            this.layers.forEach(function (layer) {\n                layer.run();\n            });\n        });\n    }\n}\nexports[\"default\"] = Anime4KCNN2X28;\n\n\n//# sourceURL=webpack://WebSR/./src/networks/anime4k/cnn-2x-28.ts?\n}",
                    );
                  },
                  "./src/networks/anime4k/cnn-2x-l.ts": function (
                    __unused_webpack_module,
                    exports,
                    __webpack_require__,
                  ) {
                    eval(
                      '{\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\nObject.defineProperty(exports, "__esModule", ({ value: true }));\nconst base_network_1 = __webpack_require__(/*! ../base_network */ "./src/networks/base_network.ts");\nconst conv2d_3x4_1 = __webpack_require__(/*! ../../layers/anime4k/conv2d-3x4 */ "./src/layers/anime4k/conv2d-3x4.ts");\nconst display_3c_1 = __webpack_require__(/*! ../../layers/anime4k/display_3c */ "./src/layers/anime4k/display_3c.ts");\nconst conv2d_16x4_1 = __webpack_require__(/*! ../../layers/anime4k/conv2d-16x4 */ "./src/layers/anime4k/conv2d-16x4.ts");\nconst conv2d_112x4_1 = __webpack_require__(/*! ../../layers/anime4k/conv2d-112x4 */ "./src/layers/anime4k/conv2d-112x4.ts");\nconst conv2d_concat2_1 = __webpack_require__(/*! ../../layers/anime4k/conv2d-concat2 */ "./src/layers/anime4k/conv2d-concat2.ts");\nclass Anime4KCNN2XL extends base_network_1.default {\n    constructor(weights) {\n        super(weights);\n    }\n    model() {\n        const layers = [];\n        const weights = this.weights.layers;\n        const context = this.context;\n        layers.push(new conv2d_3x4_1.default([context.input], context.buffer(\'conv2d_tf\'), weights[\'conv2d_tf\']));\n        layers.push(new conv2d_3x4_1.default([context.input], context.buffer(\'conv2d_tf1\'), weights[\'conv2d_tf1\']));\n        for (let i = 1; i < 7; i++) {\n            let source = (i == 1) ? `conv2d_tf` : `conv2d_${i - 1}_tf`;\n            layers.push(new conv2d_16x4_1.default([context.buffer(source), context.buffer(source + "1")], context.buffer(`conv2d_${i}_tf`), weights[`conv2d_${i}_tf`]));\n            layers.push(new conv2d_16x4_1.default([context.buffer(source), context.buffer(source + "1")], context.buffer(`conv2d_${i}_tf1`), weights[`conv2d_${i}_tf1`]));\n        }\n        for (let c = 0; c < 3; c++) {\n            const sources_0 = [];\n            const sources_1 = [];\n            for (let i = 0; i < 7; i++) {\n                let source = (i == 0) ? `conv2d_tf` : `conv2d_${i}_tf`;\n                sources_0.push(context.buffer(source));\n                sources_1.push(context.buffer(source + "1"));\n            }\n            const dest = (c == 0) ? `conv2d_last_tf` : `conv2d_last_tf${c}`;\n            layers.push(new conv2d_112x4_1.default(sources_0, context.buffer(`conv2d_last_${c}_pt1`), weights[dest], true));\n            layers.push(new conv2d_112x4_1.default(sources_1, context.buffer(`conv2d_last_${c}_pt2`), weights[dest], false));\n            layers.push(new conv2d_concat2_1.default([context.buffer(`conv2d_last_${c}_pt1`), context.buffer(`conv2d_last_${c}_pt2`)], context.buffer(dest), weights[dest]));\n        }\n        const paint = new display_3c_1.default([context.buffer(\'conv2d_last_tf\'), context.buffer(\'conv2d_last_tf1\'), context.buffer(\'conv2d_last_tf2\'), context.input], context.texture(\'output\'));\n        layers.push(paint);\n        return layers;\n    }\n    feedForward(source) {\n        return __awaiter(this, void 0, void 0, function* () {\n            if (source instanceof VideoFrame) {\n                this.context.input = this.context.device.importExternalTexture({ source });\n            }\n            else {\n                //        const sourceFrame = new VideoFrame(source);\n                const bitmap = source instanceof ImageBitmap ? source : yield createImageBitmap(source);\n                const width = source.width;\n                const height = source.height;\n                this.context.device.queue.copyExternalImageToTexture({ source: bitmap }, { texture: this.context.texture(\'input\', { format: "rgba8unorm" }) }, [width, height]);\n                this.context.input = this.context.texture(\'input\');\n                //  this.context.input = this.context.device.importExternalTexture({source: sourceFrame});\n            }\n            this.layers[0].inputs[0] = this.context.input;\n            this.layers[1].inputs[0] = this.context.input;\n            this.layers[this.layers.length - 1].inputs[3] = this.context.input;\n            this.layers[this.layers.length - 1].output = this.context.context.getCurrentTexture();\n            this.layers[0].lazyLoadSetup();\n            this.layers[1].lazyLoadSetup();\n            this.layers[this.layers.length - 1].lazyLoadSetup();\n            this.layers.forEach(function (layer) {\n                layer.run();\n            });\n        });\n    }\n}\nexports["default"] = Anime4KCNN2XL;\n\n\n//# sourceURL=webpack://WebSR/./src/networks/anime4k/cnn-2x-l.ts?\n}',
                    );
                  },
                  "./src/networks/anime4k/cnn-2x-m.ts": function (
                    __unused_webpack_module,
                    exports,
                    __webpack_require__,
                  ) {
                    eval(
                      "{\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst base_network_1 = __webpack_require__(/*! ../base_network */ \"./src/networks/base_network.ts\");\nconst conv2d_3x4_1 = __webpack_require__(/*! ../../layers/anime4k/conv2d-3x4 */ \"./src/layers/anime4k/conv2d-3x4.ts\");\nconst conv2d_8x4_1 = __webpack_require__(/*! ../../layers/anime4k/conv2d-8x4 */ \"./src/layers/anime4k/conv2d-8x4.ts\");\nconst conv2d_56x4_1 = __webpack_require__(/*! ../../layers/anime4k/conv2d-56x4 */ \"./src/layers/anime4k/conv2d-56x4.ts\");\nconst display_3c_1 = __webpack_require__(/*! ../../layers/anime4k/display_3c */ \"./src/layers/anime4k/display_3c.ts\");\nclass Anime4KCNN2XM extends base_network_1.default {\n    constructor(weights) {\n        super(weights);\n    }\n    model() {\n        const layers = [];\n        const weights = this.weights.layers;\n        const context = this.context;\n        const conv2d_tf = new conv2d_3x4_1.default([context.input], context.buffer('conv2d_tf'), weights['conv2d_tf']);\n        const conv2d_1_tf = new conv2d_8x4_1.default([context.buffer('conv2d_tf')], context.buffer('conv2d_1_tf'), weights['conv2d_1_tf']);\n        const conv2d_2_tf = new conv2d_8x4_1.default([context.buffer('conv2d_1_tf')], context.buffer('conv2d_2_tf'), weights['conv2d_2_tf']);\n        const conv2d_3_tf = new conv2d_8x4_1.default([context.buffer('conv2d_2_tf')], context.buffer('conv2d_3_tf'), weights['conv2d_3_tf']);\n        const conv2d_4_tf = new conv2d_8x4_1.default([context.buffer('conv2d_3_tf')], context.buffer('conv2d_4_tf'), weights['conv2d_4_tf']);\n        const conv2d_5_tf = new conv2d_8x4_1.default([context.buffer('conv2d_4_tf')], context.buffer('conv2d_5_tf'), weights['conv2d_5_tf']);\n        const conv2d_6_tf = new conv2d_8x4_1.default([context.buffer('conv2d_5_tf')], context.buffer('conv2d_6_tf'), weights['conv2d_6_tf']);\n        const conv2d_7_tf = new conv2d_56x4_1.default([context.buffer('conv2d_tf'), context.buffer('conv2d_1_tf'), context.buffer('conv2d_2_tf'), context.buffer('conv2d_3_tf'), context.buffer('conv2d_4_tf'), context.buffer('conv2d_5_tf'), context.buffer('conv2d_6_tf')], context.buffer('conv2d_7_tf'), weights['conv2d_7_tf']);\n        const conv2d_7_tf1 = new conv2d_56x4_1.default([context.buffer('conv2d_tf'), context.buffer('conv2d_1_tf'), context.buffer('conv2d_2_tf'), context.buffer('conv2d_3_tf'), context.buffer('conv2d_4_tf'), context.buffer('conv2d_5_tf'), context.buffer('conv2d_6_tf')], context.buffer('conv2d_7_tf1'), weights['conv2d_7_tf1']);\n        const conv2d_7_tf2 = new conv2d_56x4_1.default([context.buffer('conv2d_tf'), context.buffer('conv2d_1_tf'), context.buffer('conv2d_2_tf'), context.buffer('conv2d_3_tf'), context.buffer('conv2d_4_tf'), context.buffer('conv2d_5_tf'), context.buffer('conv2d_6_tf')], context.buffer('conv2d_7_tf2'), weights['conv2d_7_tf2']);\n        const paint = new display_3c_1.default([context.buffer('conv2d_7_tf'), context.buffer('conv2d_7_tf1'), context.buffer('conv2d_7_tf2'), context.input], context.texture('output'));\n        layers.push(conv2d_tf, conv2d_1_tf, conv2d_2_tf, conv2d_3_tf, conv2d_4_tf, conv2d_5_tf, conv2d_6_tf, conv2d_7_tf, conv2d_7_tf1, conv2d_7_tf2, paint);\n        return layers;\n    }\n    feedForward(source) {\n        return __awaiter(this, void 0, void 0, function* () {\n            if (source instanceof VideoFrame) {\n                this.context.input = this.context.device.importExternalTexture({ source });\n            }\n            else {\n                const bitmap = source instanceof ImageBitmap ? source : yield createImageBitmap(source);\n                const width = source.width;\n                const height = source.height;\n                this.context.device.queue.copyExternalImageToTexture({ source: bitmap }, { texture: this.context.texture('input', { format: \"rgba8unorm\" }) }, [width, height]);\n                this.context.input = this.context.texture('input');\n            }\n            this.layers[0].inputs[0] = this.context.input;\n            this.layers[this.layers.length - 1].inputs[3] = this.context.input;\n            this.layers[this.layers.length - 1].output = this.context.context.getCurrentTexture();\n            this.layers[0].lazyLoadSetup();\n            this.layers[this.layers.length - 1].lazyLoadSetup();\n            this.layers.forEach(function (layer) {\n                layer.run();\n            });\n        });\n    }\n}\nexports[\"default\"] = Anime4KCNN2XM;\n\n\n//# sourceURL=webpack://WebSR/./src/networks/anime4k/cnn-2x-m.ts?\n}",
                    );
                  },
                  "./src/networks/anime4k/cnn-2x-s.ts": function (
                    __unused_webpack_module,
                    exports,
                    __webpack_require__,
                  ) {
                    eval(
                      "{\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst base_network_1 = __webpack_require__(/*! ../base_network */ \"./src/networks/base_network.ts\");\nconst conv2d_3x4_1 = __webpack_require__(/*! ../../layers/anime4k/conv2d-3x4 */ \"./src/layers/anime4k/conv2d-3x4.ts\");\nconst conv2d_8x4_1 = __webpack_require__(/*! ../../layers/anime4k/conv2d-8x4 */ \"./src/layers/anime4k/conv2d-8x4.ts\");\nconst display_1 = __webpack_require__(/*! ../../layers/anime4k/display */ \"./src/layers/anime4k/display.ts\");\nclass Anime4KCNN2XS extends base_network_1.default {\n    constructor(weights) {\n        super(weights);\n    }\n    model() {\n        const layers = [];\n        const weights = this.weights.layers;\n        const context = this.context;\n        const conv2d_tf = new conv2d_3x4_1.default([context.input], context.buffer('conv2d_tf'), weights['conv2d_tf']);\n        const conv2d_1_tf = new conv2d_8x4_1.default([context.buffer('conv2d_tf')], context.buffer('conv2d_1_tf'), weights['conv2d_1_tf']);\n        const conv2d_2_tf = new conv2d_8x4_1.default([context.buffer('conv2d_1_tf')], context.buffer('conv2d_2_tf'), weights['conv2d_2_tf']);\n        const conv2d_last_tf = new conv2d_8x4_1.default([context.buffer('conv2d_2_tf')], context.buffer('conv2d_last_tf'), weights['conv2d_last_tf']);\n        const paint = new display_1.default([context.buffer('conv2d_last_tf'), context.input], context.texture('output'));\n        layers.push(conv2d_tf, conv2d_1_tf, conv2d_2_tf, conv2d_last_tf, paint);\n        return layers;\n    }\n    feedForward(source) {\n        return __awaiter(this, void 0, void 0, function* () {\n            let frame = null;\n            if (source instanceof VideoFrame) {\n                this.context.input = this.context.device.importExternalTexture({ source });\n            }\n            else {\n                let bitmap;\n                if (source instanceof ImageBitmap) {\n                    bitmap = source;\n                }\n                else if (source) {\n                    bitmap = yield createImageBitmap(source);\n                }\n                const width = bitmap.width;\n                const height = bitmap.height;\n                this.context.device.queue.copyExternalImageToTexture({ source: bitmap, origin: { x: 0, y: 0 } }, { texture: this.context.texture('input', { format: \"rgba8unorm\" }) }, { width, height, depthOrArrayLayers: 1 });\n                this.context.input = this.context.texture('input');\n            }\n            this.layers[0].inputs[0] = this.context.input;\n            this.layers[this.layers.length - 1].inputs[1] = this.context.input;\n            this.layers[0].lazyLoadSetup();\n            this.layers[this.layers.length - 1].lazyLoadSetup();\n            this.layers.forEach(function (layer) {\n                layer.run();\n            });\n            if (frame) {\n                frame.close();\n                frame = null;\n            }\n        });\n    }\n}\nexports[\"default\"] = Anime4KCNN2XS;\n\n\n//# sourceURL=webpack://WebSR/./src/networks/anime4k/cnn-2x-s.ts?\n}",
                    );
                  },
                  "./src/networks/anime4k/cnn-restore-l.ts": function (
                    __unused_webpack_module,
                    exports,
                    __webpack_require__,
                  ) {
                    eval(
                      "{\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst base_network_1 = __webpack_require__(/*! ../base_network */ \"./src/networks/base_network.ts\");\nconst conv2d_3x4_1 = __webpack_require__(/*! ../../layers/anime4k/conv2d-3x4 */ \"./src/layers/anime4k/conv2d-3x4.ts\");\nconst conv2d_16x4_1 = __webpack_require__(/*! ../../layers/anime4k/conv2d-16x4 */ \"./src/layers/anime4k/conv2d-16x4.ts\");\nconst display_1x_1 = __webpack_require__(/*! ../../layers/anime4k/display_1x */ \"./src/layers/anime4k/display_1x.ts\");\nclass Anime4KCNNRL extends base_network_1.default {\n    constructor(weights) {\n        super(weights);\n    }\n    model() {\n        const layers = [];\n        const weights = this.weights.layers;\n        const context = this.context;\n        layers.push(new conv2d_3x4_1.default([context.input], context.buffer('conv2d_tf'), weights['conv2d_tf']));\n        layers.push(new conv2d_3x4_1.default([context.input], context.buffer('conv2d_tf1'), weights['conv2d_tf1']));\n        for (let i = 1; i < 4; i++) {\n            let source = (i == 1) ? `conv2d_tf` : `conv2d_${i - 1}_tf`;\n            layers.push(new conv2d_16x4_1.default([context.buffer(source), context.buffer(source + \"1\")], context.buffer(`conv2d_${i}_tf`), weights[`conv2d_${i}_tf`]));\n            layers.push(new conv2d_16x4_1.default([context.buffer(source), context.buffer(source + \"1\")], context.buffer(`conv2d_${i}_tf1`), weights[`conv2d_${i}_tf1`]));\n        }\n        layers.push(new conv2d_16x4_1.default([context.buffer('conv2d_3_tf'), context.buffer('conv2d_3_tf1')], context.buffer(`conv2d_out_tf`), weights[`conv2d_out_tf`]));\n        const paint = new display_1x_1.default([context.buffer('conv2d_out_tf'), context.input], context.texture('output'));\n        layers.push(paint);\n        return layers;\n    }\n    feedForward(source) {\n        return __awaiter(this, void 0, void 0, function* () {\n            if (source instanceof HTMLVideoElement) {\n                this.context.input = this.context.device.importExternalTexture({ source });\n            }\n            else {\n                const bitmap = source instanceof ImageBitmap ? source : yield createImageBitmap(source);\n                const width = source instanceof HTMLImageElement ? source.naturalWidth : source.width;\n                const height = source instanceof HTMLImageElement ? source.naturalHeight : source.height;\n                this.context.device.queue.copyExternalImageToTexture({ source: bitmap }, { texture: this.context.texture('input', { format: \"rgba8unorm\" }) }, [width, height]);\n                this.context.input = this.context.texture('input');\n            }\n            this.layers[0].inputs[0] = this.context.input;\n            this.layers[1].inputs[0] = this.context.input;\n            this.layers[this.layers.length - 1].inputs[1] = this.context.input;\n            this.layers.forEach(function (layer) {\n                layer.run();\n            });\n        });\n    }\n}\nexports[\"default\"] = Anime4KCNNRL;\n\n\n//# sourceURL=webpack://WebSR/./src/networks/anime4k/cnn-restore-l.ts?\n}",
                    );
                  },
                  "./src/networks/anime4k/cnn-restore-m.ts": function (
                    __unused_webpack_module,
                    exports,
                    __webpack_require__,
                  ) {
                    eval(
                      "{\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst base_network_1 = __webpack_require__(/*! ../base_network */ \"./src/networks/base_network.ts\");\nconst conv2d_3x4_1 = __webpack_require__(/*! ../../layers/anime4k/conv2d-3x4 */ \"./src/layers/anime4k/conv2d-3x4.ts\");\nconst conv2d_8x4_1 = __webpack_require__(/*! ../../layers/anime4k/conv2d-8x4 */ \"./src/layers/anime4k/conv2d-8x4.ts\");\nconst conv2d_56x4_1 = __webpack_require__(/*! ../../layers/anime4k/conv2d-56x4 */ \"./src/layers/anime4k/conv2d-56x4.ts\");\nconst display_1x_1 = __webpack_require__(/*! ../../layers/anime4k/display_1x */ \"./src/layers/anime4k/display_1x.ts\");\nclass Anime4KCNNRM extends base_network_1.default {\n    constructor(weights) {\n        super(weights);\n    }\n    model() {\n        const layers = [];\n        const weights = this.weights.layers;\n        const context = this.context;\n        const conv2d_tf = new conv2d_3x4_1.default([context.input], context.buffer('conv2d_tf'), weights['conv2d_tf']);\n        const conv2d_1_tf = new conv2d_8x4_1.default([context.buffer('conv2d_tf')], context.buffer('conv2d_1_tf'), weights['conv2d_1_tf']);\n        const conv2d_2_tf = new conv2d_8x4_1.default([context.buffer('conv2d_1_tf')], context.buffer('conv2d_2_tf'), weights['conv2d_2_tf']);\n        const conv2d_3_tf = new conv2d_8x4_1.default([context.buffer('conv2d_2_tf')], context.buffer('conv2d_3_tf'), weights['conv2d_3_tf']);\n        const conv2d_4_tf = new conv2d_8x4_1.default([context.buffer('conv2d_3_tf')], context.buffer('conv2d_4_tf'), weights['conv2d_4_tf']);\n        const conv2d_5_tf = new conv2d_8x4_1.default([context.buffer('conv2d_4_tf')], context.buffer('conv2d_5_tf'), weights['conv2d_5_tf']);\n        const conv2d_6_tf = new conv2d_8x4_1.default([context.buffer('conv2d_5_tf')], context.buffer('conv2d_6_tf'), weights['conv2d_6_tf']);\n        const conv2d_out_tf = new conv2d_56x4_1.default([context.buffer('conv2d_tf'), context.buffer('conv2d_1_tf'), context.buffer('conv2d_2_tf'), context.buffer('conv2d_3_tf'), context.buffer('conv2d_4_tf'), context.buffer('conv2d_5_tf'), context.buffer('conv2d_6_tf')], context.buffer('conv2d_out_tf'), weights['conv2d_out_tf']);\n        const paint = new display_1x_1.default([context.buffer('conv2d_out_tf'), context.input], context.texture('output'));\n        layers.push(conv2d_tf, conv2d_1_tf, conv2d_2_tf, conv2d_3_tf, conv2d_4_tf, conv2d_5_tf, conv2d_6_tf, conv2d_out_tf, paint);\n        return layers;\n    }\n    feedForward(source) {\n        return __awaiter(this, void 0, void 0, function* () {\n            if (source instanceof HTMLVideoElement) {\n                this.context.input = this.context.device.importExternalTexture({ source });\n            }\n            else {\n                const bitmap = source instanceof ImageBitmap ? source : yield createImageBitmap(source);\n                const width = source instanceof HTMLImageElement ? source.naturalWidth : source.width;\n                const height = source instanceof HTMLImageElement ? source.naturalHeight : source.height;\n                this.context.device.queue.copyExternalImageToTexture({ source: bitmap }, { texture: this.context.texture('input', { format: \"rgba8unorm\" }) }, [width, height]);\n                this.context.input = this.context.texture('input');\n            }\n            this.layers[0].inputs[0] = this.context.input;\n            this.layers[1].inputs[0] = this.context.input;\n            this.layers[this.layers.length - 1].inputs[1] = this.context.input;\n            this.layers.forEach(function (layer) {\n                layer.run();\n            });\n        });\n    }\n}\nexports[\"default\"] = Anime4KCNNRM;\n\n\n//# sourceURL=webpack://WebSR/./src/networks/anime4k/cnn-restore-m.ts?\n}",
                    );
                  },
                  "./src/networks/anime4k/cnn-restore-s.ts": function (
                    __unused_webpack_module,
                    exports,
                    __webpack_require__,
                  ) {
                    eval(
                      "{\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst base_network_1 = __webpack_require__(/*! ../base_network */ \"./src/networks/base_network.ts\");\nconst conv2d_3x4_1 = __webpack_require__(/*! ../../layers/anime4k/conv2d-3x4 */ \"./src/layers/anime4k/conv2d-3x4.ts\");\nconst conv2d_8x4_1 = __webpack_require__(/*! ../../layers/anime4k/conv2d-8x4 */ \"./src/layers/anime4k/conv2d-8x4.ts\");\nconst display_1x_1 = __webpack_require__(/*! ../../layers/anime4k/display_1x */ \"./src/layers/anime4k/display_1x.ts\");\nclass Anime4KCNNRS extends base_network_1.default {\n    constructor(weights) {\n        super(weights);\n    }\n    model() {\n        const layers = [];\n        const weights = this.weights.layers;\n        const context = this.context;\n        const conv2d_tf = new conv2d_3x4_1.default([context.input], context.buffer('conv2d_tf'), weights['conv2d_tf']);\n        const conv2d_1_tf = new conv2d_8x4_1.default([context.buffer('conv2d_tf')], context.buffer('conv2d_1_tf'), weights['conv2d_1_tf']);\n        const conv2d_2_tf = new conv2d_8x4_1.default([context.buffer('conv2d_1_tf')], context.buffer('conv2d_2_tf'), weights['conv2d_2_tf']);\n        const conv2d_last_tf = new conv2d_8x4_1.default([context.buffer('conv2d_2_tf')], context.buffer('conv2d_out_tf'), weights['conv2d_out_tf']);\n        const paint = new display_1x_1.default([context.buffer('conv2d_out_tf'), context.input], context.texture('output'));\n        layers.push(conv2d_tf, conv2d_1_tf, conv2d_2_tf, conv2d_last_tf, paint);\n        return layers;\n    }\n    feedForward(source) {\n        return __awaiter(this, void 0, void 0, function* () {\n            if (source instanceof HTMLVideoElement) {\n                this.context.input = this.context.device.importExternalTexture({ source });\n            }\n            else {\n                const bitmap = source instanceof ImageBitmap ? source : yield createImageBitmap(source);\n                const width = source instanceof HTMLImageElement ? source.naturalWidth : source.width;\n                const height = source instanceof HTMLImageElement ? source.naturalHeight : source.height;\n                this.context.device.queue.copyExternalImageToTexture({ source: bitmap }, { texture: this.context.texture('input', { format: \"rgba8unorm\" }) }, [width, height]);\n                this.context.input = this.context.texture('input');\n            }\n            this.layers[0].inputs[0] = this.context.input;\n            this.layers[this.layers.length - 1].inputs[1] = this.context.input;\n            this.layers.forEach(function (layer) {\n                layer.run();\n            });\n        });\n    }\n}\nexports[\"default\"] = Anime4KCNNRS;\n\n\n//# sourceURL=webpack://WebSR/./src/networks/anime4k/cnn-restore-s.ts?\n}",
                    );
                  },
                  "./src/networks/base_network.ts": function (
                    __unused_webpack_module,
                    exports,
                  ) {
                    eval(
                      '{\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\nObject.defineProperty(exports, "__esModule", ({ value: true }));\nclass NeuralNetwork {\n    constructor(weights) {\n        this.weights = weights;\n        this.context = globalThis.context;\n        this.layers = this.model();\n    }\n    model() {\n        return [];\n    }\n    lastLayer() {\n        return this.layers[this.layers.length - 1];\n    }\n    feedForward(source) {\n        return __awaiter(this, void 0, void 0, function* () {\n            this.layers.forEach(layer => {\n                layer.run();\n            });\n        });\n    }\n}\nexports["default"] = NeuralNetwork;\n\n\n//# sourceURL=webpack://WebSR/./src/networks/base_network.ts?\n}',
                    );
                  },
                  "./src/networks/network_list.ts": (
                    __unused_webpack_module,
                    exports,
                    __webpack_require__,
                  ) => {
                    eval(
                      '{\nObject.defineProperty(exports, "__esModule", ({ value: true }));\nexports.NetworkScales = exports.NetworkList = void 0;\nconst cnn_2x_s_1 = __webpack_require__(/*! ./anime4k/cnn-2x-s */ "./src/networks/anime4k/cnn-2x-s.ts");\nconst cnn_2x_m_1 = __webpack_require__(/*! ./anime4k/cnn-2x-m */ "./src/networks/anime4k/cnn-2x-m.ts");\nconst cnn_2x_l_1 = __webpack_require__(/*! ./anime4k/cnn-2x-l */ "./src/networks/anime4k/cnn-2x-l.ts");\nconst cnn_restore_l_1 = __webpack_require__(/*! ./anime4k/cnn-restore-l */ "./src/networks/anime4k/cnn-restore-l.ts");\nconst cnn_restore_m_1 = __webpack_require__(/*! ./anime4k/cnn-restore-m */ "./src/networks/anime4k/cnn-restore-m.ts");\nconst cnn_restore_s_1 = __webpack_require__(/*! ./anime4k/cnn-restore-s */ "./src/networks/anime4k/cnn-restore-s.ts");\nconst poc_network_1 = __webpack_require__(/*! ./poc_network */ "./src/networks/poc_network.ts");\nconst cnn_2x_16_1 = __webpack_require__(/*! ./anime4k/cnn-2x-16 */ "./src/networks/anime4k/cnn-2x-16.ts");\nconst cnn_2x_24_1 = __webpack_require__(/*! ./anime4k/cnn-2x-24 */ "./src/networks/anime4k/cnn-2x-24.ts");\nconst cnn_2x_28_1 = __webpack_require__(/*! ./anime4k/cnn-2x-28 */ "./src/networks/anime4k/cnn-2x-28.ts");\nexports.NetworkList = {\n    "anime4k/cnn-2x-s": cnn_2x_s_1.default,\n    "anime4k/cnn-2x-m": cnn_2x_m_1.default,\n    "anime4k/cnn-2x-l": cnn_2x_l_1.default,\n    "anime4k/cnn-2x-16": cnn_2x_16_1.default,\n    "anime4k/cnn-2x-24": cnn_2x_24_1.default,\n    "anime4k/cnn-2x-28": cnn_2x_28_1.default,\n    "anime4k/cnn-restore-s": cnn_restore_s_1.default,\n    "anime4k/cnn-restore-m": cnn_restore_m_1.default,\n    "anime4k/cnn-restore-l": cnn_restore_l_1.default,\n    "sb2702/blur-poc": poc_network_1.default\n};\nexports.NetworkScales = {\n    "anime4k/cnn-2x-s": 2,\n    "anime4k/cnn-2x-m": 2,\n    "anime4k/cnn-2x-l": 2,\n    "anime4k/cnn-2x-16": 2,\n    "anime4k/cnn-2x-24": 2,\n    "anime4k/cnn-2x-28": 2,\n    "anime4k/cnn-restore-s": 1,\n    "anime4k/cnn-restore-m": 1,\n    "anime4k/cnn-restore-l": 1,\n    "sb2702/blur-poc": 1\n};\n\n\n//# sourceURL=webpack://WebSR/./src/networks/network_list.ts?\n}',
                    );
                  },
                  "./src/networks/poc_network.ts": (
                    __unused_webpack_module,
                    exports,
                    __webpack_require__,
                  ) => {
                    eval(
                      '{\nObject.defineProperty(exports, "__esModule", ({ value: true }));\nconst base_network_1 = __webpack_require__(/*! ./base_network */ "./src/networks/base_network.ts");\nconst rgb_2_yuv_1 = __webpack_require__(/*! ../layers/utils/rgb_2_yuv */ "./src/layers/utils/rgb_2_yuv.ts");\nconst gaussian_1 = __webpack_require__(/*! ../layers/utils/gaussian */ "./src/layers/utils/gaussian.ts");\nclass PoCNetwork extends base_network_1.default {\n    constructor() {\n        super();\n    }\n    model() {\n        const layers = [];\n        const context = this.context;\n        layers.push(new rgb_2_yuv_1.default([context.texture(\'input\')], context.texture(\'yuv\')));\n        layers.push(new gaussian_1.default([context.texture(\'yuv\')], context.texture(\'output\')));\n        return layers;\n    }\n}\nexports["default"] = PoCNetwork;\n\n\n//# sourceURL=webpack://WebSR/./src/networks/poc_network.ts?\n}',
                    );
                  },
                  "./src/renderer.ts": function (
                    __unused_webpack_module,
                    exports,
                    __webpack_require__,
                  ) {
                    eval(
                      '{\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\nObject.defineProperty(exports, "__esModule", ({ value: true }));\nconst display_1 = __webpack_require__(/*! ./layers/anime4k/display */ "./src/layers/anime4k/display.ts");\nconst base_render_layer_1 = __webpack_require__(/*! ./layers/base_render_layer */ "./src/layers/base_render_layer.ts");\nclass WebSRRenderer {\n    constructor(network, source) {\n        this.context = globalThis.context;\n        this.network = network;\n        this.source = source;\n        this.active = false;\n    }\n    switchNetwork(network) {\n        this.network = network;\n    }\n    start() {\n        return __awaiter(this, void 0, void 0, function* () {\n            if (this.context.destroyed) {\n                throw new Error("WebSR instance was destroyed");\n            }\n            this.active = true;\n            yield this.renderStep();\n        });\n    }\n    stop() {\n        return __awaiter(this, void 0, void 0, function* () {\n            this.active = false;\n            if (this.vfc && this.source && this.source instanceof HTMLVideoElement)\n                this.source.cancelVideoFrameCallback(this.vfc);\n        });\n    }\n    renderStep() {\n        return __awaiter(this, void 0, void 0, function* () {\n            const lastLayer = this.network.lastLayer();\n            if (lastLayer instanceof display_1.default)\n                lastLayer.setOutput(this.context.context.getCurrentTexture());\n            yield this.render();\n            if (this.active && this.source && this.source instanceof HTMLVideoElement) {\n                this.vfc = this.source.requestVideoFrameCallback(this.renderStep.bind(this));\n            }\n        });\n    }\n    render(source) {\n        return __awaiter(this, void 0, void 0, function* () {\n            const lastLayer = this.network.lastLayer();\n            if (lastLayer instanceof base_render_layer_1.default)\n                lastLayer.setOutput(this.context.context.getCurrentTexture());\n            yield this.network.feedForward(source ? source : this.source);\n        });\n    }\n}\nexports["default"] = WebSRRenderer;\n\n\n//# sourceURL=webpack://WebSR/./src/renderer.ts?\n}',
                    );
                  },
                },
                __webpack_module_cache__ = {};
              function __nested_webpack_require_152188__(e) {
                var t = __webpack_module_cache__[e];
                if (void 0 !== t) return t.exports;
                var n = (__webpack_module_cache__[e] = { exports: {} });
                return (
                  __webpack_modules__[e].call(
                    n.exports,
                    n,
                    n.exports,
                    __nested_webpack_require_152188__,
                  ),
                  n.exports
                );
              }
              var __nested_webpack_exports__ =
                __nested_webpack_require_152188__("./src/main.ts");
              return (
                (__nested_webpack_exports__ =
                  __nested_webpack_exports__.default),
                __nested_webpack_exports__
              );
            })()),
          (module.exports = factory()));
      },
      501: () => {},
    },
    __webpack_module_cache__ = {},
    deferred,
    leafPrototypes,
    getProto,
    next;
  function __webpack_require__(e) {
    var t = __webpack_module_cache__[e];
    if (void 0 !== t) return t.exports;
    var n = (__webpack_module_cache__[e] = { exports: {} });
    return (
      __webpack_modules__[e](n, n.exports, __webpack_require__),
      n.exports
    );
  }
  ((__webpack_require__.m = __webpack_modules__),
    (__webpack_require__.x = () => {
      var e = __webpack_require__.O(void 0, ["video"], () =>
        __webpack_require__(217),
      );
      return __webpack_require__.O(e);
    }),
    (deferred = []),
    (__webpack_require__.O = (e, t, n, r) => {
      if (!t) {
        var i = 1 / 0;
        for (u = 0; u < deferred.length; u++) {
          for (var [t, n, r] = deferred[u], s = !0, o = 0; o < t.length; o++)
            (!1 & r || i >= r) &&
            Object.keys(__webpack_require__.O).every((e) =>
              __webpack_require__.O[e](t[o]),
            )
              ? t.splice(o--, 1)
              : ((s = !1), r < i && (i = r));
          if (s) {
            deferred.splice(u--, 1);
            var a = n();
            void 0 !== a && (e = a);
          }
        }
        return e;
      }
      r = r || 0;
      for (var u = deferred.length; u > 0 && deferred[u - 1][2] > r; u--)
        deferred[u] = deferred[u - 1];
      deferred[u] = [t, n, r];
    }),
    (__webpack_require__.n = (e) => {
      var t = e && e.__esModule ? () => e.default : () => e;
      return (__webpack_require__.d(t, { a: t }), t);
    }),
    (getProto = Object.getPrototypeOf
      ? (e) => Object.getPrototypeOf(e)
      : (e) => e.__proto__),
    (__webpack_require__.t = function (e, t) {
      if ((1 & t && (e = this(e)), 8 & t)) return e;
      if ("object" == typeof e && e) {
        if (4 & t && e.__esModule) return e;
        if (16 & t && "function" == typeof e.then) return e;
      }
      var n = Object.create(null);
      __webpack_require__.r(n);
      var r = {};
      leafPrototypes = leafPrototypes || [
        null,
        getProto({}),
        getProto([]),
        getProto(getProto),
      ];
      for (
        var i = 2 & t && e;
        "object" == typeof i && !~leafPrototypes.indexOf(i);
        i = getProto(i)
      )
        Object.getOwnPropertyNames(i).forEach((t) => (r[t] = () => e[t]));
      return ((r.default = () => e), __webpack_require__.d(n, r), n);
    }),
    (__webpack_require__.d = (e, t) => {
      for (var n in t)
        __webpack_require__.o(t, n) &&
          !__webpack_require__.o(e, n) &&
          Object.defineProperty(e, n, { enumerable: !0, get: t[n] });
    }),
    (__webpack_require__.f = {}),
    (__webpack_require__.e = (e) =>
      Promise.all(
        Object.keys(__webpack_require__.f).reduce(
          (t, n) => (__webpack_require__.f[n](e, t), t),
          [],
        ),
      )),
    (__webpack_require__.u = (e) => e + ".js"),
    (__webpack_require__.g = (function () {
      if ("object" == typeof globalThis) return globalThis;
      try {
        return this || new Function("return this")();
      } catch (e) {
        if ("object" == typeof window) return window;
      }
    })()),
    (__webpack_require__.o = (e, t) =>
      Object.prototype.hasOwnProperty.call(e, t)),
    (__webpack_require__.r = (e) => {
      ("undefined" != typeof Symbol &&
        Symbol.toStringTag &&
        Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }),
        Object.defineProperty(e, "__esModule", { value: !0 }));
    }),
    (() => {
      var e;
      __webpack_require__.g.importScripts &&
        (e = __webpack_require__.g.location + "");
      var t = __webpack_require__.g.document;
      if (!e && t && (t.currentScript && (e = t.currentScript.src), !e)) {
        var n = t.getElementsByTagName("script");
        if (n.length) for (var r = n.length - 1; r > -1 && !e; ) e = n[r--].src;
      }
      if (!e)
        throw new Error(
          "Automatic publicPath is not supported in this browser",
        );
      ((e = e
        .replace(/#.*$/, "")
        .replace(/\?.*$/, "")
        .replace(/\/[^\/]+$/, "/")),
        (__webpack_require__.p = e));
    })(),
    (() => {
      var e = { 584: 1 };
      __webpack_require__.f.i = (t, n) => {
        e[t] || importScripts(__webpack_require__.p + __webpack_require__.u(t));
      };
      var t = (globalThis.webpackChunkfree_video_upscaler =
          globalThis.webpackChunkfree_video_upscaler || []),
        n = t.push.bind(t);
      t.push = (t) => {
        var [r, i, s] = t;
        for (var o in i)
          __webpack_require__.o(i, o) && (__webpack_require__.m[o] = i[o]);
        for (s && s(__webpack_require__); r.length; ) e[r.pop()] = 1;
        n(t);
      };
    })(),
    (next = __webpack_require__.x),
    (__webpack_require__.x = () => __webpack_require__.e("video").then(next)));
  var __webpack_exports__ = __webpack_require__.x();
})();
