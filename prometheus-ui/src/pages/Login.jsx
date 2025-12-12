/**
 * Login Page - Slide 1 of Mockup 2.1
 *
 * Layout:
 * - Full viewport, dark background (#080808)
 * - Centered content vertically and horizontally
 * - Title: "PROMETHEUS COURSE GENERATION SYSTEM 2.0" at top with horizontal line
 * - Prometheus logo (flame) centered, large (~180px)
 *
 * Interaction Flow:
 * 1. Initial state: Logo only visible, no input fields
 * 2. First click on logo: Username and Password fields fade in below logo
 * 3. Second click (or Enter key): Validate → Navigate to Navigate page
 */

import { useState, useCallback } from 'react'
import { THEME } from '../constants/theme'
import logo from '../assets/prometheus-logo.png'

function Login({ onLogin }) {
  const [showFields, setShowFields] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLogoHovered, setIsLogoHovered] = useState(false)

  // Handle logo click
  const handleLogoClick = useCallback(() => {
    if (!showFields) {
      // First click: reveal fields
      setShowFields(true)
    } else {
      // Second click: attempt login
      handleLogin()
    }
  }, [showFields])

  // Handle login attempt
  const handleLogin = useCallback(() => {
    // For now, accept any non-empty credentials
    if (username.trim() && password.trim()) {
      setError('')
      onLogin?.({ username })
    } else if (!username.trim()) {
      setError('Please enter a username')
    } else {
      setError('Please enter a password')
    }
  }, [username, password, onLogin])

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    handleLogin()
  }

  // Handle key press in inputs
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleLogin()
    }
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: `linear-gradient(180deg, ${THEME.BG_BASE} 0%, ${THEME.BG_DARK} 50%, ${THEME.BG_BASE} 100%)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative'
      }}
    >
      {/* Top Title Section */}
      <div
        style={{
          width: '100%',
          padding: '40px 60px',
          textAlign: 'center'
        }}
      >
        <h1
          style={{
            fontSize: '24px',
            fontWeight: 300,
            letterSpacing: '8px',
            color: THEME.OFF_WHITE,
            fontFamily: THEME.FONT_PRIMARY,
            marginBottom: '8px'
          }}
        >
          PROMETHEUS COURSE GENERATION SYSTEM 2.0
        </h1>

        {/* Horizontal gradient line */}
        <div
          style={{
            width: '100%',
            height: '1px',
            background: `linear-gradient(to right, transparent, ${THEME.AMBER_DARK}, transparent)`,
            marginTop: '20px'
          }}
        />
      </div>

      {/* Main Content - Centered */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
          marginTop: '-80px' // Shift up to better center visually
        }}
      >
        {/* Logo */}
        <div
          onClick={handleLogoClick}
          onMouseEnter={() => setIsLogoHovered(true)}
          onMouseLeave={() => setIsLogoHovered(false)}
          style={{
            cursor: 'pointer',
            marginBottom: showFields ? '50px' : '0',
            transition: 'all 0.5s ease'
          }}
        >
          <img
            src={logo}
            alt="Prometheus"
            style={{
              width: '180px',
              height: '180px',
              objectFit: 'contain',
              filter: isLogoHovered
                ? 'drop-shadow(0 0 30px rgba(212, 115, 12, 0.8))'
                : 'drop-shadow(0 0 15px rgba(212, 115, 12, 0.4))',
              transition: 'filter 0.3s ease',
              animation: showFields ? 'none' : 'breathe 3s ease-in-out infinite'
            }}
          />
        </div>

        {/* Click hint (before fields shown) */}
        {!showFields && (
          <div
            className="fade-in"
            style={{
              marginTop: '30px',
              fontSize: '10px',
              letterSpacing: '4px',
              color: THEME.TEXT_DIM,
              fontFamily: THEME.FONT_MONO
            }}
          >
            CLICK TO LOGIN
          </div>
        )}

        {/* Login Fields (fade in on first click) */}
        {showFields && (
          <form
            onSubmit={handleSubmit}
            className="fade-in-up"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '350px'
            }}
          >
            {/* Username Field */}
            <div style={{ width: '100%', marginBottom: '24px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '9px',
                  letterSpacing: '3px',
                  color: THEME.TEXT_DIM,
                  fontFamily: THEME.FONT_PRIMARY,
                  marginBottom: '8px'
                }}
              >
                USERNAME
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  background: THEME.BG_INPUT,
                  border: `1px solid ${THEME.BORDER}`,
                  borderRadius: '3px',
                  color: THEME.TEXT_PRIMARY,
                  fontSize: '12px',
                  fontFamily: THEME.FONT_MONO,
                  letterSpacing: '2px',
                  outline: 'none',
                  transition: 'border-color 0.3s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = THEME.AMBER}
                onBlur={(e) => e.target.style.borderColor = THEME.BORDER}
              />
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  marginTop: '6px'
                }}
              >
                <span
                  style={{
                    fontSize: '8px',
                    color: THEME.TEXT_DIM,
                    fontFamily: THEME.FONT_MONO,
                    cursor: 'pointer',
                    transition: 'color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.color = THEME.AMBER}
                  onMouseLeave={(e) => e.target.style.color = THEME.TEXT_DIM}
                >
                  Remember Me
                </span>
              </div>
            </div>

            {/* Password Field */}
            <div style={{ width: '100%', marginBottom: '30px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '9px',
                  letterSpacing: '3px',
                  color: THEME.TEXT_DIM,
                  fontFamily: THEME.FONT_PRIMARY,
                  marginBottom: '8px'
                }}
              >
                PASSWORD
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  background: THEME.BG_INPUT,
                  border: `1px solid ${THEME.BORDER}`,
                  borderRadius: '3px',
                  color: THEME.TEXT_PRIMARY,
                  fontSize: '12px',
                  fontFamily: THEME.FONT_MONO,
                  letterSpacing: '2px',
                  outline: 'none',
                  transition: 'border-color 0.3s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = THEME.AMBER}
                onBlur={(e) => e.target.style.borderColor = THEME.BORDER}
              />
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  marginTop: '6px'
                }}
              >
                <span
                  style={{
                    fontSize: '8px',
                    color: THEME.TEXT_DIM,
                    fontFamily: THEME.FONT_MONO,
                    cursor: 'pointer',
                    transition: 'color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.color = THEME.AMBER}
                  onMouseLeave={(e) => e.target.style.color = THEME.TEXT_DIM}
                >
                  Forgot Password?
                </span>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div
                style={{
                  color: THEME.RED_LIGHT,
                  fontSize: '10px',
                  letterSpacing: '2px',
                  marginBottom: '20px',
                  fontFamily: THEME.FONT_MONO
                }}
              >
                {error}
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '14px 16px',
                background: THEME.GRADIENT_BUTTON,
                border: `1px solid ${THEME.AMBER}`,
                borderRadius: '3px',
                color: THEME.BG_BASE,
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '4px',
                fontFamily: THEME.FONT_PRIMARY,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textTransform: 'uppercase'
              }}
              onMouseEnter={(e) => {
                e.target.style.boxShadow = '0 0 25px rgba(212, 115, 12, 0.4)'
                e.target.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={(e) => {
                e.target.style.boxShadow = 'none'
                e.target.style.transform = 'translateY(0)'
              }}
            >
              LOGIN
            </button>
          </form>
        )}
      </div>

      {/* Bottom version info */}
      <div
        style={{
          position: 'absolute',
          bottom: '30px',
          left: '50%',
          transform: 'translateX(-50%)'
        }}
      >
        <span
          style={{
            fontSize: '8px',
            letterSpacing: '3px',
            color: THEME.TEXT_MUTED,
            fontFamily: THEME.FONT_MONO
          }}
        >
          V2.1
        </span>
      </div>
    </div>
  )
}

export default Login
