import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/planning',
      name: 'planning',
      component: () => import('../views/PlanningView.vue'),
    },
    {
      path: '/line/:id',
      name: 'line',
      component: () => import('../views/LineView.vue'),
    },
    {
      path: '/line/:lineid/station/:id',
      name: 'station',
      component: () => import('../views/StationView.vue'),
    },
    {
      path: '/traveltimes',
      name: 'traveltimes',
      component: () => import('../views/TravelTimesView.vue'),
    },
    // TODO: Create 404 route?
  ],
})

export default router
