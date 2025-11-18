# Nut Style Guide

A modern, reusable dashboard style guide built with Vue.js 3, featuring a Notion-inspired design system. Nut provides a comprehensive set of components and patterns for building beautiful, responsive web applications.

## ✨ Features

- 🎨 **Notion-Inspired Design** - Clean, modern UI with a familiar feel
- 📱 **Fully Responsive** - Mobile-first design that works on all devices
- 🧩 **Component Library** - Pre-built components ready to use
- 🎯 **Vue 3 Composition API** - Modern Vue.js patterns
- 🎨 **Tailwind CSS** - Utility-first CSS framework
- 🔐 **Authentication System** - Complete auth flow with stores
- 🧭 **Vue Router** - Client-side routing
- 📊 **Dashboard Components** - Stats, cards, forms, modals, and more

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd nut

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
# Build the project
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
nut/
├── src/
│   ├── components/          # Reusable Vue components
│   │   ├── Modal.vue       # Modal component
│   │   └── NavBar.vue      # Navigation bar component
│   ├── views/              # Page components
│   │   ├── Dashboard.vue   # Main dashboard page
│   │   ├── Profile.vue      # User profile page
│   │   ├── Subscription.vue # Subscription management
│   │   ├── CopilotChat.vue  # AI copilot chat interface
│   │   ├── Calendar.vue     # Calendar view
│   │   ├── Users.vue        # User management
│   │   ├── Form.vue         # Form examples
│   │   ├── Cards.vue        # Card components
│   │   ├── Modals.vue       # Modal examples
│   │   ├── Navigation.vue   # Navigation examples
│   │   ├── Home.vue         # Home page
│   │   ├── Login.vue        # Login page
│   │   ├── Signup.vue       # Signup page
│   │   └── ForgotPassword.vue # Password reset
│   ├── stores/             # State management
│   │   └── auth.js         # Authentication store
│   ├── router/             # Vue Router configuration
│   │   └── index.js        # Route definitions
│   ├── App.vue             # Root component
│   └── main.js             # Application entry point
├── index.html              # HTML template
├── style.css               # Global styles
├── tailwind.config.js      # Tailwind configuration
├── vite.config.js          # Vite configuration
└── package.json            # Dependencies and scripts
```

## 🎨 Components

### Navigation
- **NavBar** - Responsive navigation bar with mobile menu
- Mobile-friendly hamburger menu
- Active route highlighting
- User authentication state management

### Pages

#### Dashboard
- Stats cards with metrics
- Recent activity feed
- System information
- Quick actions panel

#### Profile
- Personal information management
- Security settings (password change)
- User preferences
- Account statistics

#### Subscription
- Plan comparison (Free, Pro, Enterprise)
- Billing history
- Payment method management
- Current plan display

#### Copilot Chat
- AI chat interface
- Message history
- Typing indicators
- Quick suggestions

#### Calendar
- Event management
- Calendar view
- Date navigation

#### Users
- User list management
- User details
- Permissions

### Forms
- Input fields
- Textareas
- Checkboxes
- Form validation examples

### Cards
- Stat cards
- Content cards
- Section cards
- Various card styles

### Modals
- Basic modals
- Confirmation dialogs
- Form modals
- Alert modals

## 🎨 Design System

### Colors

The design system uses a Notion-inspired color palette:

- **Background**: `#F7F6F3`
- **Text**: `#37352F`
- **Text Light**: `#6B6966`
- **Border**: `#E3E2E0`
- **Hover**: `#F1F0ED`

### Typography

- Clean, readable fonts
- Consistent sizing hierarchy
- Responsive text scaling

### Spacing

- Consistent spacing scale
- Responsive padding and margins
- Grid-based layouts

## 🔐 Authentication

The application includes a complete authentication system:

- Login/Logout functionality
- User registration
- Password reset flow
- Session management with localStorage
- Protected routes

### Using the Auth Store

```javascript
import { useAuthStore } from './stores/auth'

const authStore = useAuthStore()

// Login
await authStore.login(email, password, rememberMe)

// Signup
await authStore.signup(name, email, password, confirmPassword)

// Logout
authStore.logout()

// Check authentication status
const isAuthenticated = authStore.isAuthenticated
const user = authStore.user
```

## 🛣️ Routing

Routes are defined in `src/router/index.js`. Available routes:

- `/` - Home page
- `/dashboard` - Main dashboard
- `/profile` - User profile
- `/subscription` - Subscription management
- `/copilot` - AI Copilot Chat
- `/calendar` - Calendar view
- `/users` - User management
- `/form` - Form examples
- `/cards` - Card examples
- `/modals` - Modal examples
- `/navigation` - Navigation examples
- `/login` - Login page
- `/signup` - Signup page
- `/forgot-password` - Password reset

## 📱 Responsive Design

The application is fully responsive with breakpoints:

- **Mobile**: Default (< 768px)
- **Tablet**: `md` (≥ 768px)
- **Desktop**: `lg` (≥ 1024px)

## 🎯 Customization

### Tailwind Configuration

Customize colors, spacing, and other design tokens in `tailwind.config.js`:

```javascript
colors: {
  notion: {
    bg: '#F7F6F3',
    text: '#37352F',
    textLight: '#6B6966',
    border: '#E3E2E0',
    hover: '#F1F0ED',
  },
}
```

### Global Styles

Global styles and component classes are defined in `style.css`:

- Button styles (`.btn-primary`, `.btn-secondary`, `.btn-danger`)
- Input styles (`.input-field`)
- Card styles (`.card`, `.stat-card`)
- Navigation styles (`.nav-link`)
- Form styles (`.form-label`, `.form-group`)

## 🧪 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Development Server

The development server runs on `http://localhost:5173` by default. The server is configured to be accessible on all network interfaces (`0.0.0.0`), making it easy to test on mobile devices.

## 📦 Dependencies

### Core
- **Vue 3** - Progressive JavaScript framework
- **Vue Router** - Official router for Vue.js

### Build Tools
- **Vite** - Next generation frontend tooling
- **Tailwind CSS** - Utility-first CSS framework
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Design inspired by Notion
- Built with Vue.js and Tailwind CSS
- Icons from Heroicons

## 📞 Support

For questions or support, please open an issue in the repository.

---

Made with ❤️ using Vue.js and Tailwind CSS
