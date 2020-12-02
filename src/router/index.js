import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

export default new VueRouter({
  routes: [
    {
      path: "/Overview",
      component: () => import("@/views/Overview.vue")
    },
    {
      path: "/Customers",
      component: () => import("@/views/Customers.vue")
    },
    {
      path: "/Resvercation",
      component: () => import("@/views/Resvercation.vue")
    },
  ]
});