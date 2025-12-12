/**
 * OutlinePlanner Page - Slide 4 of Mockup 2.1
 *
 * Layout - Two Regions:
 * - Left: OUTLINE TIMETABLE (time range, hour columns, day rows with bubbles)
 * - Right: ADD TOPICS & SUBTOPICS (lesson details, topics input, LO circles)
 *
 * Features:
 * - Draggable lesson bubbles within timetable grid
 * - Time range selector
 * - Hierarchical topic/subtopic structure
 */

import { useState, useCallback } from 'react'
import { THEME } from '../constants/theme'
import NavWheel from '../components/NavWheel'
import LessonBubble from '../components/LessonBubble'
import GradientBorder from '../components/GradientBorder'
import StatusBar from '../components/StatusBar'
import PKEInterface from '../components/PKEInterface'
import pkeButton from '../assets/PKE_Button.png'

function OutlinePlanner({ onNavigate, courseData, courseLoaded }) {
  const [isPKEActive, setIsPKEActive] = useState(false)
  const [wheelExpanded, setWheelExpanded] = useState(false)
  const [selectedBubble, setSelectedBubble] = useState('intro')

  // Time range
  const [startTime, setStartTime] = useState(8) // 0800
  const [endTime, setEndTime] = useState(16) // 1600

  // Lesson bubbles organized by day
  const [lessonsByDay, setLessonsByDay] = useState({
    1: [{ id: 'intro', name: 'INTRODUCTION', column: 0 }],
    2: [],
    3: [],
    4: [],
    5: []
  })

  // Selected lesson details
  const [lessonDetails, setLessonDetails] = useState({
    name: 'INTRODUCTION',
    topics: [{ id: 't1', name: '', lo: [1] }],
    subtopics: [{ id: 'st1', name: '', parentTopic: 't1' }]
  })

  // Hours array based on start/end time
  const hours = []
  for (let h = startTime; h < endTime; h++) {
    hours.push(`${h.toString().padStart(2, '0')}00`)
  }

  // Number of days (from course duration, default 5)
  const numDays = courseData?.duration || 5

  // Handle bubble selection
  const handleSelectBubble = useCallback((id) => {
    setSelectedBubble(id)
    // Find bubble and update lesson details
    Object.values(lessonsByDay).forEach(dayBubbles => {
      const bubble = dayBubbles.find(b => b.id === id)
      if (bubble) {
        setLessonDetails(prev => ({ ...prev, name: bubble.name }))
      }
    })
  }, [lessonsByDay])

  // Add new bubble
  const handleAddBubble = useCallback((afterId) => {
    const newId = `lesson-${Date.now()}`
    const newBubble = { id: newId, name: 'NEW LESSON', column: 1 }

    // Find which day has this bubble and add after it
    setLessonsByDay(prev => {
      const updated = { ...prev }
      Object.keys(updated).forEach(day => {
        const idx = updated[day].findIndex(b => b.id === afterId)
        if (idx !== -1) {
          updated[day] = [
            ...updated[day].slice(0, idx + 1),
            newBubble,
            ...updated[day].slice(idx + 1)
          ]
        }
      })
      return updated
    })
  }, [])

  // Handle drop on day row
  const handleDrop = useCallback((e, targetDay) => {
    e.preventDefault()
    const bubbleId = e.dataTransfer.getData('bubbleId')

    setLessonsByDay(prev => {
      const updated = { ...prev }
      let movedBubble = null

      // Remove from current location
      Object.keys(updated).forEach(day => {
        const idx = updated[day].findIndex(b => b.id === bubbleId)
        if (idx !== -1) {
          movedBubble = updated[day][idx]
          updated[day] = updated[day].filter(b => b.id !== bubbleId)
        }
      })

      // Add to target day
      if (movedBubble) {
        updated[targetDay] = [...updated[targetDay], movedBubble]
      }

      return updated
    })
  }, [])

  // Add topic
  const addTopic = useCallback(() => {
    const newTopic = { id: `t${Date.now()}`, name: '', lo: [] }
    setLessonDetails(prev => ({
      ...prev,
      topics: [...prev.topics, newTopic]
    }))
  }, [])

  // Add subtopic
  const addSubtopic = useCallback(() => {
    const parentTopic = lessonDetails.topics[lessonDetails.topics.length - 1]?.id || 't1'
    const newSubtopic = { id: `st${Date.now()}`, name: '', parentTopic }
    setLessonDetails(prev => ({
      ...prev,
      subtopics: [...prev.subtopics, newSubtopic]
    }))
  }, [lessonDetails.topics])

  // Toggle LO assignment
  const toggleLO = useCallback((topicIdx, loNum) => {
    setLessonDetails(prev => {
      const updatedTopics = [...prev.topics]
      const topic = updatedTopics[topicIdx]
      if (topic.lo.includes(loNum)) {
        topic.lo = topic.lo.filter(n => n !== loNum)
      } else {
        topic.lo = [...topic.lo, loNum]
      }
      return { ...prev, topics: updatedTopics }
    })
  }, [])

  // Handle navigation
  const handleNavigate = useCallback((section) => {
    setWheelExpanded(false)
    onNavigate?.(section)
  }, [onNavigate])

  // Build structure display
  const buildStructureText = () => {
    const parts = [`1. ${lessonDetails.name}`]
    lessonDetails.topics.forEach((t, ti) => {
      if (t.name) parts.push(`→ ${ti + 1}.1 ${t.name}`)
    })
    lessonDetails.subtopics.forEach((st, sti) => {
      if (st.name) parts.push(`→ 1.1.${sti + 1} ${st.name}`)
    })
    return parts.join(' ')
  }

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
          gap: '12px',
          padding: '20px 0'
        }}
      >
        <h1
          style={{
            fontSize: '18px',
            letterSpacing: '6px',
            color: THEME.OFF_WHITE,
            fontFamily: THEME.FONT_PRIMARY
          }}
        >
          OUTLINE PLANNER
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

      {/* Main Content - Two Panels */}
      <div
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '30px',
          padding: '0 40px',
          paddingBottom: '180px'
        }}
      >
        {/* LEFT PANEL - OUTLINE TIMETABLE */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={sectionHeaderStyle}>OUTLINE TIMETABLE</h2>
            <span style={{ fontSize: '10px', color: THEME.TEXT_DIM, fontFamily: THEME.FONT_MONO }}>
              SET TIMES
            </span>
          </div>

          {/* Time Range Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
            <span style={{ fontSize: '11px', color: THEME.TEXT_SECONDARY, fontFamily: THEME.FONT_MONO }}>
              {startTime.toString().padStart(2, '0')}00
            </span>
            <input
              type="range"
              min={6}
              max={10}
              value={startTime}
              onChange={(e) => setStartTime(parseInt(e.target.value))}
              style={{ flex: 1, maxWidth: '200px' }}
            />
            <span style={{ color: THEME.TEXT_DIM }}>←→</span>
            <input
              type="range"
              min={14}
              max={20}
              value={endTime}
              onChange={(e) => setEndTime(parseInt(e.target.value))}
              style={{ flex: 1, maxWidth: '200px' }}
            />
            <span style={{ fontSize: '11px', color: THEME.TEXT_SECONDARY, fontFamily: THEME.FONT_MONO }}>
              {endTime.toString().padStart(2, '0')}00
            </span>
          </div>

          {/* Timetable Grid */}
          <div
            style={{
              background: THEME.BG_INPUT,
              border: `1px solid ${THEME.BORDER}`,
              borderRadius: '4px',
              overflow: 'hidden'
            }}
          >
            {/* Hour Headers */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: `80px repeat(${hours.length}, 1fr)`,
                borderBottom: `1px solid ${THEME.BORDER}`
              }}
            >
              <div style={headerCellStyle} />
              {hours.map(hour => (
                <div key={hour} style={headerCellStyle}>
                  {hour}
                </div>
              ))}
            </div>

            {/* Day Rows */}
            {Array.from({ length: numDays }, (_, i) => i + 1).map(day => (
              <div
                key={day}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, day)}
                style={{
                  display: 'grid',
                  gridTemplateColumns: `80px 1fr`,
                  minHeight: '60px',
                  borderBottom: day < numDays ? `1px solid ${THEME.BORDER}` : 'none'
                }}
              >
                <div style={dayCellStyle}>Day {day}</div>
                <div
                  style={{
                    padding: '8px 12px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px',
                    alignItems: 'center'
                  }}
                >
                  {lessonsByDay[day]?.map(bubble => (
                    <LessonBubble
                      key={bubble.id}
                      id={bubble.id}
                      name={bubble.name}
                      isSelected={selectedBubble === bubble.id}
                      onSelect={handleSelectBubble}
                      onAdd={handleAddBubble}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT PANEL - ADD TOPICS & SUBTOPICS */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={sectionHeaderStyle}>ADD TOPICS & SUBTOPICS</h2>
            <span style={{ fontSize: '10px', color: THEME.AMBER, fontFamily: THEME.FONT_MONO }}>
              Module: 1
            </span>
          </div>

          {/* Import Button */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
            <button style={importButtonStyle}>IMPORT</button>
            <GradientBorder isActive={false} className="flex-1">
              <input
                type="text"
                placeholder="Import from scalar..."
                style={inputStyle}
              />
            </GradientBorder>
          </div>

          {/* Lesson Name */}
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>LESSON</label>
            <div style={{ fontSize: '14px', color: THEME.AMBER, fontFamily: THEME.FONT_PRIMARY }}>
              {lessonDetails.name}
            </div>
          </div>

          {/* Topics */}
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>TOPICS</label>
            {lessonDetails.topics.map((topic, idx) => (
              <div key={topic.id} style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                  <GradientBorder isActive={false} className="flex-1">
                    <input
                      type="text"
                      value={topic.name}
                      onChange={(e) => {
                        const updated = [...lessonDetails.topics]
                        updated[idx].name = e.target.value
                        setLessonDetails(prev => ({ ...prev, topics: updated }))
                      }}
                      placeholder="Enter topic..."
                      style={inputStyle}
                    />
                  </GradientBorder>
                  {idx === lessonDetails.topics.length - 1 && (
                    <button onClick={addTopic} style={addButtonStyle}>+</button>
                  )}
                </div>

                {/* LO Circles */}
                <div style={{ display: 'flex', gap: '6px', marginLeft: '8px' }}>
                  <span style={{ fontSize: '9px', color: THEME.TEXT_DIM, marginRight: '4px' }}>LO:</span>
                  {[1, 2, 3, 4, 5].map(lo => (
                    <div
                      key={lo}
                      onClick={() => toggleLO(idx, lo)}
                      style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        background: topic.lo.includes(lo) ? THEME.AMBER : 'transparent',
                        border: `1px solid ${topic.lo.includes(lo) ? THEME.AMBER : THEME.BORDER_GREY}`,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Subtopics */}
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>SUBTOPICS</label>
            {lessonDetails.subtopics.map((subtopic, idx) => (
              <div key={subtopic.id} style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                <GradientBorder isActive={false} className="flex-1">
                  <input
                    type="text"
                    value={subtopic.name}
                    onChange={(e) => {
                      const updated = [...lessonDetails.subtopics]
                      updated[idx].name = e.target.value
                      setLessonDetails(prev => ({ ...prev, subtopics: updated }))
                    }}
                    placeholder="Enter subtopic..."
                    style={inputStyle}
                  />
                </GradientBorder>
                {idx === lessonDetails.subtopics.length - 1 && (
                  <button onClick={addSubtopic} style={addButtonStyle}>+</button>
                )}
              </div>
            ))}
          </div>

          {/* Structure Preview */}
          <div
            style={{
              padding: '12px',
              background: THEME.BG_INPUT,
              border: `1px solid ${THEME.BORDER}`,
              borderRadius: '4px',
              marginTop: 'auto'
            }}
          >
            <span style={{ fontSize: '10px', color: THEME.AMBER, fontFamily: THEME.FONT_MONO }}>
              {buildStructureText()}
            </span>
          </div>
        </div>
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
const sectionHeaderStyle = {
  fontSize: '12px',
  letterSpacing: '3px',
  color: THEME.AMBER,
  fontFamily: THEME.FONT_PRIMARY
}

const headerCellStyle = {
  padding: '10px 8px',
  fontSize: '10px',
  color: THEME.TEXT_DIM,
  fontFamily: THEME.FONT_MONO,
  textAlign: 'center',
  borderRight: `1px solid ${THEME.BORDER}`
}

const dayCellStyle = {
  padding: '10px 12px',
  fontSize: '11px',
  color: THEME.TEXT_SECONDARY,
  fontFamily: THEME.FONT_PRIMARY,
  borderRight: `1px solid ${THEME.BORDER}`,
  display: 'flex',
  alignItems: 'center'
}

const labelStyle = {
  display: 'block',
  fontSize: '10px',
  letterSpacing: '2px',
  color: THEME.TEXT_DIM,
  fontFamily: THEME.FONT_PRIMARY,
  marginBottom: '8px'
}

const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  background: THEME.BG_INPUT,
  border: 'none',
  borderRadius: '3px',
  color: THEME.TEXT_PRIMARY,
  fontSize: '11px',
  fontFamily: THEME.FONT_MONO,
  outline: 'none'
}

const addButtonStyle = {
  width: '28px',
  height: '28px',
  borderRadius: '50%',
  background: THEME.AMBER_DARK,
  border: 'none',
  color: THEME.WHITE,
  fontSize: '14px',
  cursor: 'pointer',
  flexShrink: 0
}

const importButtonStyle = {
  padding: '10px 20px',
  fontSize: '10px',
  letterSpacing: '2px',
  fontFamily: THEME.FONT_PRIMARY,
  background: 'transparent',
  border: `1px solid ${THEME.BORDER}`,
  borderRadius: '3px',
  color: THEME.TEXT_DIM,
  cursor: 'pointer'
}

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

export default OutlinePlanner
