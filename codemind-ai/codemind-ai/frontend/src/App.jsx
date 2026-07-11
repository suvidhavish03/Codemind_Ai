import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import GeneratorPage from './pages/GeneratorPage'
import ChatPage from './pages/ChatPage'
import DebuggerPage from './pages/DebuggerPage'
import ConverterPage from './pages/ConverterPage'
import ComplexityPage from './pages/ComplexityPage'

export default function App() {
  const [activePage, setActivePage] = useState('generator')

  const pages = {
    generator: <GeneratorPage />,
    chat: <ChatPage />,
    debugger: <DebuggerPage />,
    converter: <ConverterPage />,
    complexity: <ComplexityPage />
  }

  return (
    <div className="app">
      <div className="bg-grid" />
      <div className="bg-glow" />
      <Navbar activePage={activePage} setActivePage={setActivePage} />
      <main className="main-content">
        {pages[activePage]}
      </main>
    </div>
  )
}
