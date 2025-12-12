/**
 * Generate Page - Placeholder
 *
 * Coming Soon page with full frame structure
 */

import { useState, useCallback } from 'react'
import { THEME } from '../constants/theme'
import NavWheel from '../components/NavWheel'
import StatusBar from '../components/StatusBar'
import PKEInterface from '../components/PKEInterface'

function Generate({ onNavigate, courseLoaded }) {
  const [isPKEActive, setIsPKEActive] = useState(false)
  const [wheelExpanded, setWheelExpanded] = useState(false)

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
      {/* Page Title */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px 0',
          borderBottom: `1px solid ${THEME.BORDER}`
        }}
      >
        <h1
          style={{
            fontSize: '20px',
            letterSpacing: '6px',
            color: THEME.OFF_WHITE,
            fontFamily: THEME.FONT_PRIMARY
          }}
        >
          GENERATE
        </h1>
      </div>

      {/* Main Content - Coming Soon */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div
          className="fade-in-scale"
          style={{
            textAlign: 'center'
          }}
        >
          <div
            style={{
              fontSize: '48px',
              color: THEME.AMBER_DARK,
              marginBottom: '20px',
              opacity: 0.5
            }}
          >
            ⚡
          </div>
          <h2
            style={{
              fontSize: '14px',
              letterSpacing: '6px',
              color: THEME.TEXT_DIM,
              fontFamily: THEME.FONT_PRIMARY,
              marginBottom: '12px'
            }}
          >
            COMING SOON
          </h2>
          <p
            style={{
              fontSize: '10px',
              letterSpacing: '2px',
              color: THEME.TEXT_MUTED,
              fontFamily: THEME.FONT_MONO
            }}
          >
            Generation functionality is under development
          </p>
        </div>
      </div>

      {/* Bottom Controls */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            padding: '0 40px 20px',
            marginBottom: '15px'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button style={navButtonStyle}>&lt;</button>
              <span style={{ color: THEME.TEXT_DIM, fontSize: '12px' }}>+</span>
              <button style={navButtonStyle}>&gt;</button>
            </div>
            <PKEInterface isActive={isPKEActive} onClose={() => setIsPKEActive(false)} />
          </div>
        </div>

        <div style={{ width: '100%', height: '1px', background: THEME.GRADIENT_LINE_BOTTOM }} />
        <StatusBar courseLoaded={courseLoaded} />
      </div>

      {/* Mini NavWheel */}
      <div style={{ position: 'absolute', bottom: '100px', left: '30px' }}>
        <NavWheel
          currentSection="generate"
          onNavigate={handleNavigate}
          isExpanded={wheelExpanded}
          onToggle={() => setWheelExpanded(!wheelExpanded)}
        />
      </div>
    </div>
  )
}

const navButtonStyle = {
  background: 'transparent',
  border: 'none',
  color: THEME.TEXT_DIM,
  fontSize: '18px',
  cursor: 'pointer',
  padding: '4px 8px'
}

export default Generate
