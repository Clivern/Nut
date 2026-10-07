// Deterministic mock telemetry so charts look the same on every reload.

export const SERVICES = ['api-gateway', 'checkout', 'auth', 'inventory', 'payments']

export const TIME_RANGES = [
  { id: '1h', label: 'Last hour', points: 60, stepMinutes: 1 },
  { id: '6h', label: 'Last 6 hours', points: 72, stepMinutes: 5 },
  { id: '24h', label: 'Last 24 hours', points: 96, stepMinutes: 15 },
  { id: '7d', label: 'Last 7 days', points: 84, stepMinutes: 120 },
]

export function createRandom(seed = 1) {
  let a = seed >>> 0
  return function random() {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function hashSeed(...parts) {
  const text = parts.join(':')
  let hash = 2166136261
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

// A smooth, wavy series around `base` with occasional spikes.
export function generateSeries(points, { base = 100, amplitude = 0.2, noise = 0.08, spikes = 0, seed = 1, min = 0 } = {}) {
  const random = createRandom(seed)
  const phase = random() * Math.PI * 2
  const values = []
  let drift = 0
  for (let i = 0; i < points; i++) {
    drift = drift * 0.8 + (random() - 0.5) * noise
    let value = base * (1 + amplitude * Math.sin(phase + (i / points) * Math.PI * 2) + drift)
    if (spikes && random() < spikes) value *= 1.6 + random()
    values.push(Math.max(min, +value.toFixed(2)))
  }
  return values
}

export function timeLabels(range, now = new Date()) {
  const labels = []
  for (let i = range.points - 1; i >= 0; i--) {
    const date = new Date(now.getTime() - i * range.stepMinutes * 60000)
    labels.push(
      range.stepMinutes >= 120
        ? date.toLocaleString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' })
        : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    )
  }
  return labels
}

const OPERATIONS = {
  'api-gateway': ['GET /api/products', 'POST /api/checkout', 'GET /api/cart', 'POST /api/login', 'GET /api/orders'],
  checkout: ['CreateOrder', 'ValidateCart', 'ApplyDiscount'],
  auth: ['VerifyToken', 'LoadSession', 'CheckPermissions'],
  inventory: ['ReserveStock', 'GetAvailability', 'SELECT products'],
  payments: ['AuthorizeCard', 'CapturePayment', 'FraudCheck'],
}

const CHILDREN = {
  'GET /api/products': [['auth', 'VerifyToken'], ['inventory', 'GetAvailability'], ['inventory', 'SELECT products']],
  'POST /api/checkout': [['auth', 'VerifyToken'], ['checkout', 'CreateOrder']],
  'GET /api/cart': [['auth', 'LoadSession'], ['checkout', 'ValidateCart']],
  'POST /api/login': [['auth', 'LoadSession'], ['auth', 'CheckPermissions']],
  'GET /api/orders': [['auth', 'VerifyToken'], ['checkout', 'ValidateCart']],
  CreateOrder: [['checkout', 'ValidateCart'], ['inventory', 'ReserveStock'], ['payments', 'AuthorizeCard']],
  ValidateCart: [['checkout', 'ApplyDiscount'], ['inventory', 'GetAvailability']],
  AuthorizeCard: [['payments', 'FraudCheck'], ['payments', 'CapturePayment']],
  ReserveStock: [['inventory', 'SELECT products']],
  VerifyToken: [['auth', 'CheckPermissions']],
}

function buildSpans(random, traceId, service, name, start, budget, depth, parentId, spans, forceError) {
  const id = `${traceId.slice(0, 8)}${spans.length.toString(16).padStart(8, '0')}`
  const span = {
    id,
    parentId,
    service,
    name,
    start,
    duration: budget,
    depth,
    status: 'ok',
    attributes: {
      'service.name': service,
      'span.kind': depth === 0 ? 'server' : 'internal',
    },
  }
  if (name.startsWith('GET') || name.startsWith('POST')) {
    const [method, route] = name.split(' ')
    span.attributes['http.method'] = method
    span.attributes['http.route'] = route
    span.attributes['http.status_code'] = 200
  }
  if (name.startsWith('SELECT')) {
    span.attributes['db.system'] = 'postgresql'
    span.attributes['db.statement'] = 'SELECT * FROM products WHERE id = $1'
  }
  spans.push(span)

  const children = depth < 4 ? CHILDREN[name] || [] : []
  if (!children.length) return span

  let cursor = start + budget * (0.04 + random() * 0.06)
  const end = start + budget * 0.96
  const sequential = random() < 0.7
  children.forEach(([childService, childName], i) => {
    const remaining = end - cursor
    if (remaining <= 0.2) return
    const share = sequential ? remaining / (children.length - i) : remaining
    const duration = Math.max(0.2, share * (0.55 + random() * 0.4))
    buildSpans(random, traceId, childService, childName, cursor, duration, depth + 1, id, spans, false)
    if (sequential) cursor += duration + budget * 0.01
  })

  if (forceError) {
    const leaf = spans.filter((s) => s.parentId && !spans.some((c) => c.parentId === s.id))
    const failing = leaf[Math.floor(random() * leaf.length)] || span
    let node = failing
    while (node) {
      node.status = 'error'
      if (node === failing) {
        node.attributes['error.message'] = failing.service === 'payments' ? 'card_declined: issuer unavailable' : 'deadline exceeded after 2000ms'
      }
      if (node.attributes['http.status_code']) node.attributes['http.status_code'] = 502
      node = spans.find((s) => s.id === node.parentId)
    }
  }
  return span
}

export function generateTraces(count = 60, now = Date.now()) {
  const random = createRandom(42)
  const traces = []
  for (let i = 0; i < count; i++) {
    const traceId = Array.from({ length: 32 }, () => Math.floor(random() * 16).toString(16)).join('')
    const operation = OPERATIONS['api-gateway'][Math.floor(random() * OPERATIONS['api-gateway'].length)]
    const slow = random() < 0.12
    const duration = +(slow ? 400 + random() * 1600 : 20 + random() * 260).toFixed(1)
    const isError = random() < (slow ? 0.45 : 0.06)
    const spans = []
    buildSpans(random, traceId, 'api-gateway', operation, 0, duration, 0, null, spans, isError)
    traces.push({
      id: traceId,
      operation,
      service: 'api-gateway',
      startedAt: new Date(now - (count - i) * 55000 - Math.floor(random() * 40000)),
      duration,
      status: spans[0].status,
      spans,
      services: [...new Set(spans.map((s) => s.service))],
    })
  }
  return traces
}

let cachedTraces = null

export function getTraces() {
  if (!cachedTraces) cachedTraces = generateTraces()
  return cachedTraces
}

export function getTrace(id) {
  return getTraces().find((trace) => trace.id === id) || null
}
