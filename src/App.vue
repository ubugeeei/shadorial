<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import ChapterNav from "./components/ChapterNav.vue";
import { chapters } from "./chapters/index";

const route = useRoute();
const currentChapter = computed(() => {
  const num = route.meta.chapterNumber as number;
  return chapters.find((ch) => ch.number === num);
});
</script>

<template>
  <div class="app-layout">
    <header class="app-header">
      <div class="header-left">
        <h1 class="logo">Shadorial</h1>
        <span class="tagline">Interactive Shader Tutorial</span>
      </div>
      <div class="header-right">
        <span class="disclaimer">* Personal learning project by ubugeeei</span>
        <a
          href="https://github.com/ubugeeei/shadorial"
          target="_blank"
          rel="noopener noreferrer"
          class="github-link"
          aria-label="GitHub"
        >
          <span class="mdi mdi-github"></span>
        </a>
        <ChapterNav :current="currentChapter" />
      </div>
    </header>
    <main class="app-main">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.app-layout {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.app-header {
  height: var(--header-height);
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  flex-shrink: 0;
  z-index: 100;
}

.header-left {
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.logo {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: -0.01em;
}

.tagline {
  font-size: 11px;
  color: var(--text-muted);
  letter-spacing: 0.02em;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.disclaimer {
  font-size: 10px;
  color: var(--text-muted);
  opacity: 0.5;
}

.github-link {
  display: flex;
  align-items: center;
  color: var(--text-muted);
  font-size: 20px;
  transition: color 0.15s;
  text-decoration: none;
}

.github-link:hover {
  color: var(--text-primary);
}

.app-main {
  flex: 1;
  overflow: hidden;
}

@media (max-width: 768px) {
  .app-header {
    padding: 0 12px;
  }

  .tagline,
  .disclaimer {
    display: none;
  }
}
</style>
