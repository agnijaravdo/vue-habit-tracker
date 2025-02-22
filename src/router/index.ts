import { createRouter, createWebHistory } from 'vue-router'
import { setError } from '@store/error'
import HomeView from '../views/HomeView.vue'
import { isValidDate } from '../utils/dateUtil'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/day/:day',
      name: 'day',
      component: HomeView,
      beforeEnter: (to, _from, next) => {
        if (isValidDate(to.params.day)) {
          next()
        } else {
          setError(
            new Error('Invalid date. This page does not exist. Enter date in the format YYYY-MM-DD')
          )
          next()
        }
      }
    },
    {
      path: '/:pathMatch(.*)*',
      component: HomeView,
      beforeEnter: (_to, _from, next) => {
        setError(new Error('The page you are looking for does not exist.'))
        next()
      }
    }
  ]
})

export default router
