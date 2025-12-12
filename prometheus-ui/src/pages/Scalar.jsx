/**
 * Scalar Page - Slides 5 & 6 of Mockup 2.1
 *
 * Tabbed interface:
 * - MANAGER: Three-column hierarchical editor (Slide 5)
 * - VIEWER: Five-column read-only table (Slide 6)
 *
 * Features:
 * - Tab toggle between Manager and Viewer
 * - Module selector dropdown
 * - PKE import button
 */

import { useState, useCallback } from 'react'
import { THEME } from '../constants/theme'
import NavWheel from '../components/NavWheel'
import ScalarManager from '../components/ScalarManager'
import ScalarViewer from '../components/ScalarViewer'
import StatusBar from '../components/StatusBar'
import PKEInterface from '../components/PKEInterface'
import pkeButton from '../assets/PKE_Button.png'

function Scalar({ onNavigate, courseData, courseLoaded }) {
  const [activeTab, setActiveTab] = useState('manager') // 'manager' | 'viewer'
  const [selectedModule, setSelectedModule] = useState(1)
  const [isPKEActive, setIsPKEActive] = useState(false)
  const [wheelExpanded, setWheelExpanded] = useState(false)

  // Handle navigation
  const handleNavigate = useCallback((section) => {
    setWheelExpanded(false)
    onNavigate?.(section)
  }, [onNavigate])

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: THEME.BG_DARK,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}
    >
      {/* Header Section */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 40px',
          borderBottom: `1px solid ${THEME.BORDER}`
        }}
      >
        {/* Left: Title and PKE */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h1
            style={{
              fontSize: '18px',
              letterSpacing: '6px',
              color: THEME.OFF_WHITE,
              fontFamily: THEME.FONT_PRIMARY
            }}
          >
            SCALAR
          </h1>
          <img
            src={pkeButton}
            alt="PKE"
            onClick={() => setIsPKEActive(!isPKEActive)}
            style={{
              width: '28px',
              height: '28px',
              cursor: 'pointer',
              opacity: isPKEActive ? 1 : 0.7
            }}
          />
        </div>

        {/* Center: Import Scalar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span
            style={{
              fontSize: '10px',
              letterSpacing: '2px',
              color: THEME.TEXT_DIM,
              fontFamily: THEME.FONT_PRIMARY
            }}
          >
            Import Scalar
          </span>
          <img
            src={pkeButton}
            alt="Import"
            style={{
              width: '24px',
              height: '24px',
              cursor: 'pointer',
              opacity: 0.6
            }}
          />
        </div>

        {/* Right: Module selector and Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          {/* Module Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontSize: '10px',
                letterSpacing: '2px',
                color: THEME.TEXT_DIM,
                fontFamily: THEME.FONT_PRIMARY
              }}
            >
              Module:
            </span>
            <select
              value={selectedModule}
              onChange={(e) => setSelectedModule(parseInt(e.target.value))}
              style={{
                background: 'transparent',
                border: `1px solid ${THEME.BORDER}`,
                borderRadius: '3px',
                padding: '6px 24px 6px 12px',
                color: THEME.TEXT_PRIMARY,
                fontSize: '11px',
                fontFamily: THEME.FONT_MONO,
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
            </select>
          </div>

          {/* Tab Toggle */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '11px',
              fontFamily: THEME.FONT_PRIMARY,
              letterSpacing: '2px'
            }}
          >
            <button
              onClick={() => setActiveTab('manager')}
              style={{
                background: 'transparent',
                border: 'none',
                color: activeTab === 'manager' ? THEME.AMBER : THEME.TEXT_DIM,
                cursor: 'pointer',
                padding: '8px 12px',
                borderBottom: activeTab === 'manager' ? `2px solid ${THEME.AMBER}` : '2px solid transparent',
                transition: 'all 0.2s ease'
              }}
            >
              MANAGER
            </button>
            <span style={{ color: THEME.TEXT_MUTED }}>|</span>
            <button
              onClick={() => setActiveTab('viewer')}
              style={{
                background: 'transparent',
                border: 'none',
                color: activeTab === 'viewer' ? THEME.AMBER : THEME.TEXT_DIM,
                cursor: 'pointer',
                padding: '8px 12px',
                borderBottom: activeTab === 'viewer' ? `2px solid ${THEME.AMBER}` : '2px solid transparent',
                transition: 'all 0.2s ease'
              }}
            >
              VIEWER
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          padding: '24px 40px',
          paddingBottom: '180px', // Space for bottom controls
          overflow: 'hidden'
        }}
      >
        {activeTab === 'manager' ? (
          <ScalarManager />
        ) : (
          <ScalarViewer selectedModule={selectedModule} />
        )}
      </div>

      {/* Bottom Controls */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            padding: '0 40px 20px 130px',
            marginBottom: '15px'
          }}
        >
          <div /> {/* Spacer */}

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button style={navButtonStyle}>&lt;</button>
              <span style={{ color: THEME.TEXT_DIM, fontSize: '12px' }}>+</span>
              <button style={navButtonStyle}>&gt;</button>
            </div>
            <PKEInterface isActive={isPKEActive} onClose={() => setIsPKEActive(false)} />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button style={actionButtonStyle}>DELETE</button>
            <button style={actionButtonStyle}>CLEAR</button>
            <button style={{ ...actionButtonStyle, ...primaryButtonStyle }}>SAVE</button>
          </div>
        </div>

        <div style={{ width: '100%', height: '1px', background: THEME.GRADIENT_LINE_BOTTOM }} />
        <StatusBar courseLoaded={courseLoaded} />
      </div>

      {/* Mini NavWheel */}
      <div style={{ position: 'absolute', bottom: '100px', left: '30px' }}>
        <NavWheel
          currentSection="design"
          onNavigate={handleNavigate}
          isExpanded={wheelExpanded}
          onToggle={() => setWheelExpanded(!wheelExpanded)}
        />
      </div>
    </div>
  )
}

// Styles
const navButtonStyle = {
  background: 'transparent',
  border: 'none',
  color: THEME.TEXT_DIM,
  fontSize: '18px',
  cursor: 'pointer',
  padding: '4px 8px'
}

const actionButtonStyle = {
  padding: '10px 24px',
  fontSize: '10px',
  letterSpacing: '2px',
  fontFamily: THEME.FONT_PRIMARY,
  background: 'transparent',
  border: `1px solid ${THEME.BORDER}`,
  borderRadius: '20px',
  color: THEME.TEXT_SECONDARY,
  cursor: 'pointer'
}

const primaryButtonStyle = {
  background: THEME.GRADIENT_BUTTON,
  border: `1px solid ${THEME.AMBER}`,
  color: THEME.WHITE
}

export default Scalar
