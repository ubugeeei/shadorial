<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from "vue";
import * as THREE from "three";

const props = defineProps<{
  fragmentShader: string;
  vertexShader?: string;
}>();

const container = ref<HTMLDivElement | null>(null);
const error = ref<string | null>(null);

let renderer: THREE.WebGLRenderer | null = null;
let scene: THREE.Scene | null = null;
let camera: THREE.PerspectiveCamera | null = null;
let mesh: THREE.Mesh | null = null;
let animationId = 0;
let clock: THREE.Clock | null = null;
let uniforms: Record<string, THREE.IUniform> = {};

const defaultVertexShader = `
varying vec3 vNormal;
varying vec2 vUv;
varying float vDisplacement;

uniform float u_time;

// Simple noise for vertex displacement
float hash(vec3 p) {
  p = fract(p * vec3(123.34, 456.21, 789.01));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y * p.z);
}

float noise3d(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);

  float a = hash(i);
  float b = hash(i + vec3(1.0, 0.0, 0.0));
  float c = hash(i + vec3(0.0, 1.0, 0.0));
  float d = hash(i + vec3(1.0, 1.0, 0.0));
  float e = hash(i + vec3(0.0, 0.0, 1.0));
  float f1 = hash(i + vec3(1.0, 0.0, 1.0));
  float g = hash(i + vec3(0.0, 1.0, 1.0));
  float h = hash(i + vec3(1.0, 1.0, 1.0));

  float x1 = mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  float x2 = mix(mix(e, f1, f.x), mix(g, h, f.x), f.y);
  return mix(x1, x2, f.z);
}

void main() {
  vUv = uv;
  vNormal = normalMatrix * normal;

  // Displacement
  float displacement = noise3d(position * 2.0 + u_time * 0.5) * 0.3;
  displacement += noise3d(position * 4.0 - u_time * 0.3) * 0.15;
  vDisplacement = displacement;

  vec3 newPosition = position + normal * displacement;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
`;

function init() {
  if (!container.value) return;

  const rect = container.value.getBoundingClientRect();
  const width = rect.width || 400;
  const height = rect.height || 300;

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.value.appendChild(renderer.domElement);

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0d1117);

  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  camera.position.z = 4;

  clock = new THREE.Clock();

  buildMesh();
  animate();
}

function buildMesh() {
  if (!scene) return;

  error.value = null;

  if (mesh) {
    scene.remove(mesh);
    mesh.geometry.dispose();
    (mesh.material as THREE.ShaderMaterial).dispose();
  }

  uniforms = {
    u_time: { value: 0.0 },
    u_resolution: {
      value: new THREE.Vector2(
        container.value?.clientWidth ?? 400,
        container.value?.clientHeight ?? 300,
      ),
    },
    u_mouse: { value: new THREE.Vector2(0, 0) },
  };

  try {
    const material = new THREE.ShaderMaterial({
      vertexShader: props.vertexShader || defaultVertexShader,
      fragmentShader: props.fragmentShader,
      uniforms,
    });

    // Force compile to catch errors
    const testRenderer = renderer;
    if (testRenderer && scene && camera) {
      const geo = new THREE.SphereGeometry(1.2, 64, 64);
      mesh = new THREE.Mesh(geo, material);
      scene.add(mesh);

      testRenderer.compile(scene, camera);
      const gl = testRenderer.getContext();
      const prog = gl.getParameter(gl.CURRENT_PROGRAM);
      if (prog) {
        const linked = gl.getProgramParameter(prog, gl.LINK_STATUS);
        if (!linked) {
          error.value = gl.getProgramInfoLog(prog) || "Shader link failed";
        }
      }
    }
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : String(e);
  }
}

function animate() {
  if (!renderer || !scene || !camera || !clock) return;

  animationId = requestAnimationFrame(animate);

  uniforms.u_time.value = clock.getElapsedTime();

  if (mesh) {
    mesh.rotation.y += 0.005;
    mesh.rotation.x += 0.002;
  }

  renderer.render(scene, camera);
}

function onResize() {
  if (!container.value || !renderer || !camera) return;
  const rect = container.value.getBoundingClientRect();
  renderer.setSize(rect.width, rect.height);
  camera.aspect = rect.width / rect.height;
  camera.updateProjectionMatrix();
  uniforms.u_resolution.value.set(rect.width, rect.height);
}

function onMouseMove(e: MouseEvent) {
  if (!container.value) return;
  const rect = container.value.getBoundingClientRect();
  uniforms.u_mouse.value.set(
    e.clientX - rect.left,
    rect.height - (e.clientY - rect.top),
  );
}

onMounted(() => {
  init();
  window.addEventListener("resize", onResize);
});

onUnmounted(() => {
  cancelAnimationFrame(animationId);
  window.removeEventListener("resize", onResize);
  if (renderer) {
    renderer.dispose();
    renderer.domElement.remove();
  }
  if (mesh) {
    mesh.geometry.dispose();
    (mesh.material as THREE.ShaderMaterial).dispose();
  }
});

watch(
  () => props.fragmentShader,
  () => buildMesh(),
);

defineExpose({ error });
</script>

<template>
  <div class="three-preview">
    <div class="preview-header">
      <span class="preview-title">3D Preview</span>
      <span v-if="error" class="preview-error-badge">Error</span>
    </div>
    <div ref="container" class="preview-canvas-wrap" @mousemove="onMouseMove">
      <div v-if="error" class="preview-error">
        <pre>{{ error }}</pre>
      </div>
    </div>
  </div>
</template>

<style scoped>
.three-preview {
  display: flex;
  flex-direction: column;
  height: 100%;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  overflow: hidden;
}

.preview-header {
  height: 36px;
  background: var(--bg-tertiary);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  border-bottom: 1px solid var(--border-color);
  flex-shrink: 0;
}

.preview-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
}

.preview-error-badge {
  font-size: 11px;
  color: var(--error);
  font-weight: 600;
  background: rgba(248, 81, 73, 0.15);
  padding: 2px 8px;
  border-radius: 4px;
}

.preview-canvas-wrap {
  flex: 1;
  position: relative;
  min-height: 0;
  background: #000;
}

.preview-canvas-wrap :deep(canvas) {
  width: 100%;
  height: 100%;
  display: block;
}

.preview-error {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(13, 17, 23, 0.95);
  border-top: 1px solid var(--error);
  padding: 12px;
  max-height: 40%;
  overflow: auto;
}

.preview-error pre {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--error);
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
