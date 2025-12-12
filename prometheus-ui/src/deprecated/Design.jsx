import { useState, useCallback } from 'react'
import Navigation from '../components/Navigation'
import PKEInterface from '../components/PKEInterface'
import StatusBar from '../components/StatusBar'
import GradientBorder from '../components/GradientBorder'
import pkeButton from '../assets/PKE_Button.png'
import { LAYOUT } from '../constants/layout'

/**
 * Design Page - Course Content Scalar
 * 
 * Phase 1: Static layout with placeholder panels
 * Phase 1 Refinements: Styling, positioning, and interactive states
 * 
 * This page displays the hierarchical course structure:
 * - Course Learning Objectives (CLOs)
 * - Lessons
 * - Topics
 * - Subtopics
 * - Performance Criteria
 * 
 * Doctrinal Compliance: This page only modifies the Content Zone.
 * All frame elements (Header, Navigation, PKE, StatusBar) remain unchanged.
 */
function Design({ onNavigate, courseLoaded, setCourseLoaded }) {
  const [isPKEActive, setIsPKEActive] = useState(false)
  const [selectedModule, setSelectedModule] = useState('1')
  
  // Hover/Focus state management (matching Describe.jsx pattern)
  const [focusedColumn, setFocusedColumn] = useState(null)
  const [hoveredColumn, setHoveredColumn] = useState(null)

  // Clear focus state helper
  const clearFocusState = useCallback(() => {
    setFocusedColumn(null)
  }, [])

  // Navigation handler that deactivates PKE and clears focus
  const handleNavigateWithPKEClose = useCallback((page) => {
    setIsPKEActive(false)
    clearFocusState()
    onNavigate(page)
  }, [onNavigate, clearFocusState])

  // Toggle PKE active state (also clears focus)
  const togglePKE = useCallback(() => {
    setIsPKEActive(prev => {
      if (!prev) clearFocusState() // Clear focus when activating PKE
      return !prev
    })
  }, [clearFocusState])

  // Action button handlers (clear PKE state and focus)
  const handleDelete = useCallback(() => {
    setIsPKEActive(false)
    clearFocusState()
    console.log('Delete action - Design page')
  }, [clearFocusState])

  const handleClear = useCallback(() => {
    setIsPKEActive(false)
    clearFocusState()
    console.log('Clear action - Design page')
  }, [clearFocusState])

  const handleSave = useCallback(() => {
    setIsPKEActive(false)
    clearFocusState()
    console.log('Save action - Design page')
  }, [clearFocusState])

  // Check if a column should show burnt orange (focused OR hovered when not focused elsewhere)
  const isColumnActive = useCallback((columnId) => {
    if (focusedColumn === columnId) return true
    if (focusedColumn === null && hoveredColumn === columnId) return true
    return false
  }, [focusedColumn, hoveredColumn])

  // Get label color based on active state
  const getLabelColor = (columnId, isFirstColumn) => {
    if (isColumnActive(columnId)) return 'text-[#FF6600]'
    if (isFirstColumn) return 'text-[#FF6600]' // First column default orange
    return 'text-[#f2f2f2]'
  }

  // Bottom section Y coordinates (matching Describe.jsx)
  const ABOVE_LINE_BOTTOM = 860
  const BOTTOM_LINE_Y = 875
  const BELOW_LINE_Y = 910  // Status bar at Y=910px (moved up from 915)

  // Column width (all 5 columns = 280px)
  const COLUMN_WIDTH = 280

  // Column definitions with X positions (left edge from centerline)
  // Using calc(50% + Xpx) for positioning
  // Phase 1 Final: All columns shifted -40px left
  const columns = [
    { id: 'clo', label: 'Course Learning Objectives', xOffset: -850 },
    { id: 'lesson', label: 'Lesson', xOffset: -470 },
    { id: 'topic', label: 'Topic', xOffset: -90 },
    { id: 'subtopic', label: 'Subtopic', xOffset: 290 },
    { id: 'pc', label: 'Performance Criteria', xOffset: 670 }
  ]

  // Placeholder data for demonstration
  const placeholderData = {
    clo: ['1. Explain...', '2. Describe...', '3. Analyse'],
    lesson: ['1. Introduction', '2. History', '3. Case Study 1'],
    topic: ['1.1 Overview', '1.2 Relevance', '2.1 The beginnings', '2.2 Famous Cases'],
    subtopic: ['1.1.1 Example 1', '1.1.2 Example 2', '1.1.3 Example 3', '1.2.1 Example 4'],
    pc: ['1.1 Can explain concepts', '1.2 Understands relevance']
  }

  // Font sizes
  // Column label: previous 8pt, +25% = 10pt
  const columnLabelSize = 'text-[10pt]'
  // Base data item was 6pt, +25% = 7.5pt ≈ 7.5pt
  const dataItemSize = 'text-[7.5pt]'
  // Base module label was 8pt, +20% = 9.6pt ≈ 10pt
  const moduleLabelSize = 'text-[10pt]'

  return (
    <>
      {/* Page Title */}
      <div className="flex items-center justify-center gap-3 mb-4 mt-[12px]">
        <h1 className="text-[#f2f2f2] text-xl tracking-[0.3em] font-prometheus uppercase">
          COURSE CONTENT SCALAR
        </h1>
        {/* PKE Button */}
        <img 
          src={pkeButton} 
          alt="PKE" 
          className="w-8 h-8 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={togglePKE}
        />
      </div>

      {/* Import Scalar link (greyed out placeholder) */}
      {/* Refinement #9: Removed horizontal line below this */}
      <div className="flex justify-center mb-4">
        <span className="text-[#767171] text-[8pt] font-prometheus tracking-wider cursor-not-allowed">
          Import Scalar
        </span>
      </div>

      {/* Module Selector - aligned with CLO column at X=-850px */}
      <div 
        className="mb-2 flex items-center gap-2"
        style={{ marginLeft: 'calc(50% - 850px)' }}
      >
        <span className={`text-[#f2f2f2] ${moduleLabelSize} font-prometheus tracking-[0.3em]`}>
          Module:
        </span>
        <select
          value={selectedModule}
          onChange={(e) => setSelectedModule(e.target.value)}
          className={`bg-transparent text-[#f2f2f2] ${moduleLabelSize} font-prometheus tracking-[0.3em] 
                     border-none focus:outline-none cursor-pointer appearance-none`}
          style={{ paddingRight: '0' }}
        >
          <option value="1" className="bg-[#1a1a1a]">1</option>
          <option value="2" className="bg-[#1a1a1a]">2</option>
          <option value="3" className="bg-[#1a1a1a]">3</option>
        </select>
        {/* Single dropdown arrow */}
        <span className="text-[#767171] text-[6pt]">▼</span>
      </div>

      {/* Refinement #10: Horizontal divider below module - burnt orange gradient, center lightest */}
      <div 
        className="w-full h-[1px] mb-4"
        style={{
          background: 'linear-gradient(to right, #3b3838, #767171 25%, #FF6600 50%, #767171 75%, #3b3838)'
        }}
      />

      {/* Column Headers and Panels - Absolute positioned from centerline */}
      <div className="relative flex-1" style={{ minHeight: '400px' }}>
        {columns.map((col, index) => (
          <div 
            key={col.id}
            className="absolute flex flex-col"
            style={{ 
              left: `calc(50% + ${col.xOffset}px)`,
              width: `${COLUMN_WIDTH}px`,
              top: 0
            }}
          >
            {/* Column label - Refinement #6: +35% font size, Refinement #11: renamed first column */}
            <span 
              className={`${columnLabelSize} font-prometheus tracking-wider mb-1 transition-colors ${
                getLabelColor(col.id, index === 0)
              }`}
            >
              {col.label}
            </span>
            
            {/* Column container panel with hover/focus states */}
            {/* Refinement #1: #0d0d0d background */}
            {/* Refinement #2: GradientBorder styling */}
            {/* Refinement #3: Hover/focus burnt orange */}
            {/* Refinement #5: 280px width */}
            <GradientBorder isActive={isColumnActive(col.id)}>
              <div
                className="bg-[#0d0d0d] rounded-[3px] cursor-pointer"
                style={{
                  height: `${LAYOUT.DESIGN_COLUMN_HEIGHT}px`,
                  width: `${COLUMN_WIDTH - 2}px`  /* Adjusted for 1px border */
                }}
                onMouseEnter={() => setHoveredColumn(col.id)}
                onMouseLeave={() => setHoveredColumn(null)}
                onClick={() => setFocusedColumn(col.id)}
                tabIndex={0}
                onFocus={() => setFocusedColumn(col.id)}
                onBlur={() => setFocusedColumn(null)}
              />
            </GradientBorder>

            {/* Data items below panel - Refinement #7: +25% font size */}
            <div 
              className="flex flex-col gap-1 mt-2 overflow-y-auto"
              style={{ maxHeight: `${LAYOUT.DESIGN_CONTENT_HEIGHT - 80}px` }}
            >
              {placeholderData[col.id]?.map((item, idx) => (
                <span 
                  key={idx}
                  className={`${dataItemSize} font-prometheus tracking-wider cursor-pointer 
                             hover:text-[#FF6600] transition-colors ${
                    // First item in first column is "active" (orange)
                    col.id === 'clo' && idx === 0 ? 'text-[#FF6600]' : 'text-[#f2f2f2]'
                  }`}
                >
                  {item}
                </span>
              ))}
              {/* Placeholder indicator */}
              <span className="text-[#767171] text-[5pt] font-prometheus mt-2 italic">
                {col.id === 'clo' ? 'CLO List - Coming Soon' : 'Data - Coming Soon'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ============================================== */}
      {/* BOTTOM SECTION - Fixed Y coordinate positioning */}
      {/* Matching Describe.jsx structure exactly */}
      {/* ============================================== */}
      
      {/* Elements ABOVE the line - bottom edges at Y = 860px */}
      <div 
        className="fixed left-0 right-0 flex items-end justify-between px-[3%]"
        style={{ top: `${ABOVE_LINE_BOTTOM - 120}px`, height: '120px' }}
      >
        {/* Navigation buttons - left side */}
        <div style={{ marginLeft: `${LAYOUT.NAV_LEFT_OFFSET}px` }}>
          <Navigation activePage="design" onNavigate={handleNavigateWithPKEClose} />
        </div>

        {/* Center section: < + > buttons and PKE Interface */}
        <div className="flex flex-col items-center justify-end h-full">
          {/* < + > buttons - 6px above PKE window, shifted 35px right to align with PKE */}
          <div className="flex items-center gap-4 text-[#767171] mb-[6px]" style={{ marginLeft: '35px' }}>
            <button className="hover:text-[#f2f2f2] transition-colors text-xl">&lt;</button>
            <span className="text-sm">+</span>
            <button className="hover:text-[#f2f2f2] transition-colors text-xl">&gt;</button>
          </div>
          
          {/* PKE Interface Window */}
          <PKEInterface 
            isActive={isPKEActive} 
            onClose={() => setIsPKEActive(false)} 
          />
        </div>

        {/* Action buttons - right side */}
        <div className="flex items-end gap-3">
          <button
            onClick={handleDelete}
            className="h-[31px] px-6 rounded-full text-[13px] font-prometheus text-[#f2f2f2] uppercase tracking-wider border border-[#767171] bg-transparent hover:border-[#f2f2f2] transition-all"
          >
            Delete
          </button>
          <button
            onClick={handleClear}
            className="h-[31px] px-6 rounded-full text-[13px] font-prometheus text-[#f2f2f2] uppercase tracking-wider border border-[#767171] bg-transparent hover:border-[#f2f2f2] transition-all"
          >
            Clear
          </button>
          <button
            onClick={handleSave}
            className="h-[31px] px-6 rounded-full text-[13px] font-prometheus text-white uppercase tracking-wider transition-all hover:brightness-110"
            style={{
              background: 'linear-gradient(to bottom, #D65700, #763000)'
            }}
          >
            Save
          </button>
        </div>
      </div>

      {/* Bottom horizontal gradient line at Y = 875px */}
      <div 
        className="fixed left-0 right-0 h-[1px]"
        style={{
          top: `${BOTTOM_LINE_Y}px`,
          background: 'linear-gradient(to right, #ffffff, #767171 46%, #3b3838)'
        }}
      />

      {/* Status bar BELOW the line - positioned at Y = 910px */}
      <div 
        className="fixed left-0 right-0"
        style={{ top: `${BELOW_LINE_Y}px` }}
      >
        <StatusBar courseLoaded={courseLoaded} />
      </div>
    </>
  )
}

export default Design
