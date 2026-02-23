<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import CodeEditor from "@/components/CodeEditor.vue";
import ThreePreview from "@/components/ThreePreview.vue";
import MarkdownContent from "@/components/MarkdownContent.vue";
import { chapters } from "@/chapters/index";
import defaultCode from "./default.frag?raw";
import Content from "./content.md";

const router = useRouter();
const chapter = chapters.find((c) => c.number === 19)!;
const code = ref(defaultCode);

const prevChapter = computed(() =>
  chapters.find((c) => c.number === chapter.number - 1),
);

function reset() {
  code.value = defaultCode;
}
</script>

<template>
  <div class="playground">
    <div class="playground-body">
      <aside class="tutorial-pane">
        <div class="tutorial-scroll">
          <MarkdownContent :is="Content" />
        </div>
      </aside>
      <div class="editor-pane">
        <div class="editor-section">
          <CodeEditor v-model="code" />
        </div>
        <div class="preview-section">
          <ThreePreview :fragment-shader="code" />
        </div>
        <div class="editor-actions">
          <button type="button" class="btn-reset" @click="reset">Reset Code</button>
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
      <span />
    </footer>
  </div>
</template>

<style scoped>
.playground {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.playground-body {
  flex: 1;
  display: flex;
  min-height: 0;
}

.tutorial-pane {
  width: 380px;
  flex-shrink: 0;
  border-right: 1px solid var(--border-color);
  background: var(--bg-secondary);
}

.tutorial-scroll {
  height: 100%;
  overflow-y: auto;
  padding: 24px;
}

.editor-pane {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  padding: 12px;
  gap: 12px;
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
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 12px;
  transition:
    background 0.15s,
    color 0.15s;
}

.btn-reset:hover {
  background: var(--bg-overlay);
  color: var(--text-primary);
}

.playground-footer {
  height: var(--nav-height);
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  flex-shrink: 0;
}

.nav-btn {
  background: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  padding: 6px 16px;
  border-radius: 6px;
  font-size: 13px;
  transition:
    background 0.15s,
    color 0.15s,
    border-color 0.15s;
}

.nav-btn:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
  border-color: var(--text-muted);
}
</style>
