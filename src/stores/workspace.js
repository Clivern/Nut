import { ref, computed } from 'vue'

const STORAGE_KEY = 'workspaces'
const CURRENT_KEY = 'current_workspace'

const defaultWorkspaces = [
  {
    id: '1',
    name: 'Acme Inc',
    createdAt: '2026-01-15T00:00:00.000Z'
  },
  {
    id: '2',
    name: 'Personal',
    createdAt: '2026-03-02T00:00:00.000Z'
  }
]

const workspaces = ref([])
const current = ref(null)

let storeInstance = null

function loadFromStorage() {
  const stored = localStorage.getItem(STORAGE_KEY)
  workspaces.value = stored ? JSON.parse(stored) : defaultWorkspaces
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(workspaces.value))
  }

  const storedCurrent = localStorage.getItem(CURRENT_KEY)
  current.value = storedCurrent ? JSON.parse(storedCurrent) : null
}

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(workspaces.value))
  if (current.value) {
    localStorage.setItem(CURRENT_KEY, JSON.stringify(current.value))
  } else {
    localStorage.removeItem(CURRENT_KEY)
  }
}

export function useWorkspaceStore() {
  if (storeInstance) {
    return storeInstance
  }

  loadFromStorage()

  const select = (workspace) => {
    current.value = workspace
    persist()
  }

  const create = (name) => {
    const workspace = {
      id: Date.now().toString(),
      name: name.trim(),
      createdAt: new Date().toISOString()
    }
    workspaces.value = [workspace, ...workspaces.value]
    current.value = workspace
    persist()
    return workspace
  }

  storeInstance = {
    workspaces: computed(() => workspaces.value),
    current: computed(() => current.value),
    select,
    create
  }

  return storeInstance
}
