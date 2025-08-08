import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './styles.css'
import App from './pages/App.jsx'
import Inventory from './pages/Inventory.jsx'
import Model from './pages/Model.jsx'
import BuildPrice from './pages/BuildPrice.jsx'
import UsedCalculator from './pages/UsedCalculator.jsx'
import Admin from './pages/Admin.jsx'

const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/inventory/:type', element: <Inventory /> }, // type = new|used
  { path: '/models/:id', element: <Model /> },
  { path: '/build-and-price/:id', element: <BuildPrice /> },
  { path: '/used-calculator', element: <UsedCalculator /> },
  { path: '/admin', element: <Admin /> },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
