import { BrowserRouter, Link, Navigate, Route, Routes, useLocation } from 'react-router'
import Home from './pages/Home.tsx'
import Visualizer from './pages/Visualizer.tsx'
import { Logo } from './components/Logo/Logo.tsx'
import { ThemeToggle } from './components/ThemeToggle/ThemeToggle.tsx'

function Nav() {
  const { pathname } = useLocation()
  const onHome = pathname === '/'
  return (
    <nav className="sticky top-0 z-50 flex h-14 items-center border-b border-border bg-background/80 px-6 backdrop-blur-sm">
      <div className="flex flex-1 items-center gap-6">
        <Link
          to="/"
          className="transition-opacity hover:opacity-75"
          aria-label="Sort Algorithms — home"
        >
          <Logo />
        </Link>
        {!onHome && (
          <Link
            to="/"
            className="text-sm text-text-muted transition-colors hover:text-text"
          >
            ← All algorithms
          </Link>
        )}
      </div>
      <ThemeToggle />
    </nav>
  )
}

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-dvh flex-col">
        <Nav />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/algorithm/:id" element={<Visualizer />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
