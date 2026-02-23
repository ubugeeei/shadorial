<script setup lang="ts">
import { ref, onMounted, watch, inject, type Ref } from "vue";
import { useWebGL } from "@/composables/useWebGL";
import { useShaderCompile } from "@/composables/useShaderCompile";

const injectedCode = inject<Ref<string>>("shaderCode")!;

const canvas = ref<HTMLCanvasElement | null>(null);
const { gl, program, error, animationId, init, buildProgram } =
  useWebGL(canvas);
const { compile, onMouseMove } = useShaderCompile(
  gl,
  program,
  animationId,
  buildProgram,
  error,
  injectedCode,
  canvas,
);

defineExpose({ error });

onMounted(() => {
  init();
  compile();
});

watch(injectedCode, () => {
  compile();
});
</script>

<template>
  <div class="shader-preview">
    <div class="preview-header">
      <span class="preview-title">Preview</span>
      <span v-if="error" class="preview-error-badge">Error</span>
    </div>
    <div class="preview-canvas-wrap">
      <canvas ref="canvas" @mousemove="onMouseMove" />
      <div v-if="error" class="preview-error">
        <pre>{{ error }}</pre>
      </div>
    </div>
  </div>
</template>

<style scoped>
.shader-preview {
  display: flex;
  flex-direction: column;
  height: 100%;
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  overflow: hidden;
}

.preview-header {
  height: 32px;
  background: var(--bg-tertiary);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  border-bottom: 1px solid var(--border-color);
  flex-shrink: 0;
}

.preview-title {
  font-size: 11px;
  font-weight: 500;
  color: var(--text-muted);
}

.preview-error-badge {
  font-size: 10px;
  color: var(--error);
  font-weight: 500;
  background: rgba(248, 81, 73, 0.1);
  padding: 1px 6px;
  border-radius: 3px;
}

.preview-canvas-wrap {
  flex: 1;
  position: relative;
  min-height: 0;
  background: #000;
}

.preview-canvas-wrap canvas {
  width: 100%;
  height: 100%;
  display: block;
}

.preview-error {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(10, 14, 20, 0.95);
  border-top: 1px solid var(--error);
  padding: 10px 12px;
  max-height: 40%;
  overflow: auto;
}

.preview-error pre {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--error);
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
