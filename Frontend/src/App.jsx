import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './components/shared/Navbar'

const App = () => {
  return (
    <main className="flex flex-col min-h-screen">
      <Navbar/>
      <Outlet />
      </main>
  )
}

export default App