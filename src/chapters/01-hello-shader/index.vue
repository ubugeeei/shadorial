<script setup lang="ts">
import ShaderPlayground from "@/components/ShaderPlayground.vue";
import { chapters } from "@/chapters/index";
import defaultCode from "./default.frag?raw";
import Content from "./content.md";

const chapter = chapters.find((c) => c.number === 1)!;
</script>

<template>
  <ShaderPlayground :chapter="chapter" :default-code="defaultCode" :content="Content" />
</template>
