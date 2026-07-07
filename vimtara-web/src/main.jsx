import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// 1. Import the Provider and your Redux store
import { Provider } from 'react-redux'
import { store } from './store/store.js' // Adjust this path if you named the folder differently

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* 2. Wrap App with the Provider */}
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)