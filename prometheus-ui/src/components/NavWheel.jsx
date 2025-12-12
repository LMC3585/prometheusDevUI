/**
 * NavWheel - Compass-style Navigation Component
 *
 * Two modes:
 * - Full (expanded): 280px diameter, centered on screen with backdrop overlay
 * - Mini (collapsed): 70px diameter, bottom-left corner
 *
 * Navigation sections:
 * - North: DEFINE
 * - East: DESIGN
 * - South: BUILD
 * - West: FORMAT
 * - Center: GENERATE
 */

import { useState, useCallback } from 'react'
import { THEME, NAV_SECTIONS, ANIMATION } from '../constants/theme'
import logo from '../assets/burntorangelogo.png'

function NavWheel({
  currentSection = 'define',
  onNavigate,
  isExpanded = false,
  onToggle,
  showLabels = true
}) {
  const [hoveredSection, setHoveredSection] = useState(null)

  // Sizes based on expanded state
  const size = isExpanded ? ANIMATION.WHEEL_EXPANDED_SIZE : ANIMATION.WHEEL_COLLAPSED_SIZE
  const centerSize = isExpanded ? 70 : 54
  const labelRadius = isExpanded ? 100 : 0

  // Get cardinal sections (excluding center/generate)
  const cardinalSections = NAV_SECTIONS.filter(s => s.angle !== null)
  const centerSection = NAV_SECTIONS.find(s => s.angle === null)

  // Calculate position for a section label
  const getSectionPosition = (angle) => {
    const radians = (angle - 90) * (Math.PI / 180) // -90 to start from top
    const x = Math.cos(radians) * labelRadius
    const y = Math.sin(radians) * labelRadius
    return { x, y }
  }

  // Handle section click
  const handleSectionClick = useCallback((sectionId) => {
    if (onNavigate) {
      onNavigate(sectionId)
    }
  }, [onNavigate])

  // Handle center click (toggle or navigate to generate)
  const handleCenterClick = useCallback(() => {
    if (isExpanded && centerSection) {
      // When expanded, clicking center navigates to GENERATE
      handleSectionClick(centerSection.id)
    } else if (onToggle) {
      // When collapsed, clicking expands the wheel
      onToggle()
    }
  }, [isExpanded, onToggle, handleSectionClick, centerSection])

  // Get section styling
  const getSectionStyle = (section) => {
    const isActive = currentSection === section.id
    const isHovered = hoveredSection === section.id

    return {
      color: isActive || isHovered ? THEME.AMBER : THEME.TEXT_DIM,
      textShadow: isActive ? `0 0 10px ${THEME.AMBER}` : 'none',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    }
  }

  return (
    <>
      {/* Backdrop overlay when expanded */}
      {isExpanded && (
        <div
          className="navwheel-backdrop"
          onClick={onToggle}
        />
      )}

      {/* Main wheel container */}
      <div
        className="navwheel-container"
        style={{
          position: isExpanded ? 'fixed' : 'absolute',
          bottom: isExpanded ? '50%' : '30px',
          left: isExpanded ? '50%' : '30px',
          transform: isExpanded ? 'translate(-50%, 50%)' : 'none',
          width: `${size}px`,
          height: `${size}px`,
          zIndex: 1000
        }}
      >
        {/* Outer ring SVG */}
        <svg
          width={size}
          height={size}
          style={{
            position: 'absolute',
            top: 0,
            left: 0
          }}
        >
          <defs>
            <linearGradient id="compassRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={THEME.AMBER_DARKEST} />
              <stop offset="50%" stopColor={THEME.AMBER_DARK} />
              <stop offset="100%" stopColor={THEME.AMBER_DARKEST} />
            </linearGradient>
          </defs>

          {/* Outer decorative ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={size / 2 - 2}
            fill="none"
            stroke="url(#compassRingGrad)"
            strokeWidth="1.5"
            opacity="0.6"
          />

          {/* Inner elements only when expanded */}
          {isExpanded && (
            <>
              {/* Inner track circle */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={labelRadius}
                fill="none"
                stroke={THEME.BORDER}
                strokeWidth="1"
                strokeDasharray="4 4"
              />

              {/* Tick marks at cardinal positions */}
              {cardinalSections.map((section, i) => {
                const angle = section.angle * (Math.PI / 180)
                const innerR = size / 2 - 12
                const outerR = size / 2 - 4
                return (
                  <line
                    key={section.id}
                    x1={size / 2 + innerR * Math.sin(angle)}
                    y1={size / 2 - innerR * Math.cos(angle)}
                    x2={size / 2 + outerR * Math.sin(angle)}
                    y2={size / 2 - outerR * Math.cos(angle)}
                    stroke={THEME.AMBER_DARKEST}
                    strokeWidth="2"
                  />
                )
              })}

              {/* Direction arrows */}
              {cardinalSections.map((section) => {
                const angle = section.angle
                const arrowRadius = size / 2 - 25
                const radians = (angle - 90) * (Math.PI / 180)
                const x = size / 2 + Math.cos(radians) * arrowRadius
                const y = size / 2 + Math.sin(radians) * arrowRadius

                // Arrow pointing outward
                const arrowSize = 8
                const arrowAngle = angle * (Math.PI / 180)

                return (
                  <polygon
                    key={`arrow-${section.id}`}
                    points={`
                      ${x + Math.sin(arrowAngle) * arrowSize},${y - Math.cos(arrowAngle) * arrowSize}
                      ${x - Math.cos(arrowAngle) * arrowSize / 2 - Math.sin(arrowAngle) * arrowSize / 2},${y - Math.sin(arrowAngle) * arrowSize / 2 + Math.cos(arrowAngle) * arrowSize / 2}
                      ${x + Math.cos(arrowAngle) * arrowSize / 2 - Math.sin(arrowAngle) * arrowSize / 2},${y + Math.sin(arrowAngle) * arrowSize / 2 + Math.cos(arrowAngle) * arrowSize / 2}
                    `}
                    fill={currentSection === section.id ? THEME.AMBER : THEME.AMBER_DARK}
                    opacity="0.8"
                  />
                )
              })}
            </>
          )}
        </svg>

        {/* Section labels (only when expanded) */}
        {isExpanded && showLabels && cardinalSections.map((section) => {
          const pos = getSectionPosition(section.angle)
          const isActive = currentSection === section.id
          const isHovered = hoveredSection === section.id

          return (
            <div
              key={section.id}
              onClick={() => handleSectionClick(section.id)}
              onMouseEnter={() => setHoveredSection(section.id)}
              onMouseLeave={() => setHoveredSection(null)}
              style={{
                position: 'absolute',
                left: `calc(50% + ${pos.x}px)`,
                top: `calc(50% + ${pos.y}px)`,
                transform: 'translate(-50%, -50%)',
                ...getSectionStyle(section),
                fontSize: '12px',
                fontFamily: THEME.FONT_PRIMARY,
                letterSpacing: '3px',
                fontWeight: isActive ? '600' : '400',
                whiteSpace: 'nowrap',
                padding: '8px 12px',
                borderRadius: '4px',
                background: isHovered ? 'rgba(212, 115, 12, 0.1)' : 'transparent'
              }}
            >
              {section.label}
            </div>
          )
        })}

        {/* Center hub with logo */}
        <div
          onClick={handleCenterClick}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: `${centerSize}px`,
            height: `${centerSize}px`,
            borderRadius: '50%',
            background: THEME.BG_DARK,
            border: `2px solid ${isExpanded ? THEME.AMBER : THEME.AMBER_DARK}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.4s ease',
            zIndex: 10,
            boxShadow: isExpanded ? `0 0 20px rgba(212, 115, 12, 0.3)` : 'none'
          }}
        >
          <img
            src={logo}
            alt="Prometheus"
            style={{
              width: isExpanded ? '50px' : '38px',
              height: isExpanded ? '50px' : '38px',
              objectFit: 'contain',
              filter: isExpanded ? 'drop-shadow(0 0 10px rgba(212, 115, 12, 0.5))' : 'none',
              transition: 'all 0.4s ease'
            }}
          />
        </div>

        {/* Center label (GENERATE) - only when expanded and hovered */}
        {isExpanded && centerSection && (
          <div
            onClick={() => handleSectionClick(centerSection.id)}
            onMouseEnter={() => setHoveredSection(centerSection.id)}
            onMouseLeave={() => setHoveredSection(null)}
            style={{
              position: 'absolute',
              top: `calc(50% + ${centerSize / 2 + 15}px)`,
              left: '50%',
              transform: 'translateX(-50%)',
              ...getSectionStyle(centerSection),
              fontSize: '10px',
              fontFamily: THEME.FONT_PRIMARY,
              letterSpacing: '2px',
              whiteSpace: 'nowrap',
              opacity: hoveredSection === centerSection.id ? 1 : 0.7
            }}
          >
            {centerSection.label}
          </div>
        )}

        {/* Current section indicator (when expanded) */}
        {isExpanded && (
          <div
            style={{
              position: 'absolute',
              bottom: '-45px',
              left: '50%',
              transform: 'translateX(-50%)',
              textAlign: 'center'
            }}
          >
            <div
              style={{
                fontSize: '9px',
                letterSpacing: '3px',
                color: THEME.AMBER,
                fontFamily: THEME.FONT_MONO,
                marginBottom: '4px'
              }}
            >
              {hoveredSection
                ? NAV_SECTIONS.find(s => s.id === hoveredSection)?.label
                : NAV_SECTIONS.find(s => s.id === currentSection)?.label
              }
            </div>
            <div
              style={{
                fontSize: '7px',
                letterSpacing: '2px',
                color: THEME.TEXT_DIM,
                fontFamily: THEME.FONT_MONO
              }}
            >
              {hoveredSection ? 'CLICK TO SELECT' : 'CURRENT SECTION'}
            </div>
          </div>
        )}

        {/* Mini label when collapsed */}
        {!isExpanded && (
          <div
            style={{
              position: 'absolute',
              bottom: '-20px',
              left: '50%',
              transform: 'translateX(-50%)',
              whiteSpace: 'nowrap'
            }}
          >
            <div
              style={{
                fontSize: '7px',
                letterSpacing: '2px',
                color: THEME.TEXT_DIM,
                fontFamily: THEME.FONT_MONO
              }}
            >
              NAVIGATE
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default NavWheel
