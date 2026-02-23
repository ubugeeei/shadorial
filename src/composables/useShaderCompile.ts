import { ref, type Ref } from "vue";

const BASE_VERTEX = `#version 300 es
precision highp float;
in vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

export function useShaderCompile(
  gl: Ref<WebGL2RenderingContext | null>,
  program: Ref<WebGLProgram | null>,
  animationId: Ref<number>,
  buildProgram: (vert: string, frag: string) => boolean,
  error: Ref<string | null>,
  fragSource: Ref<string>,
  canvas: Ref<HTMLCanvasElement | null>,
) {
  const mouse = ref({ x: 0, y: 0 });
  let vao: WebGLVertexArrayObject | null = null;

  function setupGeometry() {
    const ctx = gl.value;
    if (!ctx) return;

    vao = ctx.createVertexArray();
    ctx.bindVertexArray(vao);

    const buffer = ctx.createBuffer();
    ctx.bindBuffer(ctx.ARRAY_BUFFER, buffer);
    ctx.bufferData(
      ctx.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      ctx.STATIC_DRAW,
    );

    const prog = program.value;
    if (prog) {
      const loc = ctx.getAttribLocation(prog, "a_position");
      ctx.enableVertexAttribArray(loc);
      ctx.vertexAttribPointer(loc, 2, ctx.FLOAT, false, 0, 0);
    }

    ctx.bindVertexArray(null);
  }

  function render() {
    const ctx = gl.value;
    const prog = program.value;
    const cvs = canvas.value;
    if (!ctx || !prog || !cvs) return;

    const dpr = window.devicePixelRatio || 1;
    const w = cvs.clientWidth * dpr;
    const h = cvs.clientHeight * dpr;
    if (cvs.width !== w || cvs.height !== h) {
      cvs.width = w;
      cvs.height = h;
    }

    ctx.viewport(0, 0, cvs.width, cvs.height);
    ctx.clearColor(0, 0, 0, 1);
    ctx.clear(ctx.COLOR_BUFFER_BIT);

    ctx.useProgram(prog);

    const uTime = ctx.getUniformLocation(prog, "u_time");
    const uRes = ctx.getUniformLocation(prog, "u_resolution");
    const uMouse = ctx.getUniformLocation(prog, "u_mouse");

    if (uTime) ctx.uniform1f(uTime, performance.now() / 1000);
    if (uRes) ctx.uniform2f(uRes, cvs.width, cvs.height);
    if (uMouse) ctx.uniform2f(uMouse, mouse.value.x, mouse.value.y);

    ctx.bindVertexArray(vao);
    ctx.drawArrays(ctx.TRIANGLES, 0, 6);
    ctx.bindVertexArray(null);

    animationId.value = requestAnimationFrame(render);
  }

  function compile() {
    if (!gl.value) return;
    if (animationId.value) {
      cancelAnimationFrame(animationId.value);
    }
    if (buildProgram(BASE_VERTEX, fragSource.value)) {
      setupGeometry();
      render();
    }
  }

  function onMouseMove(e: MouseEvent) {
    const cvs = canvas.value;
    if (!cvs) return;
    const rect = cvs.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    mouse.value = {
      x: (e.clientX - rect.left) * dpr,
      y: (rect.height - (e.clientY - rect.top)) * dpr,
    };
  }

  return { compile, onMouseMove, mouse };
}
