import Vue from "vue";
import VueRouter from "vue-router";
import Editor from "@/views/editor";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "editor",
    component: Editor
  }
];

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes
});

export default router;
