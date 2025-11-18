<template>
  <div class="min-h-screen bg-notion-bg flex flex-col">
    <NavBar />

    <main class="flex-1 flex flex-col w-full py-8 px-6 lg:px-8">
      <div class="page-header mb-6">
        <h1 class="page-title">AI Copilot</h1>
        <p class="page-subtitle">Chat with your AI assistant</p>
      </div>

      <!-- Chat Container -->
      <div class="flex-1 flex flex-col card p-0 overflow-hidden">
        <!-- Messages Area -->
        <div
          ref="messagesContainer"
          class="flex-1 overflow-y-auto p-6 space-y-4"
          style="max-height: calc(100vh - 300px);"
        >
          <!-- Welcome Message -->
          <div v-if="messages.length === 0" class="flex items-center justify-center h-full">
            <div class="text-center">
              <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-notion-hover flex items-center justify-center">
                <svg class="w-8 h-8 text-notion-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-notion-text mb-2">Start a conversation</h3>
              <p class="text-sm text-notion-textLight mb-6">Ask me anything and I'll help you out!</p>
              <!-- Quick Suggestions -->
              <div class="flex flex-wrap gap-2 justify-center">
                <button
                  v-for="suggestion in quickSuggestions"
                  :key="suggestion"
                  @click="sendMessage(suggestion)"
                  class="px-4 py-2 bg-notion-hover hover:bg-notion-border text-sm text-notion-text rounded-md transition-colors"
                >
                  {{ suggestion }}
                </button>
              </div>
            </div>
          </div>

          <!-- Messages -->
          <div
            v-for="(message, index) in messages"
            :key="index"
            class="flex"
            :class="message.role === 'user' ? 'justify-end' : 'justify-start'"
          >
            <div
              class="max-w-[80%] rounded-lg px-4 py-3"
              :class="
                message.role === 'user'
                  ? 'bg-notion-text text-white'
                  : 'bg-notion-hover text-notion-text'
              "
            >
              <div class="flex items-start gap-3">
                <div v-if="message.role === 'assistant'" class="flex-shrink-0 mt-1">
                  <div class="w-6 h-6 rounded-full bg-notion-text flex items-center justify-center">
                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                    </svg>
                  </div>
                </div>
                <div class="flex-1">
                  <p class="text-sm whitespace-pre-wrap break-words">{{ message.content }}</p>
                  <p class="text-xs mt-2 opacity-70">
                    {{ formatTime(message.timestamp) }}
                  </p>
                </div>
                <div v-if="message.role === 'user'" class="flex-shrink-0 mt-1">
                  <div class="w-6 h-6 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                    <span class="text-xs font-medium">{{ userInitials }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Typing Indicator -->
          <div v-if="isTyping" class="flex justify-start">
            <div class="max-w-[80%] rounded-lg px-4 py-3 bg-notion-hover text-notion-text">
              <div class="flex items-center gap-2">
                <div class="w-6 h-6 rounded-full bg-notion-text flex items-center justify-center">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                  </svg>
                </div>
                <div class="flex gap-1">
                  <div class="w-2 h-2 bg-notion-text rounded-full animate-bounce" style="animation-delay: 0s"></div>
                  <div class="w-2 h-2 bg-notion-text rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                  <div class="w-2 h-2 bg-notion-text rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Input Area -->
        <div class="border-t border-notion-border p-4">
          <form @submit.prevent="handleSendMessage" class="flex gap-3">
            <div class="flex-1 relative">
              <textarea
                v-model="inputMessage"
                ref="inputRef"
                @keydown.enter.exact.prevent="handleSendMessage"
                @keydown.shift.enter.exact="inputMessage += '\n'"
                rows="1"
                class="input-field resize-none pr-12"
                placeholder="Type your message..."
                style="min-height: 44px; max-height: 120px;"
                @input="autoResize"
              ></textarea>
              <button
                type="submit"
                :disabled="!inputMessage.trim() || isTyping"
                class="absolute right-2 bottom-2 p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                :class="inputMessage.trim() && !isTyping ? 'text-notion-text hover:bg-notion-hover' : 'text-notion-textLight'"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                </svg>
              </button>
            </div>
            <button
              type="submit"
              :disabled="!inputMessage.trim() || isTyping"
              class="btn-primary px-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </form>
          <p class="text-xs text-notion-textLight mt-2">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, watch } from 'vue'
import NavBar from '../components/NavBar.vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const messages = ref([])
const inputMessage = ref('')
const isTyping = ref(false)
const messagesContainer = ref(null)
const inputRef = ref(null)

const quickSuggestions = ref([
  'How can I get started?',
  'What features are available?',
  'Tell me about the subscription plans',
  'Help me with my account settings'
])

const userInitials = computed(() => {
  const user = authStore.user
  if (user?.name) {
    const names = user.name.split(' ')
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase()
    }
    return user.name.substring(0, 2).toUpperCase()
  }
  if (user?.email) {
    return user.email.substring(0, 2).toUpperCase()
  }
  return 'U'
})

const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now - date

  if (diff < 60000) {
    return 'Just now'
  }
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000)
    return `${minutes}m ago`
  }
  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000)
    return `${hours}h ago`
  }
  return date.toLocaleDateString()
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

const autoResize = (event) => {
  const textarea = event.target
  textarea.style.height = 'auto'
  textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`
}

const generateAIResponse = (userMessage) => {
  // Mock AI responses - in a real app, this would call an AI API
  const responses = [
    `I understand you're asking about "${userMessage}". Let me help you with that!`,
    `That's a great question! Here's what I can tell you about "${userMessage}".`,
    `I'd be happy to help! Based on your question about "${userMessage}", here's some information that might be useful.`,
    `Thanks for asking! Regarding "${userMessage}", I can provide you with the following insights.`
  ]

  // Simple keyword-based responses
  const lowerMessage = userMessage.toLowerCase()
  if (lowerMessage.includes('subscription') || lowerMessage.includes('plan') || lowerMessage.includes('pricing')) {
    return `I can help you with subscription information! We offer three plans:\n\n• **Free Plan** - $0/month with 10 requests/month\n• **Pro Plan** - $29/month with 1,000 requests/month\n• **Enterprise Plan** - $99/month with unlimited requests\n\nYou can visit the Subscription page to manage your plan or upgrade. Would you like to know more about any specific plan?`
  }

  if (lowerMessage.includes('profile') || lowerMessage.includes('account') || lowerMessage.includes('settings')) {
    return `You can manage your account settings on the Profile page. There, you can:\n\n• Update your personal information\n• Change your password\n• Manage notification preferences\n• Enable two-factor authentication\n\nIs there a specific setting you'd like help with?`
  }

  if (lowerMessage.includes('help') || lowerMessage.includes('start') || lowerMessage.includes('begin')) {
    return `Welcome! I'm here to help you navigate the platform. Here are some things you can do:\n\n• **Dashboard** - View your stats and recent activity\n• **Profile** - Manage your account settings\n• **Subscription** - View and manage your plan\n• **Calendar** - Keep track of important dates\n\nWhat would you like to explore first?`
  }

  if (lowerMessage.includes('feature') || lowerMessage.includes('what can')) {
    return `Our platform offers many features:\n\n• **Dashboard** with real-time statistics\n• **User management** and profiles\n• **Calendar** integration\n• **Form builders** and cards\n• **Modals** for interactions\n• **AI Copilot** (that's me!) for assistance\n\nWhich feature interests you most?`
  }

  return responses[Math.floor(Math.random() * responses.length)]
}

const sendMessage = async (messageText) => {
  if (!messageText.trim() || isTyping.value) return

  const userMessage = messageText.trim()
  inputMessage.value = ''

  // Add user message
  messages.value.push({
    role: 'user',
    content: userMessage,
    timestamp: Date.now()
  })

  scrollToBottom()

  // Simulate AI typing
  isTyping.value = true
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000))

  // Generate and add AI response
  const aiResponse = generateAIResponse(userMessage)
  messages.value.push({
    role: 'assistant',
    content: aiResponse,
    timestamp: Date.now()
  })

  isTyping.value = false
  scrollToBottom()
}

const handleSendMessage = () => {
  if (inputMessage.value.trim()) {
    sendMessage(inputMessage.value)
  }
}

// Watch for new messages and scroll
watch(messages, () => {
  scrollToBottom()
}, { deep: true })

// Focus input on mount
nextTick(() => {
  if (inputRef.value) {
    inputRef.value.focus()
  }
})
</script>

<style scoped>
@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}
</style>

