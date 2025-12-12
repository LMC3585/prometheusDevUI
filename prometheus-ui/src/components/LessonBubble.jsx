/**
 * LessonBubble - Draggable/editable lesson block for Outline Planner
 *
 * Features:
 * - Draggable within timetable grid
 * - Double-click to edit name inline
 * - Resizable width for duration (drag right edge)
 * - "+" button to add more bubbles
 * - Orange highlight when selected
 */

import { useState, useRef, useEffect } from 'react'
import { THEME } from '../constants/theme'

function LessonBubble({
  id,
  name,
  duration = 1, // Duration in hours
  isSelected = false,
  onSelect,
  onAdd,
  onNameChange,
  onDurationChange,
  onDragStart,
  onDragEnd,
  style = {}
}) {
  const [isDragging, setIsDragging] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(name)
  const [isResizing, setIsResizing] = useState(false)
  const inputRef = useRef(null)
  const bubbleRef = useRef(null)

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  // Update edit value when name prop changes
  useEffect(() => {
    setEditValue(name)
  }, [name])

  const handleDragStart = (e) => {
    if (isEditing || isResizing) {
      e.preventDefault()
      return
    }
    setIsDragging(true)
    e.dataTransfer.setData('bubbleId', id)
    e.dataTransfer.effectAllowed = 'move'
    onDragStart?.(id)
  }

  const handleDragEnd = () => {
    setIsDragging(false)
    onDragEnd?.(id)
  }

  const handleDoubleClick = (e) => {
    e.stopPropagation()
    setIsEditing(true)
    setEditValue(name)
  }

  const handleEditSubmit = () => {
    if (editValue.trim() && editValue !== name) {
      onNameChange?.(id, editValue.trim().toUpperCase())
    }
    setIsEditing(false)
  }

  const handleEditKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleEditSubmit()
    } else if (e.key === 'Escape') {
      setEditValue(name)
      setIsEditing(false)
    }
  }

  // Handle resize drag
  const handleResizeMouseDown = (e) => {
    e.stopPropagation()
    e.preventDefault()
    setIsResizing(true)

    const startX = e.clientX
    const startDuration = duration

    const handleMouseMove = (moveE) => {
      const deltaX = moveE.clientX - startX
      const durationChange = Math.round(deltaX / 60) // 60px per hour
      const newDuration = Math.max(1, Math.min(8, startDuration + durationChange))
      onDurationChange?.(id, newDuration)
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const isActive = isSelected || isHovered

  // Calculate width based on duration (min 100px, +60px per hour)
  const bubbleWidth = 100 + (duration - 1) * 60

  return (
    <div
      ref={bubbleRef}
      draggable={!isEditing && !isResizing}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={() => !isEditing && onSelect?.(id)}
      onDoubleClick={handleDoubleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 16px',
        minWidth: `${bubbleWidth}px`,
        background: isActive
          ? `linear-gradient(135deg, ${THEME.AMBER_DARK} 0%, ${THEME.AMBER_DARKEST} 100%)`
          : THEME.BG_MEDIUM,
        border: `1px solid ${isActive ? THEME.AMBER : THEME.BORDER}`,
        borderRadius: '20px',
        cursor: isEditing ? 'text' : isDragging ? 'grabbing' : 'grab',
        opacity: isDragging ? 0.7 : 1,
        transition: isResizing ? 'none' : 'all 0.2s ease',
        boxShadow: isActive ? `0 0 15px rgba(212, 115, 12, 0.3)` : 'none',
        position: 'relative',
        ...style
      }}
    >
      {/* Editable name */}
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value.toUpperCase())}
          onBlur={handleEditSubmit}
          onKeyDown={handleEditKeyDown}
          style={{
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: THEME.WHITE,
            fontSize: '11px',
            fontFamily: THEME.FONT_PRIMARY,
            letterSpacing: '1px',
            width: '100%',
            minWidth: '80px'
          }}
        />
      ) : (
        <span
          style={{
            fontSize: '11px',
            fontFamily: THEME.FONT_PRIMARY,
            color: isActive ? THEME.WHITE : THEME.TEXT_SECONDARY,
            letterSpacing: '1px',
            whiteSpace: 'nowrap',
            flex: 1
          }}
        >
          {name}
        </span>
      )}

      {/* Duration indicator */}
      {duration > 1 && !isEditing && (
        <span
          style={{
            fontSize: '9px',
            fontFamily: THEME.FONT_MONO,
            color: THEME.TEXT_DIM,
            marginLeft: '4px'
          }}
        >
          {duration}h
        </span>
      )}

      {/* Add button */}
      {!isEditing && (
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
      )}

      {/* Resize handle (right edge) */}
      {isActive && !isEditing && (
        <div
          onMouseDown={handleResizeMouseDown}
          style={{
            position: 'absolute',
            right: '0',
            top: '0',
            bottom: '0',
            width: '8px',
            cursor: 'ew-resize',
            borderRadius: '0 20px 20px 0',
            background: isResizing ? 'rgba(212, 115, 12, 0.3)' : 'transparent'
          }}
          title="Drag to adjust duration"
        />
      )}
    </div>
  )
}

export default LessonBubble
