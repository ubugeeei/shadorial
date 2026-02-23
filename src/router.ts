import { createRouter, createWebHistory } from "vue-router";
import { chapters } from "./chapters/index";

const routes = chapters.map((ch) => ({
  path: `/chapter/${ch.slug}`,
  name: ch.slug,
  component: () => import(`./chapters/${ch.dir}/index.vue`),
  meta: { title: ch.title, chapterNumber: ch.number },
}));

routes.unshift({
  path: "/",
  name: "home",
  redirect: `/chapter/${chapters[0].slug}`,
  meta: { title: "Home", chapterNumber: 0 },
});

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});
