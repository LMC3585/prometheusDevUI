/**
 * Navigate Page - Slide 2 of Mockup 2.1
 *
 * Layout:
 * - Full viewport with NavWheel centered
 * - Header bar at top (logo left, "NAVIGATE" label, course info right)
 * - Status bar at bottom
 * - NavWheel dominates center of screen
 *
 * The NavWheel here is always in expanded state.
 * Clicking a section navigates to that page.
 */

import { useCallback } from 'react'
import { THEME } from '../constants/theme'
import NavWheel from '../components/NavWheel'
import logo from '../assets/prometheus-logo.png'

function Navigate({ onNavigate, courseData = {} }) {
  // Handle navigation from wheel
  const handleWheelNavigate = useCallback((sectionId) => {
    onNavigate?.(sectionId)
  }, [onNavigate])

  // Default course data
  const course = {
    name: courseData.title || '---',
    duration: courseData.duration || '---',
    level: courseData.level || '---',
    thematic: courseData.thematic || '---'
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: THEME.BG_BASE,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}
    >
      {/* Main title on centreline */}
      <div style={{ padding: '18px 24px 6px', textAlign: 'center' }}>
        <h1
          style={{
            fontSize: '24px',
            fontWeight: 300,
            letterSpacing: '8px',
            color: THEME.OFF_WHITE,
            fontFamily: THEME.FONT_PRIMARY,
            margin: 0
          }}
        >
          PROMETHEUS COURSE GENERATION SYSTEM 2.0
        </h1>
      </div>

      <div
        style={{
          width: '100%',
          height: '1px',
          background: THEME.GRADIENT_LINE_TOP
        }}
      />

      {/* Section label on centreline */}
      <div style={{ textAlign: 'center', marginTop: '10px', marginBottom: '6px' }}>
        <span
          style={{
            fontSize: '17px',
            letterSpacing: '6px',
            color: THEME.WHITE,
            fontFamily: THEME.FONT_MONO
          }}
        >
          NAVIGATE
        </span>
      </div>

      {/* Header content row */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 40px 0'
        }}
      >
        {/* Left - Logo and Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <img
            src={logo}
            alt="Prometheus"
            style={{
              width: '84px',
              height: '84px',
              objectFit: 'contain'
            }}
          />
          <div>
            <h1
              style={{
                fontSize: '24px',
                fontWeight: 400,
                letterSpacing: '9px',
                color: THEME.OFF_WHITE,
                fontFamily: THEME.FONT_PRIMARY,
                marginBottom: '4px',
                marginTop: 0
              }}
            >
              PROMETHEUS
            </h1>
            <div
              style={{
                fontSize: '14px',
                letterSpacing: '4.5px',
                color: THEME.TEXT_SECONDARY,
                fontFamily: THEME.FONT_PRIMARY
              }}
            >
              COURSE GENERATION SYSTEM 2.0
            </div>
          </div>
        </div>

        {/* Right - Course Info */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'auto auto',
            gap: '6px 18px',
            fontSize: '15px',
            alignItems: 'center'
          }}
        >
          <span style={{ color: THEME.WHITE, fontFamily: THEME.FONT_MONO, letterSpacing: '1.5px' }}>
            COURSE
          </span>
          <span style={{ color: THEME.GREEN_BRIGHT, fontFamily: THEME.FONT_MONO }}>
            {course.name}
          </span>
          <span style={{ color: THEME.WHITE, fontFamily: THEME.FONT_MONO, letterSpacing: '1.5px' }}>
            DURATION
          </span>
          <span style={{ color: THEME.GREEN_BRIGHT, fontFamily: THEME.FONT_MONO }}>
            {course.duration}
          </span>
          <span style={{ color: THEME.WHITE, fontFamily: THEME.FONT_MONO, letterSpacing: '1.5px' }}>
            LEVEL
          </span>
          <span style={{ color: THEME.GREEN_BRIGHT, fontFamily: THEME.FONT_MONO }}>
            {course.level}
          </span>
          <span style={{ color: THEME.WHITE, fontFamily: THEME.FONT_MONO, letterSpacing: '1.5px' }}>
            THEMATIC
          </span>
          <span style={{ color: THEME.GREEN_BRIGHT, fontFamily: THEME.FONT_MONO }}>
            {course.thematic}
          </span>
        </div>
      </div>

      {/* Main Content - NavWheel Centered */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}
      >
        {/* NavWheel - Always expanded on this page */}
        <div
          className="fade-in-scale"
          style={{
            position: 'relative',
            width: '400px',
            height: '400px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {/* Custom large NavWheel for Navigate page */}
          <NavigateWheel onNavigate={handleWheelNavigate} />
        </div>

        {/* Module Navigation Controls */}
        <div
          style={{
            marginTop: '40px',
            display: 'flex',
            alignItems: 'center',
            gap: '20px'
          }}
        >
          <button
            style={{
              background: 'transparent',
              border: 'none',
              color: THEME.TEXT_DIM,
              fontSize: '30px',
              cursor: 'pointer',
              padding: '8px 12px',
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.color = THEME.AMBER}
            onMouseLeave={(e) => e.target.style.color = THEME.TEXT_DIM}
          >
            &lt;
          </button>
          <span
            style={{
              fontSize: '21px',
              color: THEME.TEXT_DIM,
              fontFamily: THEME.FONT_MONO
            }}
          >
            +
          </span>
          <button
            style={{
              background: 'transparent',
              border: 'none',
              color: THEME.TEXT_DIM,
              fontSize: '30px',
              cursor: 'pointer',
              padding: '8px 12px',
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.color = THEME.AMBER}
            onMouseLeave={(e) => e.target.style.color = THEME.TEXT_DIM}
          >
            &gt;
          </button>
        </div>
      </div>

      {/* Bottom gradient line */}
      <div
        style={{
          width: '100%',
          height: '1px',
          background: THEME.GRADIENT_LINE_BOTTOM,
          marginBottom: '25px'
        }}
      />

      {/* Status Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 40px',
          fontSize: '14px'
        }}
      >
        <div style={{ display: 'flex', gap: '30px' }}>
          <span style={{ fontFamily: THEME.FONT_MONO }}>
            <span style={{ color: THEME.WHITE, letterSpacing: '3px' }}>OWNER</span>
            <span style={{ color: THEME.GREEN_BRIGHT, marginLeft: '10px' }}>MATTHEW DODDS</span>
          </span>
          <span style={{ fontFamily: THEME.FONT_MONO }}>
            <span style={{ color: THEME.WHITE, letterSpacing: '3px' }}>STATUS</span>
            <span style={{ color: THEME.AMBER, marginLeft: '10px' }}>READY</span>
          </span>
        </div>

        <div style={{ fontFamily: THEME.FONT_MONO, color: THEME.WHITE, letterSpacing: '3px' }}>
          CLICK SECTION TO NAVIGATE
        </div>
      </div>
    </div>
  )
}

/**
 * NavigateWheel - Large centered wheel for Navigate page
 * This is a specialized version of NavWheel for the full-page display
 */
function NavigateWheel({ onNavigate }) {
  const [hoveredSection, setHoveredSection] = React.useState(null)

  const sections = [
    { id: 'define', label: 'DEFINE', angle: 0 },      // North
    { id: 'design', label: 'DESIGN', angle: 90 },     // East
    { id: 'build', label: 'BUILD', angle: 180 },      // South
    { id: 'format', label: 'FORMAT', angle: 270 },    // West
  ]
  const centerSection = { id: 'generate', label: 'GENERATE' }

  const size = 350
  const labelRadius = 130

  const getSectionPosition = (angle) => {
    const radians = (angle - 90) * (Math.PI / 180)
    const x = Math.cos(radians) * labelRadius
    const y = Math.sin(radians) * labelRadius
    return { x, y }
  }

  return (
    <div
      style={{
        position: 'relative',
        width: `${size}px`,
        height: `${size}px`
      }}
    >
      {/* Outer ring */}
      <svg width={size} height={size} style={{ position: 'absolute', top: 0, left: 0 }}>
        <defs>
          <linearGradient id="navRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={THEME.AMBER_DARKEST} />
            <stop offset="50%" stopColor={THEME.AMBER_DARK} />
            <stop offset="100%" stopColor={THEME.AMBER_DARKEST} />
          </linearGradient>
        </defs>

        {/* Outer circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 2}
          fill="none"
          stroke="url(#navRingGrad)"
          strokeWidth="2"
          opacity="0.8"
        />

        {/* Inner dashed circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={labelRadius}
          fill="none"
          stroke={THEME.BORDER}
          strokeWidth="1"
          strokeDasharray="6 6"
        />

        {/* Tick marks */}
        {sections.map((section) => {
          const angle = section.angle * (Math.PI / 180)
          const innerR = size / 2 - 15
          const outerR = size / 2 - 4
          return (
            <line
              key={section.id}
              x1={size / 2 + innerR * Math.sin(angle)}
              y1={size / 2 - innerR * Math.cos(angle)}
              x2={size / 2 + outerR * Math.sin(angle)}
              y2={size / 2 - outerR * Math.cos(angle)}
              stroke={THEME.AMBER_DARK}
              strokeWidth="3"
            />
          )
        })}

        {/* Direction arrows */}
        {sections.map((section) => {
          const angle = section.angle
          const arrowRadius = size / 2 - 35
          const radians = (angle - 90) * (Math.PI / 180)
          const x = size / 2 + Math.cos(radians) * arrowRadius
          const y = size / 2 + Math.sin(radians) * arrowRadius
          const isHovered = hoveredSection === section.id

          return (
            <g key={`arrow-${section.id}`}>
              <circle
                cx={x}
                cy={y}
                r="12"
                fill={isHovered ? THEME.AMBER_DARK : 'transparent'}
                stroke={isHovered ? THEME.AMBER : THEME.AMBER_DARK}
                strokeWidth="1.5"
                style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
              />
              <text
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={isHovered ? THEME.WHITE : THEME.AMBER}
                fontSize="21"
                style={{ pointerEvents: 'none' }}
              >
                {angle === 0 ? '↑' : angle === 90 ? '→' : angle === 180 ? '↓' : '←'}
              </text>
            </g>
          )
        })}
      </svg>

      {/* Section labels */}
      {sections.map((section) => {
        const pos = getSectionPosition(section.angle)
        const isHovered = hoveredSection === section.id

        return (
          <div
            key={section.id}
            onClick={() => onNavigate?.(section.id)}
            onMouseEnter={() => setHoveredSection(section.id)}
            onMouseLeave={() => setHoveredSection(null)}
            style={{
              position: 'absolute',
              left: `calc(50% + ${pos.x}px)`,
              top: `calc(50% + ${pos.y}px)`,
              transform: 'translate(-50%, -50%)',
              fontSize: '21px',
              fontFamily: THEME.FONT_PRIMARY,
              letterSpacing: '6px',
              fontWeight: isHovered ? '600' : '400',
              color: isHovered ? THEME.AMBER : THEME.TEXT_SECONDARY,
              textShadow: isHovered ? `0 0 15px ${THEME.AMBER}` : 'none',
              cursor: 'pointer',
              padding: '10px 16px',
              borderRadius: '4px',
              background: isHovered ? 'rgba(212, 115, 12, 0.1)' : 'transparent',
              transition: 'all 0.3s ease'
            }}
          >
            {section.label}
          </div>
        )
      })}

      {/* Center hub */}
      <div
        onClick={() => onNavigate?.(centerSection.id)}
        onMouseEnter={() => setHoveredSection(centerSection.id)}
        onMouseLeave={() => setHoveredSection(null)}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90px',
          height: '90px',
          borderRadius: '50%',
          background: THEME.BG_DARK,
          border: `2px solid ${hoveredSection === centerSection.id ? THEME.AMBER : THEME.AMBER_DARK}`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: hoveredSection === centerSection.id
            ? `0 0 30px rgba(212, 115, 12, 0.5)`
            : `0 0 15px rgba(212, 115, 12, 0.2)`
        }}
      >
        <span
          style={{
            fontSize: '14px',
            letterSpacing: '3px',
            color: hoveredSection === centerSection.id ? THEME.AMBER : THEME.TEXT_DIM,
            fontFamily: THEME.FONT_PRIMARY,
            transition: 'color 0.3s ease'
          }}
        >
          {centerSection.label}
        </span>
      </div>
    </div>
  )
}

// Need to import React for the useState in NavigateWheel
import React from 'react'

export default Navigate
