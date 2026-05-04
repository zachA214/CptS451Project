import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Homepage from './pages/Homepage'
import AdminDash from './pages/AdminDash'
import AdAddCategory from './pages/AdAddCategory'
import Wishlist from './pages/Wishlist'
import Products from './pages/Products'
import AdAddProducts from './pages/AdAddProducts'
import Search from './pages/Search'
import Cart from './pages/Cart'
import Login from './pages/Login'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Homepage/> },   // Main hompage todo once created
      { path: '/admin', element: <AdminDash/>}, //Once auth available, run auth first then set true
      {path: '/admin/categories', element: <AdAddCategory/>},
      { path: '/wishlist', element: <Wishlist/> },
      { path: '/products', element: <Products/> },
      { path: '/search', element: <Search/> },
      { path: '/cart', element: <Cart/> },
      {path: '/admin/products', element: <AdAddProducts/>},
      {path: '/login', element: <Login/>}
    ],
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <App /> */}
    <RouterProvider router={router} />
  </StrictMode>,
)
