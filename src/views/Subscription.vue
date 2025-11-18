<template>
  <div class="min-h-screen bg-theme-bg">
    <NavBar />

    <main class="w-full py-8 px-6 lg:px-8">
      <div class="page-header">
        <h1 class="page-title">Subscription</h1>
        <p class="page-subtitle">Manage your subscription and billing</p>
      </div>

      <!-- Current Subscription -->
      <div class="mb-6">
        <div class="card">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h3 class="text-lg font-semibold text-theme-text mb-2">Current Plan</h3>
              <p class="text-sm text-theme-textLight">
                You are currently on the <span class="font-medium text-theme-text">{{ currentPlan.name }}</span> plan
              </p>
              <p class="text-xs text-theme-textLight mt-1">
                Renews on {{ currentPlan.renewalDate }}
              </p>
            </div>
            <div class="mt-4 md:mt-0">
              <span class="inline-block px-4 py-2 bg-green-100 text-green-800 text-sm font-medium rounded-md">
                {{ currentPlan.status }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Subscription Plans -->
      <div class="mb-6">
        <h2 class="text-xl font-semibold text-theme-text mb-4">Choose Your Plan</h2>
        <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
          <!-- Free Plan -->
          <div class="card" :class="{ 'ring-2 ring-theme-text': currentPlan.name === 'Free' }">
            <div class="text-center mb-6">
              <h3 class="text-xl font-semibold text-theme-text mb-2">Free</h3>
              <div class="mb-4">
                <span class="text-3xl font-bold text-theme-text">$0</span>
                <span class="text-sm text-theme-textLight">/month</span>
              </div>
              <p class="text-sm text-theme-textLight">Perfect for getting started</p>
            </div>
            <ul class="space-y-3 mb-6">
              <li class="flex items-start">
                <svg class="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span class="text-sm text-theme-text">10 requests/month</span>
              </li>
              <li class="flex items-start">
                <svg class="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span class="text-sm text-theme-text">Basic support</span>
              </li>
              <li class="flex items-start">
                <svg class="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span class="text-sm text-theme-text">Community access</span>
              </li>
            </ul>
            <button
              @click="selectPlan('Free')"
              class="w-full btn-secondary"
              :class="{ 'btn-primary': currentPlan.name === 'Free' }"
            >
              {{ currentPlan.name === 'Free' ? 'Current Plan' : 'Select Plan' }}
            </button>
          </div>

          <!-- Pro Plan -->
          <div class="card relative" :class="{ 'ring-2 ring-theme-text': currentPlan.name === 'Pro' }">
            <div v-if="currentPlan.name === 'Pro'" class="absolute top-0 right-0 bg-theme-text text-white px-3 py-1 text-xs font-medium rounded-bl-lg">
              Current
            </div>
            <div class="text-center mb-6">
              <h3 class="text-xl font-semibold text-theme-text mb-2">Pro</h3>
              <div class="mb-4">
                <span class="text-3xl font-bold text-theme-text">$29</span>
                <span class="text-sm text-theme-textLight">/month</span>
              </div>
              <p class="text-sm text-theme-textLight">For professionals and teams</p>
            </div>
            <ul class="space-y-3 mb-6">
              <li class="flex items-start">
                <svg class="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span class="text-sm text-theme-text">1,000 requests/month</span>
              </li>
              <li class="flex items-start">
                <svg class="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span class="text-sm text-theme-text">Priority support</span>
              </li>
              <li class="flex items-start">
                <svg class="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span class="text-sm text-theme-text">Advanced analytics</span>
              </li>
              <li class="flex items-start">
                <svg class="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span class="text-sm text-theme-text">API access</span>
              </li>
            </ul>
            <button
              @click="selectPlan('Pro')"
              class="w-full btn-secondary"
              :class="{ 'btn-primary': currentPlan.name === 'Pro' }"
            >
              {{ currentPlan.name === 'Pro' ? 'Current Plan' : 'Select Plan' }}
            </button>
          </div>

          <!-- Enterprise Plan -->
          <div class="card" :class="{ 'ring-2 ring-theme-text': currentPlan.name === 'Enterprise' }">
            <div class="text-center mb-6">
              <h3 class="text-xl font-semibold text-theme-text mb-2">Enterprise</h3>
              <div class="mb-4">
                <span class="text-3xl font-bold text-theme-text">$99</span>
                <span class="text-sm text-theme-textLight">/month</span>
              </div>
              <p class="text-sm text-theme-textLight">For large organizations</p>
            </div>
            <ul class="space-y-3 mb-6">
              <li class="flex items-start">
                <svg class="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span class="text-sm text-theme-text">Unlimited requests</span>
              </li>
              <li class="flex items-start">
                <svg class="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span class="text-sm text-theme-text">24/7 dedicated support</span>
              </li>
              <li class="flex items-start">
                <svg class="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span class="text-sm text-theme-text">Custom integrations</span>
              </li>
              <li class="flex items-start">
                <svg class="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span class="text-sm text-theme-text">SLA guarantee</span>
              </li>
              <li class="flex items-start">
                <svg class="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span class="text-sm text-theme-text">Account manager</span>
              </li>
            </ul>
            <button
              @click="selectPlan('Enterprise')"
              class="w-full btn-secondary"
              :class="{ 'btn-primary': currentPlan.name === 'Enterprise' }"
            >
              {{ currentPlan.name === 'Enterprise' ? 'Current Plan' : 'Select Plan' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Billing History -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div class="card">
          <h3 class="text-lg font-semibold text-theme-text mb-4">Billing History</h3>
          <div class="space-y-3">
            <div
              v-for="invoice in billingHistory"
              :key="invoice.id"
              class="flex items-center justify-between py-3 border-b border-theme-border last:border-0"
            >
              <div>
                <p class="text-sm font-medium text-theme-text">{{ invoice.description }}</p>
                <p class="text-xs text-theme-textLight mt-1">{{ invoice.date }}</p>
              </div>
              <div class="text-right">
                <p class="text-sm font-medium text-theme-text">${{ invoice.amount }}</p>
                <a href="#" class="text-xs text-theme-textLight hover:text-theme-text">Download</a>
              </div>
            </div>
          </div>
        </div>

        <!-- Payment Method -->
        <div class="card">
          <h3 class="text-lg font-semibold text-theme-text mb-4">Payment Method</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between p-4 bg-theme-hover rounded-lg">
              <div class="flex items-center">
                <div class="w-10 h-10 bg-white rounded flex items-center justify-center mr-3">
                  <svg class="w-6 h-6 text-theme-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-theme-text">•••• •••• •••• 4242</p>
                  <p class="text-xs text-theme-textLight">Expires 12/25</p>
                </div>
              </div>
              <button class="btn-secondary text-sm">Edit</button>
            </div>
            <button class="w-full btn-secondary">Add Payment Method</button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import NavBar from '../components/NavBar.vue'

const currentPlan = ref({
  name: 'Pro',
  status: 'Active',
  renewalDate: 'March 15, 2024'
})

const billingHistory = ref([
  {
    id: 1,
    description: 'Pro Plan - February 2024',
    date: 'Feb 15, 2024',
    amount: '29.00'
  },
  {
    id: 2,
    description: 'Pro Plan - January 2024',
    date: 'Jan 15, 2024',
    amount: '29.00'
  },
  {
    id: 3,
    description: 'Pro Plan - December 2023',
    date: 'Dec 15, 2023',
    amount: '29.00'
  }
])

const selectPlan = (planName) => {
  if (currentPlan.value.name === planName) {
    return
  }

  // Handle plan selection logic
  console.log('Selecting plan:', planName)
  currentPlan.value.name = planName
  alert(`You have selected the ${planName} plan!`)
}
</script>

