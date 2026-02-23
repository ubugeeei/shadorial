import { ref, onUnmounted, type Ref } from "vue";

export function useWebGL(canvas: Ref<HTMLCanvasElement | null>) {
  const gl = ref<WebGL2RenderingContext | null>(null);
  const program = ref<WebGLProgram | null>(null);
  const error = ref<string | null>(null);
  const animationId = ref(0);

  function init() {
    if (!canvas.value) return;
    const ctx = canvas.value.getContext("webgl2");
    if (!ctx) {
      error.value = "WebGL2 not supported";
      return;
    }
    gl.value = ctx;
  }

  function createShader(
    ctx: WebGL2RenderingContext,
    type: number,
    source: string,
  ): WebGLShader | null {
    const shader = ctx.createShader(type);
    if (!shader) return null;
    ctx.shaderSource(shader, source);
    ctx.compileShader(shader);
    if (!ctx.getShaderParameter(shader, ctx.COMPILE_STATUS)) {
      const log = ctx.getShaderInfoLog(shader);
      ctx.deleteShader(shader);
      error.value = log || "Shader compilation failed";
      return null;
    }
    return shader;
  }

  function buildProgram(vertSource: string, fragSource: string): boolean {
    const ctx = gl.value;
    if (!ctx) return false;

    error.value = null;

    const vertShader = createShader(ctx, ctx.VERTEX_SHADER, vertSource);
    if (!vertShader) return false;

    const fragShader = createShader(ctx, ctx.FRAGMENT_SHADER, fragSource);
    if (!fragShader) {
      ctx.deleteShader(vertShader);
      return false;
    }

    const newProgram = ctx.createProgram();
    if (!newProgram) return false;

    ctx.attachShader(newProgram, vertShader);
    ctx.attachShader(newProgram, fragShader);
    ctx.linkProgram(newProgram);

    ctx.deleteShader(vertShader);
    ctx.deleteShader(fragShader);

    if (!ctx.getProgramParameter(newProgram, ctx.LINK_STATUS)) {
      error.value =
        ctx.getProgramInfoLog(newProgram) || "Program linking failed";
      ctx.deleteProgram(newProgram);
      return false;
    }

    if (program.value) {
      ctx.deleteProgram(program.value);
    }
    program.value = newProgram;
    return true;
  }

  function cleanup() {
    if (animationId.value) {
      cancelAnimationFrame(animationId.value);
    }
    if (gl.value && program.value) {
      gl.value.deleteProgram(program.value);
    }
  }

  onUnmounted(cleanup);

  return { gl, program, error, animationId, init, buildProgram, cleanup };
}
