import { createApp } from "vue";
import { install as VueMonacoEditorPlugin, loader } from "@guolao/vue-monaco-editor";
import { registerGlsl } from "./glsl-lang";
import App from "./App.vue";
import { router } from "./router";
import "@mdi/font/css/materialdesignicons.css";
import "./styles/global.css";

loader.init().then((monaco) => {
  registerGlsl(monaco);
});

const app = createApp(App);
app.use(router);
app.use(VueMonacoEditorPlugin, {
  paths: {
    vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs",
  },
});
app.mount("#app");
