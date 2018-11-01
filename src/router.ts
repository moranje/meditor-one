import Vue from 'vue';
import VueRouter from 'vue-router';

import Document from './components/document.vue';
import File from './components/file.vue';
import KitchenSink from './components/kitchensink.vue';

Vue.use(VueRouter);

export default new VueRouter({
  routes: [
    {
      path: '/',
      name: 'document',
      component: Document
    },
    {
      path: '/file/:id',
      name: 'file',
      component: File
    },
    {
      path: '/kitchensink/:id',
      name: 'file',
      component: KitchenSink
    }
  ],
  mode: 'history'
});
