import Vue from 'vue'
import Router from 'vue-router'
import Meta from 'vue-meta'
import User from '@/store/models/User'

Vue.use(Router)
Vue.use(Meta)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      beforeEnter: (to, from, next) => {
        next('/status')
      },
    },
    {
      path: '/status',
      name: 'status',
      component: () =>
        import(
          /* webpackChunkName: "status" */ './components/Status/index.vue'
        ),
    },
    {
      path: '/docs',
      name: 'docs',
      component: () =>
        import(/* webpackChunkName: "docs" */ './components/Docs/index.vue'),
      children: [
        {
          path: ':docFile',
          component: () =>
            import(
              /* webpackChunkName: "doc-file" */ './components/Docs/Document/index.vue'
            ),
        },
      ],
    },
    {
      path: '/templates/:folderId',
      name: 'templates',
      component: () =>
        import(
          /* webpackChunkName: "templates" */ './components/Templates/index.vue'
        ),
      children: [
        {
          // UserProfile will be rendered inside User's <router-view>
          // when /user/:id/profile is matched
          path: ':fileId',
          component: () =>
            import(
              /* webpackChunkName: "template" */ './components/Templates/File/index.vue'
            ),
        },
      ],
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
        import(
          /* webpackChunkName: "templates" */ './components/Login/index.vue'
        ),
    },
    {
      // will match everything
      path: '*',
      beforeEnter: (to, from, next) => {
        next('/status')
      },
    },
  ],
})
