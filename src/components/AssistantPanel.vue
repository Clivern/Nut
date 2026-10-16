<template>
  <div>
    <Transition
      enter-active-class="transition duration-200 ease-out motion-reduce:transition-none"
      enter-from-class="translate-y-4 scale-95 opacity-0"
      leave-active-class="transition duration-150 ease-in motion-reduce:transition-none"
      leave-to-class="translate-y-4 scale-95 opacity-0"
    >
      <section
        v-if="open"
        :aria-label="title"
        class="fixed inset-x-4 bottom-24 z-40 flex h-[min(720px,calc(100vh-8rem))] origin-bottom-right flex-col overflow-hidden rounded-3xl bg-white shadow-[0_5px_40px_rgba(0,0,0,0.16)] sm:inset-x-auto sm:right-6 sm:w-[480px] lg:w-[560px]"
        @keydown.esc="open = false"
      >
        <template v-if="view === 'list'">
          <header class="flex items-center gap-3 border-b border-theme-border py-4 pl-5 pr-4">
            <AssistantAvatar />
            <div class="min-w-0 grow">
              <h2 class="text-base font-semibold text-theme-text">{{ title }}</h2>
              <p class="mt-0.5 text-sm text-theme-textLight">{{ subtitle }}</p>
            </div>
            <button type="button" class="btn-primary inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full px-3.5" @click="newChat">
              <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
              New
            </button>
            <button type="button" class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-theme-textLight hover:bg-theme-hover" aria-label="Close assistant" @click="open = false">
              <svg class="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
            </button>
          </header>

          <div class="grow overflow-y-auto">
            <p v-if="!chats.length" class="p-6 text-center text-sm text-theme-textLight">No chats yet. Start one with New.</p>
            <div v-for="item in chats" :key="item.id" class="group flex items-center border-b border-theme-border hover:bg-theme-hover">
              <button type="button" class="flex min-w-0 grow flex-col gap-1 py-3.5 pl-5 pr-2 text-left" @click="openChat(item)">
                <span class="flex w-full items-center gap-2">
                  <span class="min-w-0 grow truncate text-sm font-semibold text-theme-text">{{ item.title || 'New chat' }}</span>
                  <span v-if="item.status === 'running'" class="inline-flex whitespace-nowrap rounded-full bg-theme-hover px-2 py-0.5 text-[11px] font-medium text-theme-textLight">Running</span>
                  <time class="whitespace-nowrap text-xs text-theme-textLight" :datetime="item.updatedAt.toISOString()">{{ formatTime(item.updatedAt) }}</time>
                </span>
                <span class="w-full truncate text-sm text-theme-textLight">{{ preview(item) }}</span>
              </button>
              <button
                type="button"
                class="mr-3 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-theme-textLight hover:bg-red-50 hover:text-red-700 focus-visible:opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                :aria-label="`Delete chat ${item.title || 'New chat'}`"
                @click="deleteTarget = item"
              >
                <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3" /></svg>
              </button>
            </div>
          </div>

          <footer v-if="footer" class="flex items-center gap-2 border-t border-theme-border px-5 py-3 text-xs text-theme-textLight">
            <svg class="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z" /></svg>
            <span>{{ footer }}</span>
          </footer>
        </template>

        <template v-else>
          <header class="flex items-center gap-2 border-b border-theme-border py-3 pl-2 pr-4">
            <button type="button" class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-theme-text hover:bg-theme-hover" aria-label="All chats" @click="view = 'list'">
              <svg class="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6" /></svg>
            </button>
            <AssistantAvatar small />
            <h2 class="min-w-0 grow truncate text-[15px] font-semibold text-theme-text">{{ active.title || 'New chat' }}</h2>
            <button
              type="button"
              class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-theme-textLight hover:bg-red-50 hover:text-red-700"
              :aria-label="`Delete chat ${active.title || 'New chat'}`"
              @click="deleteTarget = active"
            >
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3" /></svg>
            </button>
            <button type="button" class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-theme-textLight hover:bg-theme-hover" aria-label="Close assistant" @click="open = false">
              <svg class="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
            </button>
          </header>

          <div ref="threadRef" class="flex grow flex-col gap-3 overflow-y-auto px-5 py-4" aria-live="polite">
            <div class="flex max-w-[88%] items-end gap-2 self-start">
              <AssistantAvatar small />
              <div v-if="typedGreeting" class="whitespace-pre-wrap rounded-2xl rounded-bl-md bg-theme-hover px-4 py-2.5 text-sm leading-relaxed text-theme-text">
                <span class="sr-only">{{ greeting }}</span>
                <span aria-hidden="true">{{ typedGreeting }}</span>
              </div>
              <div v-else class="flex items-center gap-1 rounded-2xl rounded-bl-md bg-theme-hover px-4 py-3.5" aria-hidden="true">
                <span v-for="dot in 3" :key="dot" class="h-1.5 w-1.5 animate-bounce rounded-full bg-theme-textLight motion-reduce:animate-none" :style="{ animationDelay: `${(dot - 1) * 150}ms` }"></span>
              </div>
            </div>

            <Transition
              enter-active-class="transition duration-200 ease-out motion-reduce:transition-none"
              enter-from-class="translate-y-2 opacity-0"
            >
              <div v-if="!active.messages.length && typedGreeting === greeting" class="flex flex-wrap justify-center gap-2">
                <button
                  v-for="suggestion in suggestions"
                  :key="suggestion"
                  type="button"
                  class="rounded-full border border-theme-border bg-white px-3.5 py-1.5 text-sm text-theme-text transition-colors hover:border-theme-textLight hover:bg-theme-hover"
                  @click="useSuggestion(suggestion)"
                >
                  {{ suggestion }}
                </button>
              </div>
            </Transition>

            <template v-for="message in active.messages" :key="message.id">
              <div v-if="message.kind === 'user'" class="max-w-[80%] self-end whitespace-pre-wrap rounded-2xl rounded-br-md bg-[var(--btn-primary-bg)] px-4 py-2.5 text-sm leading-relaxed text-white">{{ message.content }}</div>

              <div v-else class="flex max-w-[88%] items-end gap-2 self-start">
                <AssistantAvatar small />
                <!-- renderMarkdown escapes HTML and drops unsafe links -->
                <div class="markdown-content assistant-markdown min-w-0 rounded-2xl rounded-bl-md bg-theme-hover px-4 py-2.5 text-sm text-theme-text" v-html="renderMarkdown(message.content)"></div>
              </div>
            </template>

            <div v-if="active.status === 'running'" class="flex max-w-[88%] items-end gap-2 self-start">
              <AssistantAvatar small />
              <div v-if="streamed" class="markdown-content assistant-markdown min-w-0 rounded-2xl rounded-bl-md bg-theme-hover px-4 py-2.5 text-sm text-theme-text" v-html="renderMarkdown(streamed)"></div>
              <div v-else class="flex items-center gap-1 rounded-2xl rounded-bl-md bg-theme-hover px-4 py-3.5" role="status">
                <span class="sr-only">Thinking…</span>
                <span v-for="dot in 3" :key="dot" class="h-1.5 w-1.5 animate-bounce rounded-full bg-theme-textLight motion-reduce:animate-none" :style="{ animationDelay: `${(dot - 1) * 150}ms` }"></span>
              </div>
            </div>

            <p v-if="active.status === 'failed'" class="self-start rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-[13px] text-red-800">
              The assistant could not answer. Try again.
            </p>
          </div>

          <form class="m-3 mt-0 flex items-end gap-2 rounded-2xl border border-theme-border bg-white p-1.5 pl-3 focus-within:border-theme-textLight" @submit.prevent="send">
            <label for="assistant-input" class="sr-only">Message</label>
            <textarea
              id="assistant-input"
              ref="inputRef"
              v-model="draft"
              rows="2"
              required
              maxlength="4000"
              class="max-h-32 grow resize-none border-0 bg-transparent py-2 text-sm leading-snug text-theme-text placeholder:text-theme-textLight focus:outline-none"
              :placeholder="placeholder"
              @keydown.enter.exact.prevent="$event.target.form.requestSubmit()"
            ></textarea>
            <button type="submit" class="btn-primary inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl p-0" :disabled="active.status === 'running'" aria-label="Send">
              <svg class="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </button>
          </form>
        </template>
      </section>
    </Transition>

    <Modal :model-value="!!deleteTarget" title="Delete chat" size="sm" @update:model-value="deleteTarget = null">
      <p class="text-sm text-theme-textLight">Delete "{{ deleteTarget?.title || 'New chat' }}" and all its messages? This cannot be undone.</p>
      <template #footer>
        <button type="button" class="btn-secondary" @click="deleteTarget = null">Cancel</button>
        <button type="button" class="btn-danger" @click="deleteChat">Delete</button>
      </template>
    </Modal>

    <button
      type="button"
      class="fixed bottom-6 right-4 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[var(--btn-primary-bg)] text-white shadow-[0_4px_20px_rgba(0,0,0,0.2)] transition-transform duration-200 hover:scale-105 hover:bg-[var(--btn-primary-hover)] active:scale-95 motion-reduce:transition-none sm:right-6"
      :aria-label="open ? 'Close assistant' : 'Open assistant'"
      :aria-expanded="open"
      @click="open = !open"
    >
      <Transition
        mode="out-in"
        enter-active-class="transition duration-150 ease-out motion-reduce:transition-none"
        enter-from-class="rotate-[-90deg] scale-50 opacity-0"
        leave-active-class="transition duration-100 ease-in motion-reduce:transition-none"
        leave-to-class="rotate-90 scale-50 opacity-0"
      >
        <svg v-if="open" key="close" class="h-[22px] w-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
        <svg v-else key="open" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" /></svg>
      </Transition>
    </button>
  </div>
</template>

<script setup>
import { nextTick, onBeforeUnmount, ref } from 'vue'
import AssistantAvatar from '@/components/AssistantAvatar.vue'
import Modal from '@/components/Modal.vue'
import { plainText, renderMarkdown } from '@/lib/markdown'
import { playReply, playSend } from '@/lib/sound'

const props = defineProps({
  // Streams the answer: called as reply(question, history, onDelta) and resolves once the answer is complete.
  reply: { type: Function, required: true },
  title: { type: String, default: 'Assistant' },
  subtitle: { type: String, default: 'Ask about your workspace' },
  greeting: { type: String, default: "Hi there 👋 I'm your assistant. Ask me anything about this workspace." },
  suggestions: { type: Array, default: () => [] },
  placeholder: { type: String, default: 'Ask a question…' },
  footer: { type: String, default: '' },
})

const GREETING_DOTS_MS = 400
const GREETING_LETTER_MS = 10

const open = ref(false)
const view = ref('list')
const chats = ref([])
const active = ref(null)
const draft = ref('')
const streamed = ref('')
const typedGreeting = ref('')
const deleteTarget = ref(null)
const threadRef = ref(null)
const inputRef = ref(null)

let nextId = 1
let greetingTimer = null

function newChat() {
  const chat = { id: nextId++, title: '', status: 'idle', messages: [], updatedAt: new Date() }
  chats.value.unshift(chat)
  openChat(chat)
}

function openChat(chat) {
  active.value = chat
  view.value = 'thread'
  greet(!chat.messages.length)
  scrollToEnd()
  nextTick(() => inputRef.value?.focus())
}

// Types the greeting out letter by letter on a new chat; chats with messages and reduced motion show it at once.
function greet(animate) {
  clearTimeout(greetingTimer)

  if (!animate || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    typedGreeting.value = props.greeting
    return
  }

  typedGreeting.value = ''
  const letters = Array.from(props.greeting)
  let typed = 0

  greetingTimer = setTimeout(function typeNext() {
    typed++
    typedGreeting.value = letters.slice(0, typed).join('')
    if (typed < letters.length) greetingTimer = setTimeout(typeNext, GREETING_LETTER_MS)
  }, GREETING_DOTS_MS)
}

// Streams the answer into the thread as it is written, then keeps it as the chat's newest message.
async function send() {
  const chat = active.value
  const question = draft.value.trim()

  playSend()
  draft.value = ''
  streamed.value = ''
  chat.messages.push({ id: nextId++, kind: 'user', content: question })
  chat.title ||= question.slice(0, 60)
  chat.status = 'running'
  chat.updatedAt = new Date()
  scrollToEnd()

  try {
    await props.reply(question, chat.messages, (delta) => {
      if (!streamed.value) playReply()
      streamed.value += delta
      scrollToEnd()
    })

    chat.messages.push({ id: nextId++, kind: 'assistant', content: streamed.value.trim() })
    chat.status = 'idle'
  } catch {
    chat.status = 'failed'
  } finally {
    streamed.value = ''
    chat.updatedAt = new Date()
    scrollToEnd()
  }
}

function deleteChat() {
  const id = deleteTarget.value.id
  chats.value = chats.value.filter((item) => item.id !== id)
  deleteTarget.value = null
  if (active.value?.id === id) view.value = 'list'
}

function useSuggestion(suggestion) {
  draft.value = suggestion
  inputRef.value?.focus()
}

function preview(chat) {
  const last = chat.messages[chat.messages.length - 1]
  return last ? plainText(last.content) : 'No messages yet'
}

function formatTime(date) {
  const minutes = Math.floor((Date.now() - date.getTime()) / 60000)
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function scrollToEnd() {
  nextTick(() => {
    if (threadRef.value) threadRef.value.scrollTop = threadRef.value.scrollHeight
  })
}

onBeforeUnmount(() => clearTimeout(greetingTimer))

defineExpose({
  show: () => (open.value = true),
})
</script>
