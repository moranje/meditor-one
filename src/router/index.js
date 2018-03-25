import Vue from 'vue';
import VueRouter from 'vue-router';

import Document from '../components/document';
import File from '../components/file';

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
    }
  ],
  mode: 'history'
});
