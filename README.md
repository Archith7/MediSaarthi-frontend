# LabAssist AI - Professional React Frontend

Modern, professional React application for medical lab analytics with real-time data visualization and AI-powered query interface.

## 🎨 Features

- **Modern Dashboard** with real-time statistics and interactive charts
- **AI Chat Interface** for natural language queries
- **Drag & Drop Upload** for lab report images
- **Patient Management** with detailed test history
- **Responsive Design** with Tailwind CSS
- **Professional UI** with smooth animations and gradients

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- Backend API running on `http://127.0.0.1:8001`

### Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/        # Reusable components
│   │   └── Sidebar.jsx   # Navigation sidebar
│   ├── pages/            # Page components
│   │   ├── Dashboard.jsx      # Analytics dashboard
│   │   ├── ChatInterface.jsx  # AI query chat
│   │   ├── UploadReports.jsx  # Image upload
│   │   └── Patients.jsx       # Patient records
│   ├── context/          # React context
│   │   └── ApiContext.jsx     # API integration
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## 🎨 Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Utility-first styling
- **Recharts** - Data visualization
- **Lucide React** - Modern icon library
- **Axios** - HTTP client
- **React Router** - Navigation
- **date-fns** - Date formatting

## 🌈 Design System

### Colors
- Primary: Blue gradient (`#0ea5e9` to `#0284c7`)
- Background: Dark slate (`#0f172a`, `#1e293b`)
- Accent: Purple, Pink, Emerald gradients

### Components
- Cards with hover effects
- Gradient buttons with animations
- Glass morphism elements
- Smooth transitions

## 🔌 API Integration

The frontend connects to the backend API with automatic proxying configured in `vite.config.js`:

- API Base: `/api`
- Health Check: `/health`

All API calls are handled through the `ApiContext` provider.

## 🖥️ Available Pages

### Dashboard (`/`)
- Statistics cards (patients, tests, abnormal results)
- Test distribution pie chart
- Abnormal results bar chart
- Recent activity feed

### Query Chat (`/chat`)
- Natural language interface
- AI-powered responses
- Suggestion chips
- Message history

### Upload Reports (`/upload`)
- Drag & drop zone
- Image preview
- Progress tracking
- Upload results

### Patients (`/patients`)
- Searchable patient table
- Detailed patient view modal
- Test history timeline
- Status indicators

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1920px+)
- Laptop (1024px+)
- Tablet (768px+)
- Mobile (320px+)

## 🎯 Development Tips

### Hot Module Replacement
Vite provides instant HMR for fast development.

### Code Organization
- Keep components small and focused
- Use custom hooks for complex logic
- Leverage Tailwind's utility classes

### API Proxy
Development server proxies API requests to avoid CORS issues.

## 📦 Build Output

Production build creates optimized files in `dist/`:
- Minified JavaScript
- Optimized CSS
- Asset compression
- Code splitting

## 🔧 Configuration

### Tailwind
Customize colors, spacing, and animations in `tailwind.config.js`

### Vite
Adjust build settings and proxy in `vite.config.js`

## 🎨 Customization

To change the color scheme:
1. Update `tailwind.config.js` primary colors
2. Modify gradient classes in components
3. Adjust chart colors in Dashboard

## 📄 License

MIT License - See LICENSE file for details
