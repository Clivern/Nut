<template>
  <div id="app" class="min-h-screen">
    <FlashNotice :message="flashMessage" :duration="flashDuration" @dismiss="clearFlash" />
    <CookieConsent />
    <CommandPalette />
    <router-view />
  </div>
</template>

<script setup>
import CommandPalette from '@/components/CommandPalette.vue'
import CookieConsent from '@/components/CookieConsent.vue'
import FlashNotice from '@/components/FlashNotice.vue'
import { flashMessage, flashDuration, clearFlash } from '@/lib/flash'
</script>
