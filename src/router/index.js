import { createRouter, createWebHashHistory } from "vue-router";
import Dashboard from "@/views/Dashboard.vue";
import Extract from "@/views/Extract.vue";
import SignIn from "@/views/SignIn.vue";
import PixIn from "@/views/PixIn.vue";
import PixOut from "@/views/PixOut.vue";
import PasswordChanger from "@/views/PasswordChanger.vue";
import Proof from "@/views/Proof.vue";

import { isTokenValid } from "./auth"; // Importe a função

const routes = [
  {
    path: "/",
    name: "/",
    redirect: "/sign-in",
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    meta: { requiresAuth: true },
    component: Dashboard,
  },
  {
    path: "/recarga",
    name: "recarga",
    meta: { requiresAuth: true },
    component: PixIn,
  },
  {
    path: "/withdrawal",
    name: "withdrawal",
    meta: { requiresAuth: true },
    component: PixOut,
  },
  {
    path: "/extract",
    name: "extract",
    meta: { requiresAuth: true },

    component: Extract,
  },

  {
    path: "/changer-password",
    name: "changerPassword",
    meta: { requiresAuth: true },
    component: PasswordChanger,
  },

  {
    path: "/proof/:id",
    name: "proof",
    meta: { requiresAuth: true },
    component: Proof,
    props: true,
  },

  {
    path: "/sign-in",
    name: "Sign In",
    component: SignIn,
  },
];

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
  linkActiveClass: "active",
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!isTokenValid()) {
      next({
        path: "/sign-in",
        query: { redirect: to.fullPath },
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
