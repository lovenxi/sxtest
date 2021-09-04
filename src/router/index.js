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
      path: "/Bill",
      component: () => import("@/views/Bill.vue")
    },
    {
      path: "/Overview",
      component: () => import("@/views/Overview.vue")
    },
    {
      path: "/Member",
      component: () => import("@/views/Member.vue")
    },
    {
      path:"/information",
      component: () => import("@/views/information.vue")
    },
    {
      path: "/Developement",
      component: () => import("@/views/Developement.vue")
    },
    /*{
      path: "/Customers",
      component: () => import("@/views/Customers.vue")
    },*/
    {
      path: "/Resvercation",
      component: () => import("@/views/Resvercation.vue")
    },
    {
      path: "/StudyInfo",
      component: () => import("@/views/StudyInfo.vue")
    },
    {
      path:"/Document",
      component: () => import("@/views/Document.vue")
    }
  ]
});