<template>
  <div class="min-h-screen bg-theme-bg">
    <NavBar />

    <main class="w-full py-8 px-6 lg:px-8">
      <div class="page-header">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="page-title">Calendar</h1>
            <p class="page-subtitle">View and manage your events</p>
          </div>
          <button @click="openAddEventModal" class="btn-primary">
            <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Event
          </button>
        </div>
      </div>

      <!-- Calendar Navigation -->
      <div class="mb-6">
        <div class="card">
          <div class="flex items-center justify-between">
            <button
              @click="previousMonth"
              class="p-2 text-theme-textLight hover:text-theme-text hover:bg-theme-hover rounded transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div class="text-center">
              <h2 class="text-xl font-semibold text-theme-text">{{ currentMonthYear }}</h2>
            </div>
            <button
              @click="nextMonth"
              class="p-2 text-theme-textLight hover:text-theme-text hover:bg-theme-hover rounded transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Calendar Grid -->
      <div class="card">
        <!-- Day Headers -->
        <div class="grid grid-cols-7 gap-px bg-theme-border border border-theme-border rounded-t-lg overflow-hidden">
          <div
            v-for="day in dayNames"
            :key="day"
            class="bg-theme-hover py-2 px-2 text-center text-xs font-semibold text-theme-text"
          >
            {{ day }}
          </div>
        </div>

        <!-- Calendar Days -->
        <div class="grid grid-cols-7 gap-px bg-theme-border border-x border-b border-theme-border rounded-b-lg overflow-hidden">
          <div
            v-for="(day, index) in calendarDays"
            :key="index"
            class="bg-white min-h-[100px] p-2 cursor-pointer hover:bg-theme-hover transition-colors"
            :class="{
              'bg-theme-bg': !day.isCurrentMonth,
              'border-2 border-theme-text': day.isToday
            }"
            @click="openDayView(day.date)"
          >
            <div class="flex items-center justify-between mb-1">
              <span
                class="text-sm font-medium"
                :class="{
                  'text-theme-text': day.isCurrentMonth,
                  'text-theme-textLight': !day.isCurrentMonth,
                  'text-blue-600 font-semibold': day.isToday
                }"
              >
                {{ day.day }}
              </span>
            </div>
            <div class="space-y-1">
              <div
                v-for="event in getEventsForDay(day.date)"
                :key="event.id"
                class="text-xs px-1.5 py-0.5 rounded truncate"
                :class="getEventColorClass(event.color)"
                @click.stop="openEditEventModal(event)"
              >
                {{ event.title }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Selected Day Events -->
      <div v-if="selectedDate" class="mt-6">
        <div class="card">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-theme-text">
              Events for {{ formatSelectedDate(selectedDate) }}
            </h3>
            <button
              @click="selectedDate = null"
              class="text-theme-textLight hover:text-theme-text transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div v-if="getEventsForDay(selectedDate).length === 0" class="text-sm text-theme-textLight py-4">
            No events scheduled for this day
          </div>
          <div v-else class="space-y-2">
            <div
              v-for="event in getEventsForDay(selectedDate)"
              :key="event.id"
              class="flex items-start justify-between p-3 rounded border border-theme-border hover:bg-theme-hover transition-colors"
            >
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <div
                    class="w-3 h-3 rounded-full"
                    :class="getEventColorClass(event.color)"
                  ></div>
                  <h4 class="text-sm font-semibold text-theme-text">{{ event.title }}</h4>
                </div>
                <p v-if="event.description" class="text-xs text-theme-textLight mt-1">
                  {{ event.description }}
                </p>
                <p class="text-xs text-theme-textLight mt-1">
                  {{ formatEventTime(event.startTime, event.endTime) }}
                </p>
              </div>
              <div class="flex items-center gap-2">
                <button
                  @click="openEditEventModal(event)"
                  class="p-1.5 text-theme-textLight hover:text-theme-text hover:bg-white rounded transition-colors"
                  title="Edit event"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  @click="openDeleteEventModal(event)"
                  class="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                  title="Delete event"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Add/Edit Event Modal -->
      <Modal
        v-model="showEventModal"
        :title="isEditing ? 'Edit Event' : 'Add New Event'"
        size="md"
      >
        <form @submit.prevent="saveEvent" class="space-y-4">
          <div>
            <label for="event-title" class="form-label">Title</label>
            <input
              id="event-title"
              v-model="eventForm.title"
              type="text"
              required
              class="input-field"
              placeholder="Enter event title"
            >
          </div>

          <div>
            <label for="event-description" class="form-label">Description</label>
            <textarea
              id="event-description"
              v-model="eventForm.description"
              class="input-field"
              rows="3"
              placeholder="Enter event description (optional)"
            ></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="event-date" class="form-label">Date</label>
              <input
                id="event-date"
                v-model="eventForm.date"
                type="date"
                required
                class="input-field"
              >
            </div>
            <div>
              <label for="event-color" class="form-label">Color</label>
              <select
                id="event-color"
                v-model="eventForm.color"
                required
                class="input-field"
              >
                <option value="blue">Blue</option>
                <option value="green">Green</option>
                <option value="red">Red</option>
                <option value="yellow">Yellow</option>
                <option value="purple">Purple</option>
                <option value="orange">Orange</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="event-start-time" class="form-label">Start Time</label>
              <input
                id="event-start-time"
                v-model="eventForm.startTime"
                type="time"
                required
                class="input-field"
              >
            </div>
            <div>
              <label for="event-end-time" class="form-label">End Time</label>
              <input
                id="event-end-time"
                v-model="eventForm.endTime"
                type="time"
                required
                class="input-field"
              >
            </div>
          </div>

          <div v-if="error" class="alert-error">
            <p class="alert-text-error">{{ error }}</p>
          </div>
        </form>

        <template #footer>
          <button @click="showEventModal = false" class="btn-secondary">
            Cancel
          </button>
          <button @click="saveEvent" class="btn-primary" :disabled="saving">
            <span v-if="!saving">{{ isEditing ? 'Update' : 'Create' }}</span>
            <span v-else class="flex items-center">
              <svg class="spinner -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Saving...
            </span>
          </button>
        </template>
      </Modal>

      <!-- Delete Event Modal -->
      <Modal
        v-model="showDeleteModal"
        title="Delete Event"
        size="sm"
      >
        <div class="space-y-4">
          <p class="text-sm text-theme-text">
            Are you sure you want to delete <strong>{{ eventToDelete?.title }}</strong>?
          </p>
          <p class="text-sm text-theme-textLight">
            This action cannot be undone.
          </p>
        </div>

        <template #footer>
          <button @click="showDeleteModal = false" class="btn-secondary">
            Cancel
          </button>
          <button @click="confirmDeleteEvent" class="btn-danger" :disabled="deleting">
            <span v-if="!deleting">Delete</span>
            <span v-else class="flex items-center">
              <svg class="spinner -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Deleting...
            </span>
          </button>
        </template>
      </Modal>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import NavBar from '../components/NavBar.vue'
import Modal from '../components/Modal.vue'

// State
const currentDate = ref(new Date())
const events = ref([])
const selectedDate = ref(null)
const showEventModal = ref(false)
const showDeleteModal = ref(false)
const isEditing = ref(false)
const saving = ref(false)
const deleting = ref(false)
const error = ref(null)
const eventToDelete = ref(null)

const eventForm = reactive({
  id: null,
  title: '',
  description: '',
  date: '',
  startTime: '',
  endTime: '',
  color: 'blue'
})

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// Computed
const currentMonthYear = computed(() => {
  return currentDate.value.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  })
})

const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()

  // First day of the month
  const firstDay = new Date(year, month, 1)
  const firstDayOfWeek = firstDay.getDay()

  // Last day of the month
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()

  // Previous month's last days
  const prevMonthLastDay = new Date(year, month, 0).getDate()

  const days = []

  // Previous month's days
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const date = new Date(year, month - 1, prevMonthLastDay - i)
    days.push({
      day: prevMonthLastDay - i,
      date: formatDateForComparison(date),
      isCurrentMonth: false,
      isToday: false
    })
  }

  // Current month's days
  const today = new Date()
  const todayStr = formatDateForComparison(today)

  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i)
    const dateStr = formatDateForComparison(date)
    days.push({
      day: i,
      date: dateStr,
      isCurrentMonth: true,
      isToday: dateStr === todayStr
    })
  }

  // Next month's days to fill the grid
  const remainingDays = 42 - days.length // 6 rows × 7 days
  for (let i = 1; i <= remainingDays; i++) {
    const date = new Date(year, month + 1, i)
    days.push({
      day: i,
      date: formatDateForComparison(date),
      isCurrentMonth: false,
      isToday: false
    })
  }

  return days
})

// Methods
const formatDateForComparison = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const formatSelectedDate = (dateStr) => {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatEventTime = (startTime, endTime) => {
  if (!startTime || !endTime) return ''
  return `${formatTime(startTime)} - ${formatTime(endTime)}`
}

const formatTime = (time) => {
  if (!time) return ''
  const [hours, minutes] = time.split(':')
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12
  return `${displayHour}:${minutes} ${ampm}`
}

const getEventsForDay = (dateStr) => {
  return events.value.filter(event => event.date === dateStr)
}

const getEventColorClass = (color) => {
  const classes = {
    blue: 'bg-blue-100 text-blue-800 border-blue-200',
    green: 'bg-green-100 text-green-800 border-green-200',
    red: 'bg-red-100 text-red-800 border-red-200',
    yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    purple: 'bg-purple-100 text-purple-800 border-purple-200',
    orange: 'bg-orange-100 text-orange-800 border-orange-200'
  }
  return classes[color] || classes.blue
}

const previousMonth = () => {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() - 1,
    1
  )
}

const nextMonth = () => {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() + 1,
    1
  )
}

const openDayView = (dateStr) => {
  selectedDate.value = dateStr
}

const openAddEventModal = () => {
  isEditing.value = false
  resetForm()
  error.value = null
  if (selectedDate.value) {
    eventForm.date = selectedDate.value
  } else {
    const today = new Date()
    eventForm.date = formatDateForComparison(today)
  }
  eventForm.startTime = '09:00'
  eventForm.endTime = '10:00'
  showEventModal.value = true
}

const openEditEventModal = (event) => {
  isEditing.value = true
  eventForm.id = event.id
  eventForm.title = event.title
  eventForm.description = event.description || ''
  eventForm.date = event.date
  eventForm.startTime = event.startTime
  eventForm.endTime = event.endTime
  eventForm.color = event.color
  error.value = null
  showEventModal.value = true
}

const openDeleteEventModal = (event) => {
  eventToDelete.value = event
  showDeleteModal.value = true
}

const resetForm = () => {
  eventForm.id = null
  eventForm.title = ''
  eventForm.description = ''
  eventForm.date = ''
  eventForm.startTime = ''
  eventForm.endTime = ''
  eventForm.color = 'blue'
}

const saveEvent = async () => {
  saving.value = true
  error.value = null

  try {
    // Validate end time is after start time
    if (eventForm.startTime >= eventForm.endTime) {
      error.value = 'End time must be after start time'
      saving.value = false
      return
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))

    if (isEditing.value) {
      // Update existing event
      const index = events.value.findIndex(e => e.id === eventForm.id)
      if (index !== -1) {
        events.value[index] = {
          ...events.value[index],
          title: eventForm.title,
          description: eventForm.description,
          date: eventForm.date,
          startTime: eventForm.startTime,
          endTime: eventForm.endTime,
          color: eventForm.color
        }
      }
    } else {
      // Create new event
      const newEvent = {
        id: Date.now().toString(),
        title: eventForm.title,
        description: eventForm.description,
        date: eventForm.date,
        startTime: eventForm.startTime,
        endTime: eventForm.endTime,
        color: eventForm.color
      }
      events.value.push(newEvent)
    }

    // Save to localStorage
    localStorage.setItem('calendarEvents', JSON.stringify(events.value))

    showEventModal.value = false
    resetForm()
  } catch (err) {
    error.value = err.message || 'Failed to save event'
  } finally {
    saving.value = false
  }
}

const confirmDeleteEvent = async () => {
  if (!eventToDelete.value) return

  deleting.value = true

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))

    events.value = events.value.filter(e => e.id !== eventToDelete.value.id)

    // Save to localStorage
    localStorage.setItem('calendarEvents', JSON.stringify(events.value))

    showDeleteModal.value = false
    eventToDelete.value = null
  } catch (err) {
    error.value = err.message || 'Failed to delete event'
  } finally {
    deleting.value = false
  }
}

// Initialize
onMounted(() => {
  // Load events from localStorage
  const storedEvents = localStorage.getItem('calendarEvents')
  if (storedEvents) {
    events.value = JSON.parse(storedEvents)
  } else {
    // Default events for demonstration
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const nextWeek = new Date(today)
    nextWeek.setDate(nextWeek.getDate() + 7)

    events.value = [
      {
        id: '1',
        title: 'Team Meeting',
        description: 'Weekly team sync',
        date: formatDateForComparison(today),
        startTime: '10:00',
        endTime: '11:00',
        color: 'blue'
      },
      {
        id: '2',
        title: 'Project Review',
        description: 'Review Q1 project status',
        date: formatDateForComparison(tomorrow),
        startTime: '14:00',
        endTime: '15:30',
        color: 'green'
      },
      {
        id: '3',
        title: 'Client Call',
        description: 'Discuss new requirements',
        date: formatDateForComparison(nextWeek),
        startTime: '09:00',
        endTime: '10:00',
        color: 'purple'
      }
    ]
    localStorage.setItem('calendarEvents', JSON.stringify(events.value))
  }
})
</script>

<style scoped>
textarea.input-field {
  resize: vertical;
  min-height: 80px;
}
</style>

