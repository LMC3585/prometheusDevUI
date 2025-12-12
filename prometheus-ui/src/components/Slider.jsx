/**
 * Slider - Reusable Discrete Snapping Slider Component
 *
 * Supports two modes:
 * 1. Discrete mode: Snaps to predefined options (Level, Seniority)
 * 2. Continuous mode: Free sliding with min/max (Duration)
 *
 * Features:
 * - Value bubble display
 * - Discrete position snapping
 * - Orange accent styling
 * - Hover/focus states
 */

import { useState, useCallback, useRef, useEffect } from 'react'
import { THEME } from '../constants/theme'

function Slider({
  options = [],           // For discrete mode: array of string options
  value,                  // Current value (string for discrete, number for continuous)
  onChange,               // Callback when value changes
  min = 0,                // For continuous mode
  max = 100,              // For continuous mode
  continuous = false,     // If true, use continuous mode
  label = '',             // Optional label text
  showBubble = true,      // Show value bubble
  width = 200,            // Slider width in pixels
  highlightLast = false   // Highlight last option differently (e.g., "ALL" in seniority)
}) {
  const [isDragging, setIsDragging] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const sliderRef = useRef(null)

  // Calculate current index for discrete mode
  const currentIndex = continuous ? 0 : options.indexOf(value)
  const totalSteps = continuous ? (max - min) : (options.length - 1)

  // Calculate percentage position
  const getPercentage = () => {
    if (continuous) {
      return ((value - min) / (max - min)) * 100
    }
    return totalSteps > 0 ? (currentIndex / totalSteps) * 100 : 0
  }

  // Handle slider interaction
  const handleInteraction = useCallback((clientX) => {
    if (!sliderRef.current) return

    const rect = sliderRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))

    if (continuous) {
      const newValue = Math.round(min + (percentage / 100) * (max - min))
      onChange?.(newValue)
    } else {
      // Snap to nearest discrete option
      const stepPercentage = 100 / totalSteps
      const nearestIndex = Math.round(percentage / stepPercentage)
      const clampedIndex = Math.max(0, Math.min(options.length - 1, nearestIndex))
      onChange?.(options[clampedIndex])
    }
  }, [continuous, min, max, options, totalSteps, onChange])

  // Mouse event handlers
  const handleMouseDown = (e) => {
    setIsDragging(true)
    handleInteraction(e.clientX)
  }

  const handleMouseMove = useCallback((e) => {
    if (isDragging) {
      handleInteraction(e.clientX)
    }
  }, [isDragging, handleInteraction])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Add/remove global mouse listeners
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  // Touch event handlers
  const handleTouchStart = (e) => {
    setIsDragging(true)
    handleInteraction(e.touches[0].clientX)
  }

  const handleTouchMove = (e) => {
    if (isDragging) {
      handleInteraction(e.touches[0].clientX)
    }
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  const percentage = getPercentage()
  const isActive = isDragging || isHovered

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        width: `${width}px`
      }}
    >
      {/* Label */}
      {label && (
        <span
          style={{
            fontSize: '17px',
            fontFamily: THEME.FONT_PRIMARY,
            color: isActive ? THEME.AMBER : THEME.TEXT_SECONDARY,
            letterSpacing: '1.5px',
            transition: 'color 0.3s ease'
          }}
        >
          {label}
        </span>
      )}

      {/* Slider track */}
      <div
        ref={sliderRef}
        onMouseDown={handleMouseDown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          position: 'relative',
          width: '100%',
          height: '24px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        {/* Track background */}
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '4px',
            background: THEME.BORDER_GREY,
            borderRadius: '2px'
          }}
        />

        {/* Track fill */}
        <div
          style={{
            position: 'absolute',
            width: `${percentage}%`,
            height: '4px',
            background: `linear-gradient(to right, ${THEME.AMBER_DARK}, ${THEME.AMBER})`,
            borderRadius: '2px',
            transition: isDragging ? 'none' : 'width 0.2s ease'
          }}
        />

        {/* Discrete step markers (for discrete mode only) */}
        {!continuous && options.map((opt, idx) => {
          const stepPercent = (idx / totalSteps) * 100
          const isLastOption = idx === options.length - 1
          const isSelected = idx === currentIndex

          return (
            <div
              key={opt}
              style={{
                position: 'absolute',
                left: `${stepPercent}%`,
                transform: 'translateX(-50%)',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: isSelected
                  ? THEME.AMBER
                  : (highlightLast && isLastOption)
                    ? THEME.AMBER_DARK
                    : THEME.BORDER_GREY,
                border: `2px solid ${THEME.BG_DARK}`,
                transition: 'all 0.2s ease',
                zIndex: 1
              }}
            />
          )
        })}

        {/* Thumb */}
        <div
          style={{
            position: 'absolute',
            left: `${percentage}%`,
            transform: 'translateX(-50%)',
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            background: THEME.AMBER,
            border: `2px solid ${THEME.BG_DARK}`,
            boxShadow: isActive
              ? `0 0 12px rgba(212, 115, 12, 0.6)`
              : `0 0 6px rgba(212, 115, 12, 0.3)`,
            transition: isDragging ? 'none' : 'all 0.2s ease',
            zIndex: 2
          }}
        />
      </div>

      {/* Value bubble */}
      {showBubble && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <div
            style={{
              padding: '4px 12px',
              background: THEME.BG_INPUT,
              border: `1px solid ${isActive ? THEME.AMBER : THEME.BORDER}`,
              borderRadius: '4px',
              fontSize: '10px',
              fontFamily: THEME.FONT_MONO,
              color: isActive ? THEME.AMBER : THEME.TEXT_PRIMARY,
              letterSpacing: '1px',
              transition: 'all 0.3s ease',
              minWidth: '80px',
              textAlign: 'center'
            }}
          >
            {continuous ? value : value}
          </div>
        </div>
      )}

      {/* Step labels (for discrete mode with few options) */}
      {!continuous && options.length <= 5 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            marginTop: '4px'
          }}
        >
          {options.map((opt, idx) => {
            const isSelected = idx === currentIndex
            const isLastOption = idx === options.length - 1

            return (
              <span
                key={opt}
                onClick={() => onChange?.(opt)}
                style={{
                  fontSize: '7px',
                  fontFamily: THEME.FONT_MONO,
                  color: isSelected
                    ? THEME.AMBER
                    : (highlightLast && isLastOption)
                      ? THEME.AMBER_DARK
                      : THEME.TEXT_DIM,
                  letterSpacing: '0.5px',
                  cursor: 'pointer',
                  transition: 'color 0.2s ease',
                  textAlign: 'center',
                  flex: 1
                }}
              >
                {opt}
              </span>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Slider
