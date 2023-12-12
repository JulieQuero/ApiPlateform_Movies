import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import MoviesView from "../views/MoviesView.vue";
import ActorsView from "../views/ActorsView.vue";
import CategoriesView from "../views/CategoriesView.vue";
import LoginView from "../views/LoginView.vue";
import MovieDetailView from "../views/MovieDetailView.vue";
import ActorDetailView from "../views/ActorDetailView.vue";
import CategoryDetailView from "../views/CategoryDetailView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/movies',
      name: 'movies',
      component: MoviesView
    },
    {
      path: '/actors',
      name: 'actors',
      component: ActorsView
    },
    {
      path: '/categories',
      name: 'categories',
      component: CategoriesView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/movie-detail/:id',
      name: 'movieDetails',
      component: MovieDetailView
    },
    {
      path: '/actor-detail/:id',
      name: 'actorDetails',
      component: ActorDetailView
    },
    {
      path: '/category-detail/:id',
      name: 'categoryDetails',
      component: CategoryDetailView
    },
  ]
})

router.beforeEach((to, from, next) => {
  const PUBLIC_PAGES = ['login'];
  const loggedIn = localStorage.getItem('user-token');

  if (!loggedIn && !PUBLIC_PAGES.includes(to.name)) {
    return next('/login');
  }

  next();
});

export default router
