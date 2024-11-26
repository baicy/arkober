import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/components/pages/HomePage.vue'
import OperatorPage from '@/components/pages/OperatorPage.vue'
import MergePage from '@/components/pages/MergePage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage
    },
    {
      path: '/operator/:id',
      name: 'operator',
      component: OperatorPage
    },
    {
      path: '/game/merge',
      name: 'merge',
      component: MergePage
    }
  ]
})

export default router
