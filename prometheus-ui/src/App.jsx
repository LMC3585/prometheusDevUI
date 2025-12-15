/**
 * App.jsx - Main Application with Context Providers
 * 
 * Wraps application with Auth, Course, and PKE providers
 */

import { useState, useEffect, useCallback } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import { CourseProvider, useCourse } from './context/CourseContext'
import { PKEProvider, usePKE } from './context/PKEContext'

// Pages
import Login from './pages/Login'
import Define from './pages/Define'
import Outline from './pages/Outline'
import Build from './pages/Build'
import Format from './pages/Format'
import Generate from './pages/Generate'

// Main App Content (inside providers)
function AppContent() {
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth()
  const { currentCourse, saveCourse, clearCourse, deleteCourse, isDirty, courseState } = useCourse()
  const { getProgress } = usePKE()

  const [currentSection, setCurrentSection] = useState('define')
  const [isSaving, setIsSaving] = useState(false)

  // Calculate progress
  const progress = getProgress()

  // Handle navigation
  const handleNavigate = useCallback((section) => {
    setCurrentSection(section)
  }, [])

  // Handle save
  const handleSave = useCallback(async () => {
    setIsSaving(true)
    try {
      await saveCourse()
    } catch (err) {
      console.error('Save failed:', err)
      alert('Failed to save: ' + err.message)
    } finally {
      setIsSaving(false)
    }
  }, [saveCourse])

  // Handle clear
  const handleClear = useCallback(() => {
    if (isDirty) {
      if (!confirm('You have unsaved changes. Clear anyway?')) {
        return
      }
    }
    clearCourse()
  }, [clearCourse, isDirty])

  // Handle delete
  const handleDelete = useCallback(async () => {
    if (!currentCourse?.id) {
      clearCourse()
      return
    }
    
    if (!confirm('Are you sure you want to delete this course? This cannot be undone.')) {
      return
    }
    
    try {
      await deleteCourse()
      setCurrentSection('define')
    } catch (err) {
      console.error('Delete failed:', err)
      alert('Failed to delete: ' + err.message)
    }
  }, [currentCourse?.id, deleteCourse, clearCourse])

  // Keyboard shortcut: Ctrl+S to save
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault()
        handleSave()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleSave])

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#1a1a1a',
        color: '#D4730C'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', marginBottom: '16px' }}>PROMETHEUS</div>
          <div style={{ fontSize: '12px', opacity: 0.7 }}>Loading...</div>
        </div>
      </div>
    )
  }

  // Show login if not authenticated
  if (!isAuthenticated) {
    return <Login onLogin={() => setCurrentSection('define')} />
  }

  // Common props for all pages
  const pageProps = {
    onNavigate: handleNavigate,
    onSave: handleSave,
    onClear: handleClear,
    onDelete: handleDelete,
    user,
    courseState,
    progress
  }

  // Render current section
  const renderSection = () => {
    switch (currentSection) {
      case 'define':
        return <Define {...pageProps} />
      case 'outline':
        return <Outline {...pageProps} />
      case 'build':
        return <Build {...pageProps} />
      case 'format':
        return <Format {...pageProps} />
      case 'generate':
        return <Generate {...pageProps} />
      default:
        return <Define {...pageProps} />
    }
  }

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}>
      {renderSection()}
      
      {/* Saving overlay */}
      {isSaving && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            background: '#2a2a2a',
            padding: '24px 48px',
            borderRadius: '8px',
            color: '#D4730C',
            fontSize: '14px',
            letterSpacing: '2px'
          }}>
            SAVING...
          </div>
        </div>
      )}
    </div>
  )
}

// Main App with Providers
function App() {
  return (
    <AuthProvider>
      <CourseProvider>
        <PKEProvider>
          <AppContent />
        </PKEProvider>
      </CourseProvider>
    </AuthProvider>
  )
}

export default App
