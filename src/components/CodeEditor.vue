<script lang="ts">
import { defineComponent } from "vue";
import { VueMonacoEditor } from "@guolao/vue-monaco-editor";

export default defineComponent({
  components: { VueMonacoEditor },
  props: {
    modelValue: { type: String, required: true },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    function onMount(editor: any) {
      editor.onDidChangeModelContent(() => {
        const value = editor.getValue();
        emit("update:modelValue", value);
      });
    }
    return { onMount };
  },
});
</script>

<template>
  <div class="code-editor">
    <div class="editor-header">
      <span class="editor-title">Fragment Shader</span>
      <span class="editor-lang">.frag</span>
    </div>
    <div class="editor-body">
      <VueMonacoEditor
        :value="modelValue"
        language="glsl"
        theme="vs-dark"
        @mount="onMount"
        :options="{
          fontSize: 14,
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
</template>

<style scoped>
.code-editor {
  display: flex;
  flex-direction: column;
  height: 100%;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  overflow: hidden;
}

.editor-header {
  height: 36px;
  background: var(--bg-tertiary);
  display: flex;
  align-items: center;
  padding: 0 12px;
  gap: 8px;
  border-bottom: 1px solid var(--border-color);
  flex-shrink: 0;
}

.editor-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
}

.editor-lang {
  font-size: 11px;
  color: var(--text-muted);
  font-family: var(--font-mono);
}

.editor-body {
  flex: 1;
  min-height: 0;
}
</style>
