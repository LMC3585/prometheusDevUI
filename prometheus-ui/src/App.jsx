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
 */

import { useState, useEffect, useCallback } from 'react'
import './App.css'
import { THEME } from './constants/theme'
import { useViewportScale } from './hooks/useViewportScale'

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

function App() {
  // Viewport scaling for cross-device compatibility
  const viewportScale = useViewportScale()
  const isScaledDown = viewportScale < 1

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)

  // Navigation state
  const [currentPage, setCurrentPage] = useState('navigate')
  const [designSubpage, setDesignSubpage] = useState('planner') // 'planner' | 'scalar'

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
          alignItems: 'flex-start',
          overflow: 'hidden',
          backgroundColor: THEME.BG_BASE
        }}
      >
        <div
          style={{
            width: isScaledDown ? '1920px' : '100vw',
            height: isScaledDown ? '1080px' : '100vh',
            transform: isScaledDown ? `scale(${viewportScale})` : 'none',
            transformOrigin: 'top center',
            flexShrink: 0,
            background: THEME.BG_BASE
          }}
        >
          <Login onLogin={handleLogin} />
        </div>
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
          alignItems: 'flex-start',
          overflow: 'hidden',
          backgroundColor: THEME.BG_BASE
        }}
      >
        <div
          style={{
            width: isScaledDown ? '1920px' : '100vw',
            height: isScaledDown ? '1080px' : '100vh',
            transform: isScaledDown ? `scale(${viewportScale})` : 'none',
            transformOrigin: 'top center',
            flexShrink: 0,
            background: THEME.BG_BASE
          }}
        >
          <Navigate
            onNavigate={handleNavigate}
            courseData={courseData}
          />
        </div>
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
        alignItems: 'flex-start',
        overflow: 'hidden',
        backgroundColor: THEME.BG_BASE
      }}
    >
      <div
        style={{
          width: isScaledDown ? '1920px' : '100vw',
          height: isScaledDown ? '1080px' : '100vh',
          transform: isScaledDown ? `scale(${viewportScale})` : 'none',
          transformOrigin: 'top center',
          flexShrink: 0,
          background: THEME.BG_DARK,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header */}
        <Header courseLoaded={courseLoaded} courseData={courseData} />

        {/* Horizontal gradient line below header */}
        <div
          style={{
            height: '1px',
            width: '100%',
            background: THEME.GRADIENT_LINE_TOP
          }}
        />

        {/* Page Content */}
        <div style={{ flex: 1, overflow: 'hidden' }}>
          {renderPage()}
        </div>

        {/* Design Sub-navigation (only on design page) */}
        {currentPage === 'design' && (
          <div
            style={{
              position: 'absolute',
              top: '120px',
              right: '40px',
              display: 'flex',
              gap: '8px',
              zIndex: 100
            }}
          >
            <button
              onClick={() => handleDesignSubnav('planner')}
              style={{
                padding: '8px 16px',
                fontSize: '9px',
                letterSpacing: '1px',
                fontFamily: THEME.FONT_PRIMARY,
                background: designSubpage === 'planner' ? 'rgba(212, 115, 12, 0.2)' : 'transparent',
                border: `1px solid ${designSubpage === 'planner' ? THEME.AMBER : THEME.BORDER}`,
                borderRadius: '3px',
                color: designSubpage === 'planner' ? THEME.AMBER : THEME.TEXT_DIM,
                cursor: 'pointer'
              }}
            >
              PLANNER
            </button>
            <button
              onClick={() => handleDesignSubnav('scalar')}
              style={{
                padding: '8px 16px',
                fontSize: '9px',
                letterSpacing: '1px',
                fontFamily: THEME.FONT_PRIMARY,
                background: designSubpage === 'scalar' ? 'rgba(212, 115, 12, 0.2)' : 'transparent',
                border: `1px solid ${designSubpage === 'scalar' ? THEME.AMBER : THEME.BORDER}`,
                borderRadius: '3px',
                color: designSubpage === 'scalar' ? THEME.AMBER : THEME.TEXT_DIM,
                cursor: 'pointer'
              }}
            >
              SCALAR
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
