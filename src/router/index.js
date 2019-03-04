import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import User from '@/pages/usersManage'
import Org from '@/pages/organizationManage'
import Login from '@/pages/login'
import home from '@/pages/home'
import Power from '@/pages/powerManage'
import Role from '@/pages/roleManage'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/home',
      name: 'home',
      component: home,
      children: [
        {
          path: '/',
          name: 'HelloWorld',
          component: HelloWorld
        },
        {
          path: 'users',
          name: 'users',
          component: User
        },
        {
          path: 'org',
          name: 'org',
          component: Org
        },
        {
          path: 'power',
          name: 'power',
          component: Power
        },
        {
          path: 'role',
          name: 'role',
          component: Role
        },
      ]
    },
    {
      path: '/',
      name: 'login',
      component: Login
    }
  ]
})
