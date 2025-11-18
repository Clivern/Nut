import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Dashboard from '../views/Dashboard.vue'
import Form from '../views/Form.vue'
import Cards from '../views/Cards.vue'
import Navigation from '../views/Navigation.vue'
import Modals from '../views/Modals.vue'
import Login from '../views/Login.vue'
import Signup from '../views/Signup.vue'
import ForgotPassword from '../views/ForgotPassword.vue'
import Users from '../views/Users.vue'
import Calendar from '../views/Calendar.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPassword
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/form',
    name: 'Form',
    component: Form
  },
  {
    path: '/cards',
    name: 'Cards',
    component: Cards
  },
  {
    path: '/modals',
    name: 'Modals',
    component: Modals
  },
  {
    path: '/navigation',
    name: 'Navigation',
    component: Navigation
  },
  {
    path: '/users',
    name: 'Users',
    component: Users
  },
  {
    path: '/calendar',
    name: 'Calendar',
    component: Calendar
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

