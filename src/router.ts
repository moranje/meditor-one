import Vue from 'vue';
import Router from 'vue-router';
import Meta from 'vue-meta';
import User from '@/store/models/User';

Vue.use(Router);
Vue.use(Meta);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      beforeEnter: (to, from, next) => {
        next('/status');
      }
    },
    {
      path: '/status',
      name: 'status',
      component: () =>
        import(/* webpackChunkName: "status" */ './components/Status/index.vue')
    },
    {
      path: '/voorgeschiedenis',
      name: 'voorgeschiedenis',
      component: () =>
        import(/* webpackChunkName: "history" */ './components/History/index.vue')
    },
    {
      path: '/medicatie',
      name: 'medicatie',
      component: () =>
        import(/* webpackChunkName: "medication" */ './components/Medication/index.vue')
    },
    {
      path: '/templates/:folder_id',
      name: 'templates',
      component: () =>
        import(/* webpackChunkName: "templates" */ './components/Templates/index.vue'),
      children: [
        {
          // UserProfile will be rendered inside User's <router-view>
          // when /user/:id/profile is matched
          path: ':file_id',
          component: () =>
            import(/* webpackChunkName: "template" */ './components/Templates/File/index.vue')
        }
      ]
      // beforeEnter: function(to, from, next) {
      //   let user = User.query().first();

      //   if (!user) {
      //     next({
      //       path: '/login',
      //       query: { redirect: to.fullPath }
      //     });
      //   } else {
      //     next();
      //   }
      // }
    },
    {
      path: '/login',
      name: 'login',
      component: () =>
        import(/* webpackChunkName: "templates" */ './components/Login/index.vue')
    }
  ]
});
