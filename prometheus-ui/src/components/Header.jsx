/**
 * Header.jsx - Shared Header Component
 *
 * EXACT SPECIFICATION (URGENT_HEADER_FIX.md):
 * - Logo: 60px at (20px, 10px) - NO text beside it
 * - Main Title: 24px, centered horizontally, Y-center aligned with logo (~Y=40)
 * - Info Cluster: Right-aligned at (right:20px, top:15px), grey labels, values "---" when empty
 * - Horizontal Line: Y=85, full width gradient
 * - Page Title: Centered, Y=92 (7px below line), 18px font
 *
 * This component is used by ALL pages for consistent header layout.
 */

import logo from '../assets/burntorangelogo.png'
import { THEME } from '../constants/theme'

function Header({ pageTitle, courseData = {} }) {
  // Determine if values should show (only when explicitly populated)
  const hasValue = (val) => val && val !== '' && val !== '---'

  return (
    <header
      style={{
        position: 'relative',
        width: '100%',
        height: '120px',
        background: 'transparent',
        flexShrink: 0
      }}
    >
      {/* Logo - far left, NO text beside it */}
      <div
        style={{
          position: 'absolute',
          left: '20px',
          top: '10px',
          width: '60px',
          height: '60px'
        }}
      >
        <img
          src={logo}
          alt="Prometheus"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain'
          }}
        />
      </div>

      {/* Main Title - centered horizontally, vertically aligned with logo center */}
      <h1
        style={{
          position: 'absolute',
          left: '50%',
          top: '40px',
          transform: 'translate(-50%, -50%)',
          fontFamily: THEME.FONT_PRIMARY,
          fontSize: '24px',
          fontWeight: 500,
          color: '#f0f0f0',
          letterSpacing: '0.15em',
          whiteSpace: 'nowrap',
          margin: 0
        }}
      >
        PROMETHEUS COURSE GENERATION SYSTEM 2.0
      </h1>

      {/* Info Cluster - far right */}
      <div
        style={{
          position: 'absolute',
          right: '20px',
          top: '15px',
          textAlign: 'right',
          fontFamily: THEME.FONT_MONO,
          fontSize: '12px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', lineHeight: 1.4 }}>
          <span style={{ color: '#888' }}>Course:</span>
          <span style={{ color: hasValue(courseData.title) ? THEME.AMBER : '#888', minWidth: '80px' }}>
            {hasValue(courseData.title) ? courseData.title : '---'}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', lineHeight: 1.4 }}>
          <span style={{ color: '#888' }}>Duration:</span>
          <span style={{ color: hasValue(courseData.duration) ? THEME.AMBER : '#888', minWidth: '80px' }}>
            {hasValue(courseData.duration) ? `${courseData.duration} ${courseData.durationUnit || ''}`.trim() : '---'}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', lineHeight: 1.4 }}>
          <span style={{ color: '#888' }}>Level:</span>
          <span style={{ color: hasValue(courseData.level) ? THEME.AMBER : '#888', minWidth: '80px' }}>
            {hasValue(courseData.level) ? courseData.level : '---'}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', lineHeight: 1.4 }}>
          <span style={{ color: '#888' }}>Thematic:</span>
          <span style={{ color: hasValue(courseData.thematic) ? THEME.AMBER : '#888', minWidth: '80px' }}>
            {hasValue(courseData.thematic) ? courseData.thematic : '---'}
          </span>
        </div>
      </div>

      {/* Horizontal Line at Y=85 */}
      <div
        style={{
          position: 'absolute',
          top: '85px',
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(to right, transparent 0%, #444 10%, #444 90%, transparent 100%)'
        }}
      />

      {/* Page Title - centered, Y=92 (7px below line) */}
      <h2
        style={{
          position: 'absolute',
          top: '92px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: THEME.FONT_PRIMARY,
          fontSize: '18px',
          fontWeight: 500,
          color: '#f0f0f0',
          letterSpacing: '0.1em',
          margin: 0
        }}
      >
        {pageTitle}
      </h2>
    </header>
  )
}

export default Header
