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
import ResetPassword from '../views/ResetPassword.vue'
import VerifyEmail from '../views/VerifyEmail.vue'
import TermsOfUse from '../views/TermsOfUse.vue'
import PrivacyPolicy from '../views/PrivacyPolicy.vue'
import NotFound from '../views/NotFound.vue'
import ServerError from '../views/ServerError.vue'
import Users from '../views/Users.vue'
import Calendar from '../views/Calendar.vue'
import Profile from '../views/Profile.vue'
import Subscription from '../views/Subscription.vue'
import CopilotChat from '../views/CopilotChat.vue'
import Themes from '../views/Themes.vue'
import Empty from '../views/Empty.vue'
import SelectWorkspace from '../views/SelectWorkspace.vue'
import CreateWorkspace from '../views/CreateWorkspace.vue'
import Charts from '../views/Charts.vue'
import Metrics from '../views/Metrics.vue'

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
    path: '/reset-password/:email?/:token?',
    name: 'ResetPassword',
    component: ResetPassword
  },
  {
    path: '/verify-email/:email/:token',
    name: 'VerifyEmail',
    component: VerifyEmail
  },
  {
    path: '/terms',
    name: 'TermsOfUse',
    component: TermsOfUse
  },
  {
    path: '/privacy',
    name: 'PrivacyPolicy',
    component: PrivacyPolicy
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
    path: '/charts',
    name: 'Charts',
    component: Charts
  },
  {
    path: '/metrics',
    name: 'Metrics',
    component: Metrics
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
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile
  },
  {
    path: '/subscription',
    name: 'Subscription',
    component: Subscription
  },
  {
    path: '/copilot',
    name: 'CopilotChat',
    component: CopilotChat
  },
  {
    path: '/themes',
    name: 'Themes',
    component: Themes
  },
  {
    path: '/empty',
    name: 'Empty',
    component: Empty
  },
  {
    path: '/select-workspace',
    name: 'SelectWorkspace',
    component: SelectWorkspace
  },
  {
    path: '/create-workspace',
    name: 'CreateWorkspace',
    component: CreateWorkspace
  },
  {
    path: '/500',
    name: 'ServerError',
    component: ServerError
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

