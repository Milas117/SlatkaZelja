import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Torte from '../views/Torte.vue'
import Kolaci from '../views/Kolaci.vue'
import Registracija from '../views/Registracija.vue'
import Prijava from '../views/Prijava.vue'
import MojeNarudzbe from '../views/MojeNarudzbe.vue'
import Gallery from '../views/Gallery.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/torte',
      name: 'torte',
      component: Torte
    },
    {
      path: '/kolaci',
      name: 'kolaci',
      component: Kolaci
    },
    {
      path: '/registracija',
      name: 'registracija',
      component: Registracija
    },
    {
      path: '/prijava',
      name: 'prijava',
      component: Prijava
    },
    {
      path: '/moje_narudzbe',
      name: 'moje_narudzbe',
      component: MojeNarudzbe
    },
    {
      path: '/galerija',
      name: 'galerija',
      component: Gallery
    }
  ]
})

export default router
