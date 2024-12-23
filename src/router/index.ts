import { createRouter, createWebHistory } from 'vue-router'
import MergePage from '@/components/pages/MergePage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: import('@/components/pages/HomePage.vue')
    },
    {
      path: '/operator',
      name: 'operatorStat',
      component: import('@/components/pages/OperatorPage.vue')
    },
    {
      path: '/activity/:module?/:item?',
      name: 'activityStat',
      component: import('@/components/pages/ActivityPage.vue')
    },
    // {
    //   path: '/operator/:id',
    //   name: 'operator',
    //   component: OperatorPage
    // },
    {
      path: '/game/merge',
      name: 'merge',
      component: MergePage
    }
  ]
})

export default router
