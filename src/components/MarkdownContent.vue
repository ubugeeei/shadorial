<script setup lang="ts">
import { ref, onMounted, onUpdated, type Component } from "vue";
import hljs from "highlight.js/lib/core";
import c from "highlight.js/lib/languages/c";
import javascript from "highlight.js/lib/languages/javascript";
import glsl from "highlight.js/lib/languages/glsl";
import "highlight.js/styles/github-dark.css";

hljs.registerLanguage("c", c);
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("glsl", glsl);

defineProps<{
  is: Component;
}>();

const el = ref<HTMLElement>();

function highlightAll() {
  if (!el.value) return;
  el.value.querySelectorAll("pre code").forEach((block) => {
    hljs.highlightElement(block as HTMLElement);
  });
}

onMounted(highlightAll);
onUpdated(highlightAll);
</script>

<template>
  <div ref="el" class="markdown-content">
    <component :is="is" />
  </div>
</template>

<style scoped>
.markdown-content {
  font-size: 14px;
  line-height: 1.7;
  color: var(--text-secondary);
}

.markdown-content :deep(h1) {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border-color);
  color: var(--text-primary);
}

.markdown-content :deep(h2) {
  font-size: 17px;
  font-weight: 600;
  margin-top: 28px;
  margin-bottom: 10px;
  color: var(--text-primary);
}

.markdown-content :deep(h3) {
  font-size: 15px;
  font-weight: 600;
  margin-top: 20px;
  margin-bottom: 8px;
  color: var(--text-primary);
}

.markdown-content :deep(p) {
  margin-bottom: 14px;
}

.markdown-content :deep(code) {
  font-family: var(--font-mono);
  font-size: 12px;
  background: var(--bg-tertiary);
  padding: 2px 5px;
  border-radius: 3px;
  color: var(--accent);
}

.markdown-content :deep(pre) {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  padding: 14px;
  margin-bottom: 14px;
  overflow-x: auto;
}

.markdown-content :deep(pre code) {
  background: none;
  padding: 0;
  color: var(--text-primary);
}

.markdown-content :deep(ul),
.markdown-content :deep(ol) {
  padding-left: 20px;
  margin-bottom: 14px;
}

.markdown-content :deep(li) {
  margin-bottom: 4px;
}

.markdown-content :deep(blockquote) {
  border-left: 2px solid var(--accent);
  padding-left: 14px;
  margin: 14px 0;
  color: var(--text-muted);
}

.markdown-content :deep(strong) {
  font-weight: 600;
  color: var(--text-primary);
}

.markdown-content :deep(hr) {
  border: none;
  border-top: 1px solid var(--border-color);
  margin: 20px 0;
}
</style>
