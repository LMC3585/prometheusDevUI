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
import logo from '../assets/burntorangelogo.png'

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
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 40px',
          borderBottom: `1px solid ${THEME.BORDER}`
        }}
      >
        {/* Left - Logo and Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <img
            src={logo}
            alt="Prometheus"
            style={{
              width: '60px',
              height: '60px',
              objectFit: 'contain'
            }}
          />
          <div>
            <h1
              style={{
                fontSize: '16px',
                fontWeight: 400,
                letterSpacing: '6px',
                color: THEME.OFF_WHITE,
                fontFamily: THEME.FONT_PRIMARY,
                marginBottom: '2px'
              }}
            >
              PROMETHEUS
            </h1>
            <div
              style={{
                fontSize: '9px',
                letterSpacing: '3px',
                color: THEME.TEXT_DIM,
                fontFamily: THEME.FONT_PRIMARY
              }}
            >
              COURSE GENERATION SYSTEM 2.0
            </div>
          </div>
        </div>

        {/* Center - Current Section Label */}
        <div
          style={{
            padding: '10px 24px',
            background: 'rgba(212, 115, 12, 0.08)',
            border: `1px solid ${THEME.BORDER_AMBER}`,
            borderRadius: '3px'
          }}
        >
          <span
            style={{
              fontSize: '11px',
              letterSpacing: '4px',
              color: THEME.AMBER,
              fontFamily: THEME.FONT_MONO
            }}
          >
            NAVIGATE
          </span>
        </div>

        {/* Right - Course Info */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'auto auto',
            gap: '4px 16px',
            fontSize: '10px'
          }}
        >
          <span style={{ color: THEME.TEXT_DIM, fontFamily: THEME.FONT_MONO, letterSpacing: '1px' }}>
            COURSE
          </span>
          <span style={{ color: course.name !== '---' ? THEME.GREEN_LIGHT : THEME.TEXT_MUTED, fontFamily: THEME.FONT_MONO }}>
            {course.name}
          </span>
          <span style={{ color: THEME.TEXT_DIM, fontFamily: THEME.FONT_MONO, letterSpacing: '1px' }}>
            DURATION
          </span>
          <span style={{ color: course.duration !== '---' ? THEME.GREEN_LIGHT : THEME.TEXT_MUTED, fontFamily: THEME.FONT_MONO }}>
            {course.duration}
          </span>
          <span style={{ color: THEME.TEXT_DIM, fontFamily: THEME.FONT_MONO, letterSpacing: '1px' }}>
            LEVEL
          </span>
          <span style={{ color: course.level !== '---' ? THEME.GREEN_LIGHT : THEME.TEXT_MUTED, fontFamily: THEME.FONT_MONO }}>
            {course.level}
          </span>
          <span style={{ color: THEME.TEXT_DIM, fontFamily: THEME.FONT_MONO, letterSpacing: '1px' }}>
            THEMATIC
          </span>
          <span style={{ color: course.thematic !== '---' ? THEME.GREEN_LIGHT : THEME.TEXT_MUTED, fontFamily: THEME.FONT_MONO }}>
            {course.thematic}
          </span>
        </div>
      </div>

      {/* Horizontal gradient line */}
      <div
        style={{
          width: '100%',
          height: '1px',
          background: THEME.GRADIENT_LINE_TOP
        }}
      />

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
        {/* NavWheel - Always expanded on this page (+50% larger: 400→600px) */}
        <div
          className="fade-in-scale"
          style={{
            position: 'relative',
            width: '600px',
            height: '600px',
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
              fontSize: '20px',
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
              fontSize: '14px',
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
              fontSize: '20px',
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
          background: THEME.GRADIENT_LINE_BOTTOM
        }}
      />

      {/* Status Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 40px',
          fontSize: '9px'
        }}
      >
        <div style={{ display: 'flex', gap: '30px' }}>
          <span style={{ fontFamily: THEME.FONT_MONO }}>
            <span style={{ color: THEME.TEXT_DIM, letterSpacing: '2px' }}>OWNER</span>
            <span style={{ color: THEME.GREEN_BRIGHT, marginLeft: '10px' }}>MATTHEW DODDS</span>
          </span>
          <span style={{ fontFamily: THEME.FONT_MONO }}>
            <span style={{ color: THEME.TEXT_DIM, letterSpacing: '2px' }}>STATUS</span>
            <span style={{ color: THEME.AMBER, marginLeft: '10px' }}>READY</span>
          </span>
        </div>

        <div style={{ fontFamily: THEME.FONT_MONO, color: THEME.TEXT_DIM, letterSpacing: '2px' }}>
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

  // +50% size: 350 → 525
  const size = 525
  // Inner dashed circle radius - increased by 40%: 210 → 294
  const innerCircleRadius = 294

  // Fixed label positions per user spec (relative to wheel center at 262.5, 262.5)
  // Container is 600x600, wheel is 525x525 centered, so wheel top-left is at (37.5, 37.5) in container
  // User coords are absolute in 1920x1080 viewport where wheel is centered
  // DEFINE: Y=140 means label center is ~122px above wheel center
  // BUILD: Y=585 means label center is ~322px below wheel center
  // DESIGN: X=+220 means label right edge at X offset +220 from center
  // FORMAT: X=-320 means label LEFT edge at X offset -320 from center
  const getLabelPosition = (sectionId) => {
    switch(sectionId) {
      case 'define': return { x: 0, y: -180 }       // North - moved further up
      case 'build': return { x: 0, y: 180 }         // South - moved further down
      case 'design': return { x: 200, y: 0 }        // East - moved further right
      case 'format': return { x: -200, y: 0 }       // West - moved further left
      default: return { x: 0, y: 0 }
    }
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

        {/* Inner dashed circle - radius increased by 40% */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={innerCircleRadius}
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
                fontSize="14"
                style={{ pointerEvents: 'none' }}
              >
                {angle === 0 ? '↑' : angle === 90 ? '→' : angle === 180 ? '↓' : '←'}
              </text>
            </g>
          )
        })}
      </svg>

      {/* Section labels - positioned using fixed coordinates to avoid overlap */}
      {sections.map((section) => {
        const pos = getLabelPosition(section.id)
        const isHovered = hoveredSection === section.id

        // FORMAT label needs left-edge alignment, others are center-aligned
        const transformStyle = section.id === 'format'
          ? 'translate(0, -50%)'  // Left edge aligned
          : section.id === 'design'
            ? 'translate(-100%, -50%)' // Right edge aligned
            : 'translate(-50%, -50%)' // Center aligned

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
              transform: transformStyle,
              fontSize: '18px',
              fontFamily: THEME.FONT_PRIMARY,
              letterSpacing: '5px',
              fontWeight: isHovered ? '600' : '400',
              color: isHovered ? THEME.AMBER : THEME.TEXT_SECONDARY,
              textShadow: isHovered ? `0 0 20px ${THEME.AMBER}` : 'none',
              cursor: 'pointer',
              padding: '12px 20px',
              borderRadius: '4px',
              background: isHovered ? 'rgba(212, 115, 12, 0.1)' : 'transparent',
              transition: 'all 0.3s ease'
            }}
          >
            {section.label}
          </div>
        )
      })}

      {/* Center hub - +50% larger: 90→135px */}
      <div
        onClick={() => onNavigate?.(centerSection.id)}
        onMouseEnter={() => setHoveredSection(centerSection.id)}
        onMouseLeave={() => setHoveredSection(null)}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '135px',
          height: '135px',
          borderRadius: '50%',
          background: THEME.BG_DARK,
          border: `3px solid ${hoveredSection === centerSection.id ? THEME.AMBER : THEME.AMBER_DARK}`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: hoveredSection === centerSection.id
            ? `0 0 40px rgba(212, 115, 12, 0.5)`
            : `0 0 20px rgba(212, 115, 12, 0.2)`
        }}
      >
        <span
          style={{
            fontSize: '17px',
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
