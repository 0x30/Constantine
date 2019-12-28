import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes: RouteConfig[] = [
  {
    path: "/:page?",
    name: "home",
    component: Home,
    props: route => ({ page: Number.parseInt(route.params.page || "0") })
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ "../views/About.vue")
  },
  {
    path: "/post/:page/:index",
    name: "post",
    component: () => import(/* webpackChunkName: "about" */ "../views/Detail.vue"),
    props: route => ({ page: Number.parseInt(route.params.page || "0"), index: Number.parseInt(route.params.index || "0") })
  },
  {
    path: "/tags/:tag/:page?",
    name: "tags",
    component: () => import(/* webpackChunkName: "about" */ "../views/Tags.vue"),
    props: route => ({ page: Number.parseInt(route.params.page || "0"), tag: route.params.tag })
  }
];

const router = new VueRouter({
  // mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
