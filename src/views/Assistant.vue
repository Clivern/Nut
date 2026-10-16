<template>
  <div class="min-h-screen bg-theme-bg">
    <NavBar />

    <main class="w-full py-8 px-6 lg:px-8">
      <div class="page-header">
        <h1 class="page-title">Assistant</h1>
        <p class="page-subtitle">A floating chat assistant with a typed greeting, streamed Markdown answers and saved chats</p>
      </div>

      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section class="card">
          <h2 class="text-lg font-semibold text-theme-text mb-2">Try it</h2>
          <p class="text-sm text-theme-textLight mb-4">
            The launcher sits in the bottom right corner of the page. This demo streams canned answers, so try a
            suggestion or ask about agents, health or the workspace.
          </p>
          <button type="button" class="btn-primary" @click="panel.show()">Open the assistant</button>

          <h3 class="text-sm font-semibold text-theme-text mt-6 mb-2">What it does</h3>
          <ul class="space-y-1.5 text-sm text-theme-textLight list-disc pl-5">
            <li>Opens from the launcher with a short scale and fade, and closes with Esc.</li>
            <li>Lists chats with their last message, and deletes them after a confirmation.</li>
            <li>Greets a new chat with typing dots, then types the greeting out, then shows the suggestions.</li>
            <li>Shows typing dots while waiting, then renders the answer as it streams in.</li>
            <li>Renders answers as Markdown, with raw HTML escaped, unsafe links dropped and images shown as their alt text.</li>
            <li>Plays a soft chime when a message is sent and when the answer starts.</li>
            <li>Follows the active theme and turns its animations off for reduced motion.</li>
          </ul>
        </section>

        <section class="card">
          <h2 class="text-lg font-semibold text-theme-text mb-2">Usage</h2>
          <p class="text-sm text-theme-textLight mb-3">
            Chats are kept in the component. Answers come from <code class="font-mono text-theme-text">reply</code>, which
            streams each piece of the answer to <code class="font-mono text-theme-text">onDelta</code> and resolves when it
            is done. A rejected promise marks the chat failed.
          </p>
          <pre class="overflow-x-auto rounded-md border border-theme-border bg-theme-bg p-3 text-xs font-mono text-theme-text">{{ usage }}</pre>

          <h3 class="text-sm font-semibold text-theme-text mt-6 mb-2">Props</h3>
          <dl class="space-y-2 text-sm">
            <div v-for="prop in props" :key="prop.name">
              <dt class="font-mono text-theme-text">{{ prop.name }}</dt>
              <dd class="text-theme-textLight">{{ prop.description }}</dd>
            </div>
          </dl>
        </section>
      </div>
    </main>

    <AssistantPanel
      ref="panel"
      :reply="reply"
      subtitle="Ask about your workspace"
      :greeting="greeting"
      :suggestions="['Which agents are registered?', 'Are any instances unhealthy?', 'Tell me about this workspace']"
      placeholder="Ask about agents, intentions or traffic…"
      footer="This demo streams canned answers."
    />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import NavBar from '@/components/NavBar.vue'
import AssistantPanel from '@/components/AssistantPanel.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const panel = ref(null)

const greeting = computed(() => {
  const name = authStore.user?.name?.split(' ')[0]
  return `Hi ${name || 'there'} 👋 I'm your assistant. Ask me anything about this workspace.`
})

const usage = `<AssistantPanel
  :reply="reply"
  greeting="Hi Ada 👋 How can I help?"
  :suggestions="['Which agents are registered?']"
/>

// Stream the answer from your API, e.g. server-sent events
async function reply(question, history, onDelta) {
  for await (const delta of streamAnswer(question)) {
    onDelta(delta)
  }
}`

const props = [
  { name: 'reply', description: 'Required. async (question, history, onDelta) => void; streams the answer to onDelta.' },
  { name: 'greeting', description: 'Typed out when a new chat opens.' },
  { name: 'suggestions', description: 'Quick replies shown under the greeting until the first message.' },
  { name: 'title / subtitle', description: 'Shown in the chat list header.' },
  { name: 'placeholder', description: 'Placeholder of the message box.' },
  { name: 'footer', description: 'A short note at the bottom of the chat list.' },
]

const answers = [
  {
    match: /agent|registered/i,
    text: 'You have **2 agents** registered:\n\n- `users` is **passing** on 2 instances\n- `weather` has 1 instance **critical** since 10:42\n\nCheck the `weather` health check first; its last output was `connection refused`.',
  },
  {
    match: /health|unhealthy|instance/i,
    text: 'One instance is unhealthy: `weather-9201` has been **critical** for 6 minutes. The other 3 instances are passing.\n\nIts `/healthz` probe returns `connection refused`, so the process is likely down.',
  },
  {
    match: /workspace|about/i,
    text: '**Acme** has 3 members and 2 agents.\n\n- Instances: 3 passing, 1 critical\n- Intentions: 2 allow, 1 deny\n- KV keys: 4\n- Gateway calls recorded: 1,284',
  },
]

// Streams a canned answer word by word after a short wait, like a model would.
async function reply(question, _history, onDelta) {
  const answer = answers.find((item) => item.match.test(question))?.text
    ?? `I can look up agents, instances, intentions and traffic in this workspace. Try asking which agents are registered.`

  await wait(900)

  for (const word of answer.split(/(?<= )/)) {
    onDelta(word)
    await wait(30)
  }
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
</script>
