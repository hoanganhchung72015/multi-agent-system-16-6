import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

// Lệnh này tìm thẻ 'root' trong index.html và render App vào đó
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)