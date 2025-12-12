/**
 * ScalarViewer - Five-column read-only table view
 *
 * Columns:
 * 1. Learning Objective
 * 2. Lesson
 * 3. Topic
 * 4. Subtopic
 * 5. Performance Criteria
 *
 * Features:
 * - Read-only display
 * - Module dropdown
 * - Hierarchical relationship display
 */

import { useState } from 'react'
import { THEME } from '../constants/theme'

function ScalarViewer({ data, selectedModule = 1 }) {
  // Sample data for display
  const viewerData = data || {
    learningObjectives: [
      { num: 1, text: 'Explain the fundamental concepts and principles' },
      { num: 2, text: 'Describe historical context and development' },
      { num: 3, text: 'Analyse case studies and applications' }
    ],
    lessons: [
      { num: 1, text: 'Introduction' },
      { num: 2, text: 'History' },
      { num: 3, text: 'Case Study 1' }
    ],
    topics: [
      { num: '1.1', text: 'Overview' },
      { num: '1.2', text: 'Relevance' },
      { num: '2.1', text: 'The Beginnings' },
      { num: '2.2', text: 'Famous Cases' }
    ],
    subtopics: [
      { num: '1.1.1', text: 'Example 1' },
      { num: '1.1.2', text: 'Example 2' },
      { num: '1.1.3', text: 'Example 3' },
      { num: '1.2.1', text: 'Example 4' },
      { num: '1.2.2', text: 'Example 5' }
    ],
    performanceCriteria: [
      { num: '1.1', text: 'Can explain concepts' },
      { num: '1.2', text: 'Understands relevance' }
    ]
  }

  // Find max rows needed
  const maxRows = Math.max(
    viewerData.learningObjectives.length,
    viewerData.lessons.length,
    viewerData.topics.length,
    viewerData.subtopics.length,
    viewerData.performanceCriteria.length
  )

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: THEME.BG_INPUT,
        border: `1px solid ${THEME.BORDER}`,
        borderRadius: '4px',
        overflow: 'hidden'
      }}
    >
      {/* Header Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          borderBottom: `1px solid ${THEME.BORDER}`,
          background: THEME.BG_DARK
        }}
      >
        <div style={headerCellStyle}>Learning Objective</div>
        <div style={headerCellStyle}>Lesson</div>
        <div style={headerCellStyle}>Topic</div>
        <div style={headerCellStyle}>Subtopic</div>
        <div style={headerCellStyle}>Performance Criteria</div>
      </div>

      {/* Data Rows */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {Array.from({ length: maxRows }, (_, rowIdx) => (
          <div
            key={rowIdx}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              borderBottom: rowIdx < maxRows - 1 ? `1px solid ${THEME.BORDER}` : 'none'
            }}
          >
            {/* Learning Objective */}
            <div style={dataCellStyle}>
              {viewerData.learningObjectives[rowIdx] && (
                <>
                  <span style={numberStyle}>{viewerData.learningObjectives[rowIdx].num}.</span>
                  <span style={textStyle}>{viewerData.learningObjectives[rowIdx].text}</span>
                </>
              )}
            </div>

            {/* Lesson */}
            <div style={dataCellStyle}>
              {viewerData.lessons[rowIdx] && (
                <>
                  <span style={numberStyle}>{viewerData.lessons[rowIdx].num}.</span>
                  <span style={textStyle}>{viewerData.lessons[rowIdx].text}</span>
                </>
              )}
            </div>

            {/* Topic */}
            <div style={dataCellStyle}>
              {viewerData.topics[rowIdx] && (
                <>
                  <span style={numberStyle}>{viewerData.topics[rowIdx].num}</span>
                  <span style={textStyle}>{viewerData.topics[rowIdx].text}</span>
                </>
              )}
            </div>

            {/* Subtopic */}
            <div style={dataCellStyle}>
              {viewerData.subtopics[rowIdx] && (
                <>
                  <span style={{ ...numberStyle, color: THEME.AMBER }}>{viewerData.subtopics[rowIdx].num}</span>
                  <span style={textStyle}>{viewerData.subtopics[rowIdx].text}</span>
                </>
              )}
            </div>

            {/* Performance Criteria */}
            <div style={dataCellStyle}>
              {viewerData.performanceCriteria[rowIdx] && (
                <>
                  <span style={numberStyle}>{viewerData.performanceCriteria[rowIdx].num}</span>
                  <span style={textStyle}>{viewerData.performanceCriteria[rowIdx].text}</span>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Styles
const headerCellStyle = {
  padding: '12px 16px',
  fontSize: '9px',
  letterSpacing: '1px',
  color: THEME.TEXT_DIM,
  fontFamily: THEME.FONT_PRIMARY,
  textTransform: 'uppercase',
  borderRight: `1px solid ${THEME.BORDER}`
}

const dataCellStyle = {
  padding: '10px 12px',
  fontSize: '10px',
  color: THEME.TEXT_PRIMARY,
  fontFamily: THEME.FONT_MONO,
  borderRight: `1px solid ${THEME.BORDER}`,
  display: 'flex',
  flexDirection: 'column',
  gap: '2px'
}

const numberStyle = {
  fontSize: '9px',
  color: THEME.TEXT_DIM,
  marginRight: '6px'
}

const textStyle = {
  fontSize: '10px',
  color: THEME.TEXT_SECONDARY,
  lineHeight: '1.4'
}

export default ScalarViewer
