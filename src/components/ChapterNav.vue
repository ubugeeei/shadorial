<script setup lang="ts">
import { ref, computed } from "vue";
import { chapters, type ChapterMeta } from "@/chapters/index";

defineProps<{
  current?: ChapterMeta;
}>();

const isOpen = ref(false);
const searchQuery = ref("");

const parts = computed(() => {
  const grouped: { title: string; icon: string; chapters: ChapterMeta[] }[] = [
    { title: "Shader Fundamentals", icon: "mdi-cube-outline", chapters: [] },
    { title: "Wave Functions", icon: "mdi-sine-wave", chapters: [] },
    { title: "Shapes & Light", icon: "mdi-white-balance-sunny", chapters: [] },
    { title: "Generative Art", icon: "mdi-palette-outline", chapters: [] },
    { title: "Three.js Integration", icon: "mdi-cube-scan", chapters: [] },
  ];
  for (const ch of chapters) {
    if (ch.number <= 3) grouped[0].chapters.push(ch);
    else if (ch.number <= 8) grouped[1].chapters.push(ch);
    else if (ch.number <= 11) grouped[2].chapters.push(ch);
    else if (ch.number <= 18) grouped[3].chapters.push(ch);
    else grouped[4].chapters.push(ch);
  }
  return grouped;
});

const filteredParts = computed(() => {
  const q = searchQuery.value.toLowerCase().trim();
  if (!q) return parts.value;
  return parts.value
    .map((part) => ({
      ...part,
      chapters: part.chapters.filter(
        (ch) =>
          ch.title.toLowerCase().includes(q) ||
          ch.description.toLowerCase().includes(q) ||
          String(ch.number).padStart(2, "0").includes(q),
      ),
    }))
    .filter((part) => part.chapters.length > 0);
});

function toggle() {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    searchQuery.value = "";
  }
}

function close() {
  isOpen.value = false;
}
</script>

<template>
  <div class="chapter-nav">
    <button type="button" class="nav-toggle" :class="{ active: isOpen }" @click="toggle">
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <template v-if="!isOpen">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </template>
        <template v-else>
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </template>
      </svg>
    </button>

    <Transition name="nav">
      <div v-if="isOpen" class="nav-overlay" @click.self="isOpen = false">
        <div class="nav-panel">
          <div class="panel-header">
            <h2 class="panel-title">Chapters</h2>
            <button type="button" class="panel-close" @click="isOpen = false">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <div class="panel-search">
            <svg
              class="search-icon"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search..."
              class="search-input"
            />
          </div>
          <div class="panel-list">
            <template v-if="filteredParts.length">
              <div v-for="part in filteredParts" :key="part.title" class="part-group">
                <div class="part-title">
                  {{ part.title }}
                </div>
                <router-link
                  v-for="ch in part.chapters"
                  :key="ch.slug"
                  :to="`/chapter/${ch.slug}`"
                  class="chapter-item"
                  :class="{ active: current?.slug === ch.slug }"
                  @click="close"
                >
                  <span class="ch-num">{{ String(ch.number).padStart(2, "0") }}</span>
                  <div class="ch-info">
                    <span class="ch-title">{{ ch.title }}</span>
                    <span class="ch-desc">{{ ch.description }}</span>
                  </div>
                </router-link>
              </div>
            </template>
            <div v-else class="no-results">
              No chapters found
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.chapter-nav {
  position: relative;
}

.nav-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  color: var(--text-muted);
  transition:
    border-color 0.2s,
    color 0.2s;
}

.nav-toggle:hover,
.nav-toggle.active {
  border-color: var(--accent);
  color: var(--text-primary);
}

.nav-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: flex-end;
}

.nav-panel {
  width: 360px;
  max-width: 100vw;
  height: 100%;
  background: var(--bg-secondary);
  border-left: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid var(--border-color);
  flex-shrink: 0;
}

.panel-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: 0.02em;
}

.panel-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: transparent;
  border: none;
  border-radius: var(--radius);
  color: var(--text-muted);
  transition:
    color 0.15s,
    background 0.15s;
}

.panel-close:hover {
  color: var(--text-primary);
  background: var(--bg-tertiary);
}

.panel-search {
  padding: 10px 16px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.search-icon {
  color: var(--text-muted);
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: var(--text-primary);
  font-size: 13px;
  font-family: inherit;
}

.search-input::placeholder {
  color: var(--text-muted);
}

.panel-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.part-group {
  margin-bottom: 4px;
}

.part-group:last-child {
  margin-bottom: 0;
}

.part-title {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
  padding: 10px 8px 4px;
}

.chapter-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 6px 8px;
  border-radius: var(--radius);
  color: var(--text-secondary);
  font-size: 13px;
  text-decoration: none;
  transition:
    background 0.15s,
    color 0.15s;
}

.chapter-item:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

.chapter-item.active {
  background: var(--accent-subtle);
  color: var(--accent);
}

.ch-num {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--text-muted);
  min-width: 20px;
  opacity: 0.5;
}

.chapter-item.active .ch-num {
  color: var(--accent);
  opacity: 0.7;
}

.ch-info {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}

.ch-title {
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ch-desc {
  font-size: 10px;
  color: var(--text-muted);
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chapter-item.active .ch-desc {
  color: var(--accent);
  opacity: 0.6;
}

.no-results {
  padding: 24px 8px;
  text-align: center;
  color: var(--text-muted);
  font-size: 12px;
}

/* Transition */
.nav-enter-active,
.nav-leave-active {
  transition: background 0.25s ease;
}

.nav-enter-active .nav-panel,
.nav-leave-active .nav-panel {
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-enter-from,
.nav-leave-to {
  background: rgba(0, 0, 0, 0);
}

.nav-enter-from .nav-panel,
.nav-leave-to .nav-panel {
  transform: translateX(100%);
}
</style>
