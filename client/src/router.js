import { createRouter, createWebHistory } from "vue-router";
import Home from "./pages/Home.vue";
import Details from "./pages/Details.vue";
import Edit from "./pages/Edit.vue";
import NewProduct from "./pages/NewProduct.vue"; // ✅ asigură-te că există fișierul

const routes = [
  { path: "/", component: Home },
  { path: "/products/:id", component: Details },
  { path: "/products/:id/edit", component: Edit },
  { path: "/new", component: NewProduct } // ✅ ruta corectă
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
