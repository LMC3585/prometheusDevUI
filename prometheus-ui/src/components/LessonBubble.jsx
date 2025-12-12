/**
 * LessonBubble - Draggable lesson block for Outline Planner
 *
 * Features:
 * - Draggable within timetable grid
 * - Shows lesson name
 * - "+" button to add more bubbles
 * - Orange highlight when selected
 */

import { useState } from 'react'
import { THEME } from '../constants/theme'

function LessonBubble({
  id,
  name,
  isSelected = false,
  onSelect,
  onAdd,
  onDragStart,
  onDragEnd,
  style = {}
}) {
  const [isDragging, setIsDragging] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const handleDragStart = (e) => {
    setIsDragging(true)
    e.dataTransfer.setData('bubbleId', id)
    e.dataTransfer.effectAllowed = 'move'
    onDragStart?.(id)
  }

  const handleDragEnd = () => {
    setIsDragging(false)
    onDragEnd?.(id)
  }

  const isActive = isSelected || isHovered

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={() => onSelect?.(id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 16px',
        background: isActive
          ? `linear-gradient(135deg, ${THEME.AMBER_DARK} 0%, ${THEME.AMBER_DARKEST} 100%)`
          : THEME.BG_MEDIUM,
        border: `1px solid ${isActive ? THEME.AMBER : THEME.BORDER}`,
        borderRadius: '20px',
        cursor: isDragging ? 'grabbing' : 'grab',
        opacity: isDragging ? 0.7 : 1,
        transition: 'all 0.2s ease',
        boxShadow: isActive ? `0 0 15px rgba(212, 115, 12, 0.3)` : 'none',
        ...style
      }}
    >
      <span
        style={{
          fontSize: '11px',
          fontFamily: THEME.FONT_PRIMARY,
          color: isActive ? THEME.WHITE : THEME.TEXT_SECONDARY,
          letterSpacing: '1px',
          whiteSpace: 'nowrap'
        }}
      >
        {name}
      </span>

      {/* Add button */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onAdd?.(id)
        }}
        style={{
          width: '18px',
          height: '18px',
          borderRadius: '50%',
          background: isActive ? THEME.AMBER : THEME.BORDER_GREY,
          border: 'none',
          color: THEME.WHITE,
          fontSize: '12px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background 0.2s ease',
          flexShrink: 0
        }}
      >
        +
      </button>
    </div>
  )
}

export default LessonBubble
