<template>
  <div class="min-h-screen bg-theme-bg">
    <NavBar />

    <main class="w-full py-8 px-6 lg:px-8">
      <div class="page-header">
        <h1 class="page-title">Profile</h1>
        <p class="page-subtitle">Manage your account settings and preferences</p>
      </div>

      <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <!-- Profile Information -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Personal Information -->
          <div class="card">
            <h3 class="text-lg font-semibold text-theme-text mb-6">Personal Information</h3>
            <div class="form-group">
              <div>
                <label class="form-label">Full Name</label>
                <input
                  v-model="profile.name"
                  type="text"
                  class="input-field"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label class="form-label">Email Address</label>
                <input
                  v-model="profile.email"
                  type="email"
                  class="input-field"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label class="form-label">Phone Number</label>
                <input
                  v-model="profile.phone"
                  type="tel"
                  class="input-field"
                  placeholder="Enter your phone number"
                />
              </div>
              <div>
                <label class="form-label">Bio</label>
                <textarea
                  v-model="profile.bio"
                  rows="4"
                  class="input-field"
                  placeholder="Tell us about yourself"
                ></textarea>
              </div>
              <div class="flex justify-end pt-2">
                <button @click="saveProfile" class="btn-primary">Save Changes</button>
              </div>
            </div>
          </div>

          <!-- Security Settings -->
          <div class="card">
            <h3 class="text-lg font-semibold text-theme-text mb-6">Security</h3>
            <div class="form-group">
              <div>
                <label class="form-label">Current Password</label>
                <input
                  v-model="password.current"
                  type="password"
                  class="input-field"
                  placeholder="Enter current password"
                />
              </div>
              <div>
                <label class="form-label">New Password</label>
                <input
                  v-model="password.new"
                  type="password"
                  class="input-field"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label class="form-label">Confirm New Password</label>
                <input
                  v-model="password.confirm"
                  type="password"
                  class="input-field"
                  placeholder="Confirm new password"
                />
              </div>
              <div class="flex justify-end pt-2">
                <button @click="updatePassword" class="btn-primary">Update Password</button>
              </div>
            </div>
          </div>

          <!-- Preferences -->
          <div class="card">
            <h3 class="text-lg font-semibold text-theme-text mb-6">Preferences</h3>
            <div class="space-y-4">
              <div class="flex items-center justify-between py-2">
                <div>
                  <p class="text-sm font-medium text-theme-text">Email Notifications</p>
                  <p class="text-xs text-theme-textLight mt-1">Receive email updates about your account</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    v-model="preferences.emailNotifications"
                    type="checkbox"
                    class="checkbox"
                  />
                </label>
              </div>
              <div class="flex items-center justify-between py-2 border-t border-theme-border">
                <div>
                  <p class="text-sm font-medium text-theme-text">Marketing Emails</p>
                  <p class="text-xs text-theme-textLight mt-1">Receive emails about new features and offers</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    v-model="preferences.marketingEmails"
                    type="checkbox"
                    class="checkbox"
                  />
                </label>
              </div>
              <div class="flex items-center justify-between py-2 border-t border-theme-border">
                <div>
                  <p class="text-sm font-medium text-theme-text">Two-Factor Authentication</p>
                  <p class="text-xs text-theme-textLight mt-1">Add an extra layer of security to your account</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    v-model="preferences.twoFactor"
                    type="checkbox"
                    class="checkbox"
                  />
                </label>
              </div>
              <div class="flex justify-end pt-4">
                <button @click="savePreferences" class="btn-primary">Save Preferences</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Profile Picture -->
          <div class="card">
            <div class="flex flex-col items-center">
              <div class="w-24 h-24 rounded-full bg-theme-hover flex items-center justify-center mb-4">
                <span class="text-3xl font-semibold text-theme-text">
                  {{ profileInitials }}
                </span>
              </div>
              <button class="btn-secondary text-sm mb-2">Change Photo</button>
              <p class="text-xs text-theme-textLight text-center">
                JPG, GIF or PNG. Max size of 2MB
              </p>
            </div>
          </div>

          <!-- Account Stats -->
          <div class="card">
            <h3 class="text-sm font-semibold text-theme-text mb-4">Account Information</h3>
            <div class="space-y-3">
              <div class="flex justify-between py-2 border-b border-theme-border">
                <span class="text-sm text-theme-textLight">Member Since</span>
                <span class="text-sm font-medium text-theme-text">{{ accountInfo.memberSince }}</span>
              </div>
              <div class="flex justify-between py-2 border-b border-theme-border">
                <span class="text-sm text-theme-textLight">Last Login</span>
                <span class="text-sm font-medium text-theme-text">{{ accountInfo.lastLogin }}</span>
              </div>
              <div class="flex justify-between py-2">
                <span class="text-sm text-theme-textLight">Account Status</span>
                <span class="text-sm font-medium text-green-600">{{ accountInfo.status }}</span>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="card">
            <h3 class="text-sm font-semibold text-theme-text mb-4">Quick Actions</h3>
            <div class="space-y-2">
              <router-link to="/subscription" class="btn-secondary w-full text-center block">
                Manage Subscription
              </router-link>
              <button class="btn-secondary w-full">Download Data</button>
              <button class="btn-danger w-full">Delete Account</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import NavBar from '../components/NavBar.vue'

const profile = ref({
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1 (555) 123-4567',
  bio: 'Software developer passionate about building great products.'
})

const password = ref({
  current: '',
  new: '',
  confirm: ''
})

const preferences = ref({
  emailNotifications: true,
  marketingEmails: false,
  twoFactor: false
})

const accountInfo = ref({
  memberSince: 'Jan 15, 2024',
  lastLogin: '2 hours ago',
  status: 'Active'
})

const profileInitials = computed(() => {
  const names = profile.value.name.split(' ')
  if (names.length >= 2) {
    return `${names[0][0]}${names[1][0]}`.toUpperCase()
  }
  return profile.value.name.substring(0, 2).toUpperCase()
})

const saveProfile = () => {
  // Handle profile save logic
  console.log('Saving profile:', profile.value)
  alert('Profile updated successfully!')
}

const updatePassword = () => {
  // Handle password update logic
  if (password.value.new !== password.value.confirm) {
    alert('Passwords do not match!')
    return
  }
  console.log('Updating password')
  alert('Password updated successfully!')
  password.value = { current: '', new: '', confirm: '' }
}

const savePreferences = () => {
  // Handle preferences save logic
  console.log('Saving preferences:', preferences.value)
  alert('Preferences saved successfully!')
}
</script>

