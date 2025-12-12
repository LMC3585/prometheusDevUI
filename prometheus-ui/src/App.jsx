/**
 * App.jsx - Main Application Component
 *
 * Prometheus 2.0 - Mockup 2.1 Implementation
 *
 * Navigation Flow:
 * 1. Login → Navigate (after authentication)
 * 2. Navigate → Any section via NavWheel
 * 3. Any section → Navigate via mini NavWheel
 *
 * Pages:
 * - Login: Authentication screen
 * - Navigate: Full NavWheel for section selection
 * - Define: Course information (Slide 3)
 * - Design: OutlinePlanner or Scalar (Slides 4-6)
 * - Build: Placeholder
 * - Format: Placeholder
 * - Generate: Placeholder
 *
 * SCALING:
 * - Base design: 1920×1080 (fixed inner stage)
 * - Viewport scaling via single transform on stage container
 * - Scale = Math.min(viewportW/1920, viewportH/1080)
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import './App.css'
import { THEME } from './constants/theme'

// ============================================
// SCALE-TO-FIT CONSTANTS
// ============================================
const BASE_W = 1920
const BASE_H = 1080

// Pages
import Login from './pages/Login'
import Navigate from './pages/Navigate'
import Define from './pages/Define'
import OutlinePlanner from './pages/OutlinePlanner'
import Scalar from './pages/Scalar'
import Build from './pages/Build'
import Format from './pages/Format'
import Generate from './pages/Generate'

// Components
import Header from './components/Header'
import DebugGrid from './components/DebugGrid'

/**
 * useScaleToFit - Hook for viewport scaling
 *
 * Returns a scale factor to fit 1920×1080 content into current viewport.
 * Uses debounced resize handling to prevent excessive recalculations.
 */
function useScaleToFit() {
  const [scale, setScale] = useState(1)
  const debounceRef = useRef(null)

  useEffect(() => {
    const calculateScale = () => {
      const vw = window.innerWidth
      const vh = window.innerHeight
      const newScale = Math.min(vw / BASE_W, vh / BASE_H)
      setScale(newScale)
    }

    const handleResize = () => {
      // Debounce: clear any pending calculation
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
      // Schedule new calculation after 100ms of no resize events
      debounceRef.current = setTimeout(calculateScale, 100)
    }

    // Calculate initial scale
    calculateScale()

    // Listen for resize events
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [])

  return scale
}

function App() {
  // Scale-to-fit hook (SINGLE source of viewport scaling)
  const scale = useScaleToFit()

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)

  // Navigation state
  const [currentPage, setCurrentPage] = useState('navigate')
  const [designSubpage, setDesignSubpage] = useState('planner') // 'planner' | 'scalar'

  // Debug grid state (Ctrl+G toggle)
  const [showDebugGrid, setShowDebugGrid] = useState(false)

  // Course data state
  const [courseData, setCourseData] = useState({
    title: '',
    thematic: '',
    module: 1,
    code: '',
    duration: 0,
    durationUnit: 'DAYS',
    level: 'FOUNDATIONAL',
    seniority: 'JUNIOR',
    description: '',
    deliveryModes: [],
    qualification: false,
    accredited: false,
    certified: false,
    learningObjectives: ['']
  })
  const [courseLoaded, setCourseLoaded] = useState(false)

  // Handle login
  const handleLogin = useCallback((userData) => {
    setCurrentUser(userData)
    setIsAuthenticated(true)
    setCurrentPage('navigate')
  }, [])

  // Handle navigation from NavWheel or other sources
  const handleNavigate = useCallback((section) => {
    // Map section IDs to pages
    switch (section) {
      case 'define':
        setCurrentPage('define')
        break
      case 'design':
        setCurrentPage('design')
        break
      case 'build':
        setCurrentPage('build')
        break
      case 'format':
        setCurrentPage('format')
        break
      case 'generate':
        setCurrentPage('generate')
        break
      case 'navigate':
        setCurrentPage('navigate')
        break
      default:
        setCurrentPage('navigate')
    }
  }, [])

  // Handle design sub-navigation (planner vs scalar)
  const handleDesignSubnav = useCallback((subpage) => {
    setDesignSubpage(subpage)
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+G: Toggle debug grid
      if (e.ctrlKey && e.code === 'KeyG') {
        e.preventDefault()
        setShowDebugGrid(prev => !prev)
      }
      // Ctrl+Space: Toggle to Navigate page
      if (e.ctrlKey && e.code === 'Space' && isAuthenticated) {
        e.preventDefault()
        setCurrentPage('navigate')
      }
      // Escape: Go to Navigate (from any page except login)
      if (e.code === 'Escape' && isAuthenticated && currentPage !== 'navigate') {
        setCurrentPage('navigate')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isAuthenticated, currentPage])

  // Render Login page (before authentication)
  if (!isAuthenticated) {
    return (
      <div
        style={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
          backgroundColor: THEME.BG_BASE
        }}
      >
        {/* ScaleToFit Stage Container - SINGLE transform applied here */}
        <div
          style={{
            width: `${BASE_W}px`,
            height: `${BASE_H}px`,
            flexShrink: 0,
            background: THEME.BG_BASE,
            position: 'relative',
            transform: `scale(${scale})`,
            transformOrigin: 'center center'
          }}
        >
          <Login onLogin={handleLogin} />
        </div>
        <DebugGrid isVisible={showDebugGrid} scale={scale} />
      </div>
    )
  }

  // Render Navigate page (full NavWheel)
  if (currentPage === 'navigate') {
    return (
      <div
        style={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
          backgroundColor: THEME.BG_BASE
        }}
      >
        {/* ScaleToFit Stage Container - SINGLE transform applied here */}
        <div
          style={{
            width: `${BASE_W}px`,
            height: `${BASE_H}px`,
            flexShrink: 0,
            background: THEME.BG_BASE,
            position: 'relative',
            transform: `scale(${scale})`,
            transformOrigin: 'center center'
          }}
        >
          <Navigate
            onNavigate={handleNavigate}
            courseData={courseData}
          />
        </div>
        <DebugGrid isVisible={showDebugGrid} scale={scale} />
      </div>
    )
  }

  // Render main application pages with header
  const renderPage = () => {
    switch (currentPage) {
      case 'define':
        return (
          <Define
            onNavigate={handleNavigate}
            courseData={courseData}
            setCourseData={setCourseData}
            courseLoaded={courseLoaded}
          />
        )
      case 'design':
        // Design has sub-pages: OutlinePlanner and Scalar
        if (designSubpage === 'planner') {
          return (
            <OutlinePlanner
              onNavigate={handleNavigate}
              courseData={courseData}
              courseLoaded={courseLoaded}
            />
          )
        } else {
          return (
            <Scalar
              onNavigate={handleNavigate}
              courseData={courseData}
              courseLoaded={courseLoaded}
            />
          )
        }
      case 'build':
        return (
          <Build
            onNavigate={handleNavigate}
            courseLoaded={courseLoaded}
          />
        )
      case 'format':
        return (
          <Format
            onNavigate={handleNavigate}
            courseLoaded={courseLoaded}
          />
        )
      case 'generate':
        return (
          <Generate
            onNavigate={handleNavigate}
            courseLoaded={courseLoaded}
          />
        )
      default:
        return (
          <Navigate
            onNavigate={handleNavigate}
            courseData={courseData}
          />
        )
    }
  }

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        backgroundColor: THEME.BG_BASE
      }}
    >
      {/* ScaleToFit Stage Container - SINGLE transform applied here */}
      <div
        style={{
          width: `${BASE_W}px`,
          height: `${BASE_H}px`,
          flexShrink: 0,
          background: THEME.BG_DARK,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          transform: `scale(${scale})`,
          transformOrigin: 'center center'
        }}
      >
        {/* Header */}
        <Header courseLoaded={courseLoaded} courseData={courseData} currentPage={currentPage} />

        {/* Horizontal gradient line below header */}
        <div
          style={{
            height: '1px',
            width: '100%',
            background: THEME.GRADIENT_LINE_TOP,
            flexShrink: 0
          }}
        />

        {/* Page Content */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {renderPage()}
        </div>

        {/* Design Sub-navigation (only on design page) */}
        {currentPage === 'design' && (
          <div
            style={{
              position: 'absolute',
              top: '100px',
              right: '40px',
              display: 'flex',
              gap: '12px',
              zIndex: 100
            }}
          >
            <button
              onClick={() => handleDesignSubnav('planner')}
              style={{
                padding: '12px 24px',
                fontSize: '11px',
                letterSpacing: '2px',
                fontFamily: THEME.FONT_PRIMARY,
                background: designSubpage === 'planner' ? 'rgba(212, 115, 12, 0.3)' : 'transparent',
                border: `1px solid ${designSubpage === 'planner' ? THEME.AMBER : THEME.BORDER_GREY}`,
                borderRadius: '4px',
                color: designSubpage === 'planner' ? THEME.AMBER : THEME.TEXT_SECONDARY,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => { if (designSubpage !== 'planner') e.target.style.color = THEME.AMBER }}
              onMouseLeave={(e) => { if (designSubpage !== 'planner') e.target.style.color = THEME.TEXT_SECONDARY }}
            >
              PLANNER
            </button>
            <button
              onClick={() => handleDesignSubnav('scalar')}
              style={{
                padding: '12px 24px',
                fontSize: '11px',
                letterSpacing: '2px',
                fontFamily: THEME.FONT_PRIMARY,
                background: designSubpage === 'scalar' ? 'rgba(212, 115, 12, 0.3)' : 'transparent',
                border: `1px solid ${designSubpage === 'scalar' ? THEME.AMBER : THEME.BORDER_GREY}`,
                borderRadius: '4px',
                color: designSubpage === 'scalar' ? THEME.AMBER : THEME.TEXT_SECONDARY,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => { if (designSubpage !== 'scalar') e.target.style.color = THEME.AMBER }}
              onMouseLeave={(e) => { if (designSubpage !== 'scalar') e.target.style.color = THEME.TEXT_SECONDARY }}
            >
              SCALAR
            </button>
          </div>
        )}
      </div>
      <DebugGrid isVisible={showDebugGrid} scale={scale} />
    </div>
  )
}

export default App
