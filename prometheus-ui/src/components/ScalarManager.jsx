/**
 * ScalarManager - Three-column hierarchical editor
 *
 * Columns:
 * 1. Learning Objectives
 * 2. Topics
 * 3. Subtopics
 *
 * Features:
 * - Click LO to see its Topics
 * - Click Topic to see its Subtopics
 * - Auto-numbering (1, 1.1, 1.1.1)
 * - Add new items with "+" button
 */

import { useState, useCallback } from 'react'
import { THEME } from '../constants/theme'
import GradientBorder from './GradientBorder'

function ScalarManager({ data, onChange }) {
  const [selectedLO, setSelectedLO] = useState(0)
  const [selectedTopic, setSelectedTopic] = useState(0)
  const [focusedField, setFocusedField] = useState(null)

  // Default data structure
  const [scalarData, setScalarData] = useState(data || {
    learningObjectives: [
      { id: 1, text: 'EXPLAIN something...' },
      { id: 2, text: '' },
      { id: 3, text: '' },
      { id: 4, text: '' },
      { id: 5, text: 'DESCRIBE something...' }
    ],
    topics: {
      1: [
        { id: '1.1', text: 'Fundamentals...' },
        { id: '1.2', text: 'Separate key...' },
        { id: '1.3', text: '' }
      ],
      2: [],
      3: [],
      4: [],
      5: []
    },
    subtopics: {
      '1.1': [
        { id: '1.1.1', text: 'Introduction...' },
        { id: '1.1.2', text: '' },
        { id: '1.1.3', text: '' }
      ],
      '1.2': [
        { id: '1.2.1', text: 'History...' },
        { id: '1.2.2', text: '' }
      ],
      '1.3': [
        { id: '1.3.1', text: 'Fundamentals...' },
        { id: '1.3.2', text: '' },
        { id: '1.3.3', text: '' }
      ]
    }
  })

  // Get topics for selected LO
  const currentTopics = scalarData.topics[selectedLO + 1] || []

  // Get subtopics for selected topic
  const currentTopicId = currentTopics[selectedTopic]?.id
  const currentSubtopics = currentTopicId ? (scalarData.subtopics[currentTopicId] || []) : []

  // Update LO text
  const updateLO = useCallback((idx, text) => {
    setScalarData(prev => {
      const updated = { ...prev }
      updated.learningObjectives[idx].text = text
      return updated
    })
  }, [])

  // Update topic text
  const updateTopic = useCallback((idx, text) => {
    setScalarData(prev => {
      const updated = { ...prev }
      const loId = selectedLO + 1
      if (updated.topics[loId]) {
        updated.topics[loId][idx].text = text
      }
      return updated
    })
  }, [selectedLO])

  // Update subtopic text
  const updateSubtopic = useCallback((idx, text) => {
    setScalarData(prev => {
      const updated = { ...prev }
      const topicId = currentTopics[selectedTopic]?.id
      if (topicId && updated.subtopics[topicId]) {
        updated.subtopics[topicId][idx].text = text
      }
      return updated
    })
  }, [currentTopics, selectedTopic])

  // Add new LO
  const addLO = useCallback(() => {
    setScalarData(prev => {
      const newId = prev.learningObjectives.length + 1
      return {
        ...prev,
        learningObjectives: [...prev.learningObjectives, { id: newId, text: '' }],
        topics: { ...prev.topics, [newId]: [] }
      }
    })
  }, [])

  // Add new topic
  const addTopic = useCallback(() => {
    setScalarData(prev => {
      const loId = selectedLO + 1
      const topics = prev.topics[loId] || []
      const newNum = topics.length + 1
      const newId = `${loId}.${newNum}`
      return {
        ...prev,
        topics: {
          ...prev.topics,
          [loId]: [...topics, { id: newId, text: '' }]
        },
        subtopics: {
          ...prev.subtopics,
          [newId]: []
        }
      }
    })
  }, [selectedLO])

  // Add new subtopic
  const addSubtopic = useCallback(() => {
    const topicId = currentTopics[selectedTopic]?.id
    if (!topicId) return

    setScalarData(prev => {
      const subtopics = prev.subtopics[topicId] || []
      const newNum = subtopics.length + 1
      const newId = `${topicId}.${newNum}`
      return {
        ...prev,
        subtopics: {
          ...prev.subtopics,
          [topicId]: [...subtopics, { id: newId, text: '' }]
        }
      }
    })
  }, [currentTopics, selectedTopic])

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '24px',
        height: '100%'
      }}
    >
      {/* LEARNING OBJECTIVES Column */}
      <div style={columnStyle}>
        <h3 style={columnHeaderStyle}>LEARNING OBJECTIVES</h3>
        <div style={columnContentStyle}>
          {scalarData.learningObjectives.map((lo, idx) => {
            const isSelected = selectedLO === idx
            const isActive = focusedField === `lo-${idx}`
            return (
              <div
                key={lo.id}
                onClick={() => setSelectedLO(idx)}
                style={{
                  ...itemRowStyle,
                  background: isSelected ? 'rgba(212, 115, 12, 0.1)' : 'transparent'
                }}
              >
                <span style={{ ...numberStyle, color: isSelected ? THEME.AMBER : THEME.TEXT_DIM }}>
                  {lo.id}
                </span>
                <GradientBorder isActive={isActive || isSelected} className="flex-1">
                  <input
                    type="text"
                    value={lo.text}
                    onChange={(e) => updateLO(idx, e.target.value)}
                    onFocus={() => setFocusedField(`lo-${idx}`)}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Enter LO..."
                    style={inputStyle}
                  />
                </GradientBorder>
              </div>
            )
          })}
          <button onClick={addLO} style={addRowButtonStyle}>
            <span style={{ marginRight: '8px' }}>+</span> Add LO
          </button>
        </div>
      </div>

      {/* TOPICS Column */}
      <div style={columnStyle}>
        <h3 style={columnHeaderStyle}>TOPICS</h3>
        <div style={columnContentStyle}>
          {currentTopics.map((topic, idx) => {
            const isSelected = selectedTopic === idx
            const isActive = focusedField === `topic-${idx}`
            return (
              <div
                key={topic.id}
                onClick={() => setSelectedTopic(idx)}
                style={{
                  ...itemRowStyle,
                  background: isSelected ? 'rgba(212, 115, 12, 0.1)' : 'transparent'
                }}
              >
                <span style={{ ...numberStyle, color: isSelected ? THEME.AMBER : THEME.TEXT_DIM }}>
                  {topic.id}
                </span>
                <GradientBorder isActive={isActive || isSelected} className="flex-1">
                  <input
                    type="text"
                    value={topic.text}
                    onChange={(e) => updateTopic(idx, e.target.value)}
                    onFocus={() => setFocusedField(`topic-${idx}`)}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Enter topic..."
                    style={inputStyle}
                  />
                </GradientBorder>
              </div>
            )
          })}
          {currentTopics.length === 0 && (
            <div style={{ color: THEME.TEXT_DIM, fontSize: '10px', padding: '12px', fontStyle: 'italic' }}>
              Select an LO to view topics
            </div>
          )}
          <button onClick={addTopic} style={addRowButtonStyle}>
            <span style={{ marginRight: '8px' }}>+</span> Add Topic
          </button>
        </div>
      </div>

      {/* SUBTOPICS Column */}
      <div style={columnStyle}>
        <h3 style={columnHeaderStyle}>SUB TOPICS</h3>
        <div style={columnContentStyle}>
          {currentSubtopics.map((subtopic, idx) => {
            const isActive = focusedField === `subtopic-${idx}`
            return (
              <div key={subtopic.id} style={itemRowStyle}>
                <span style={{ ...numberStyle, color: THEME.TEXT_DIM }}>
                  {subtopic.id}
                </span>
                <GradientBorder isActive={isActive} className="flex-1">
                  <input
                    type="text"
                    value={subtopic.text}
                    onChange={(e) => updateSubtopic(idx, e.target.value)}
                    onFocus={() => setFocusedField(`subtopic-${idx}`)}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Enter subtopic..."
                    style={inputStyle}
                  />
                </GradientBorder>
              </div>
            )
          })}
          {currentSubtopics.length === 0 && currentTopics.length > 0 && (
            <div style={{ color: THEME.TEXT_DIM, fontSize: '10px', padding: '12px', fontStyle: 'italic' }}>
              Select a topic to view subtopics
            </div>
          )}
          <button onClick={addSubtopic} style={addRowButtonStyle}>
            <span style={{ marginRight: '8px' }}>+</span> Add Subtopic
          </button>
        </div>
      </div>
    </div>
  )
}

// Styles
const columnStyle = {
  display: 'flex',
  flexDirection: 'column',
  background: THEME.BG_INPUT,
  border: `1px solid ${THEME.BORDER}`,
  borderRadius: '4px',
  overflow: 'hidden'
}

const columnHeaderStyle = {
  fontSize: '10px',
  letterSpacing: '2px',
  color: THEME.TEXT_SECONDARY,
  fontFamily: THEME.FONT_PRIMARY,
  padding: '12px 16px',
  borderBottom: `1px solid ${THEME.BORDER}`,
  background: THEME.BG_DARK
}

const columnContentStyle = {
  flex: 1,
  padding: '8px',
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '6px'
}

const itemRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '4px 8px',
  borderRadius: '3px',
  cursor: 'pointer',
  transition: 'background 0.2s ease'
}

const numberStyle = {
  fontSize: '11px',
  fontFamily: THEME.FONT_MONO,
  minWidth: '40px'
}

const inputStyle = {
  width: '100%',
  padding: '8px 10px',
  background: 'transparent',
  border: 'none',
  borderRadius: '3px',
  color: THEME.TEXT_PRIMARY,
  fontSize: '11px',
  fontFamily: THEME.FONT_MONO,
  outline: 'none'
}

const addRowButtonStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '10px',
  marginTop: '8px',
  background: 'transparent',
  border: `1px dashed ${THEME.BORDER}`,
  borderRadius: '3px',
  color: THEME.TEXT_DIM,
  fontSize: '10px',
  fontFamily: THEME.FONT_PRIMARY,
  cursor: 'pointer',
  transition: 'all 0.2s ease'
}

export default ScalarManager
