<script setup lang="ts">
import { ref, computed, provide, watch, nextTick, type Component } from "vue";
import { useRouter } from "vue-router";
import { VueMonacoEditor } from "@guolao/vue-monaco-editor";
import ShaderPreview from "./ShaderPreview.vue";
import MarkdownContent from "./MarkdownContent.vue";
import { chapters, type ChapterMeta } from "@/chapters/index";

const props = defineProps<{
  chapter: ChapterMeta;
  defaultCode: string;
  content: Component;
}>();

const router = useRouter();
const code = ref(props.defaultCode);
provide("shaderCode", code);

const prevChapter = computed(() =>
  chapters.find((c) => c.number === props.chapter.number - 1),
);
const nextChapter = computed(() =>
  chapters.find((c) => c.number === props.chapter.number + 1),
);

// Monaco editor instance for direct sync (workaround for vize() prop reactivity)
let editorInstance: any = null;
let isEditorChange = false;

function onEditorMount(editor: any) {
  editorInstance = editor;
}

function onCodeChange(value: string | undefined) {
  if (value !== undefined) {
    isEditorChange = true;
    code.value = value;
    nextTick(() => {
      isEditorChange = false;
    });
  }
}

// Sync code ref back to editor when changed externally (e.g., reset)
watch(code, (newValue) => {
  if (!isEditorChange && editorInstance) {
    const current = editorInstance.getValue();
    if (current !== newValue) {
      editorInstance.setValue(newValue);
    }
  }
});

function reset() {
  code.value = props.defaultCode;
}

// Resizable splitter
const tutorialWidth = ref(600);
const isDragging = ref(false);

function onSplitterDown(e: PointerEvent) {
  isDragging.value = true;
  const startX = e.clientX;
  const startWidth = tutorialWidth.value;
  const target = e.currentTarget as HTMLElement;
  target.setPointerCapture(e.pointerId);

  function onMove(ev: PointerEvent) {
    const delta = ev.clientX - startX;
    tutorialWidth.value = Math.max(240, Math.min(startWidth + delta, 900));
  }
  function onUp() {
    isDragging.value = false;
    target.removeEventListener("pointermove", onMove);
    target.removeEventListener("pointerup", onUp);
  }
  target.addEventListener("pointermove", onMove);
  target.addEventListener("pointerup", onUp);
}
</script>

<template>
  <div class="playground" :class="{ dragging: isDragging }">
    <div class="playground-body">
      <aside class="tutorial-pane" :style="{ width: tutorialWidth + 'px' }">
        <div class="tutorial-scroll">
          <MarkdownContent :is="content" />
        </div>
      </aside>
      <div
        class="splitter"
        @pointerdown.prevent="onSplitterDown"
      >
        <div class="splitter-handle" />
      </div>
      <div class="editor-pane">
        <div class="editor-section">
          <div class="code-editor">
            <div class="editor-header">
              <span class="editor-title">Fragment Shader</span>
              <span class="editor-lang">.frag</span>
            </div>
            <div class="editor-body">
              <VueMonacoEditor
                :value="code"
                language="glsl"
                theme="vs-dark"
                @mount="onEditorMount"
                @update:value="onCodeChange"
                :options="{
                  fontSize: 13,
                  fontFamily: 'JetBrains Mono, monospace',
                  minimap: { enabled: false },
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                  renderWhitespace: 'selection',
                  padding: { top: 12 },
                }"
              />
            </div>
          </div>
        </div>
        <div class="preview-section">
          <ShaderPreview />
        </div>
        <div class="editor-actions">
          <button type="button" class="btn-reset" @click="reset">Reset</button>
        </div>
      </div>
    </div>
    <footer class="playground-footer">
      <button
        v-if="prevChapter"
        type="button"
        class="nav-btn"
        @click="router.push(`/chapter/${prevChapter.slug}`)"
      >
        &larr; {{ prevChapter.title }}
      </button>
      <span v-else />
      <button
        v-if="nextChapter"
        type="button"
        class="nav-btn nav-btn-next"
        @click="router.push(`/chapter/${nextChapter.slug}`)"
      >
        {{ nextChapter.title }} &rarr;
      </button>
    </footer>
  </div>
</template>

<style scoped>
.playground {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.playground.dragging {
  user-select: none;
  cursor: col-resize;
}

.playground-body {
  flex: 1;
  display: flex;
  min-height: 0;
}

.tutorial-pane {
  flex-shrink: 0;
  background: var(--bg-secondary);
  min-width: 240px;
  max-width: 900px;
}

.tutorial-scroll {
  height: 100%;
  overflow-y: auto;
  padding: 24px;
}

.splitter {
  width: 1px;
  flex-shrink: 0;
  cursor: col-resize;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--border-color);
  transition: background 0.2s;
  position: relative;
}

.splitter::before {
  content: "";
  position: absolute;
  inset: 0 -4px;
}

.splitter:hover,
.playground.dragging .splitter {
  background: var(--accent);
}

.splitter-handle {
  display: none;
}

.editor-pane {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  padding: 8px;
  gap: 8px;
}

.editor-section {
  flex: 1;
  min-height: 0;
}

.preview-section {
  flex: 1;
  min-height: 0;
}

.editor-actions {
  display: flex;
  justify-content: flex-end;
  flex-shrink: 0;
}

.btn-reset {
  background: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-muted);
  padding: 4px 12px;
  border-radius: var(--radius);
  font-size: 11px;
  transition:
    background 0.15s,
    color 0.15s,
    border-color 0.15s;
}

.btn-reset:hover {
  border-color: var(--text-muted);
  color: var(--text-secondary);
}

.playground-footer {
  height: var(--nav-height);
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  flex-shrink: 0;
}

.nav-btn {
  background: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-muted);
  padding: 4px 12px;
  border-radius: var(--radius);
  font-size: 12px;
  transition:
    background 0.15s,
    color 0.15s,
    border-color 0.15s;
}

.nav-btn:hover {
  border-color: var(--text-muted);
  color: var(--text-secondary);
}

.nav-btn-next {
  color: var(--accent);
  border-color: rgba(167, 139, 250, 0.3);
}

.nav-btn-next:hover {
  border-color: var(--accent);
  background: var(--accent-subtle);
}

.code-editor {
  display: flex;
  flex-direction: column;
  height: 100%;
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  overflow: hidden;
}

.editor-header {
  height: 32px;
  background: var(--bg-tertiary);
  display: flex;
  align-items: center;
  padding: 0 12px;
  gap: 8px;
  border-bottom: 1px solid var(--border-color);
  flex-shrink: 0;
}

.editor-title {
  font-size: 11px;
  font-weight: 500;
  color: var(--text-muted);
}

.editor-lang {
  font-size: 10px;
  color: var(--text-muted);
  font-family: var(--font-mono);
  opacity: 0.5;
}

.editor-body {
  flex: 1;
  min-height: 0;
}

/* Responsive: mobile */
@media (max-width: 768px) {
  .playground-body {
    flex-direction: column;
  }

  .tutorial-pane {
    width: 100% !important;
    max-width: none;
    max-height: 35vh;
    border-bottom: 1px solid var(--border-color);
  }

  .splitter {
    display: none;
  }

  .tutorial-scroll {
    padding: 16px;
  }

  .editor-pane {
    padding: 6px;
    gap: 6px;
  }

  .editor-section,
  .preview-section {
    min-height: 200px;
  }
}
</style>
