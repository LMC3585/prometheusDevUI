import { useState, useCallback } from 'react'
import Navigation from '../components/Navigation'
import PKEInterface from '../components/PKEInterface'
import StatusBar from '../components/StatusBar'
import GradientBorder from '../components/GradientBorder'
import pkeButton from '../assets/PKE_Button.png'
import { LAYOUT } from '../constants/layout'

function Describe({ onNavigate, courseLoaded, setCourseLoaded }) {
  const [isPKEActive, setIsPKEActive] = useState(false)

  // D7: Track LOAD button active state
  const [isLoadActive, setIsLoadActive] = useState(false)

  // B10: Track focused and hovered field for burnt orange effect
  const [focusedField, setFocusedField] = useState(null)
  const [hoveredField, setHoveredField] = useState(null)
  
  const [formData, setFormData] = useState({
    title: '',
    level: '',
    seniorCourse: false,  // C5: Senior Course Y/N toggle
    thematic: '',
    duration: '',
    code: '',
    developer: '',
    selectedCourse: '',
    description: ''
  })

  // Stable handler using useCallback to prevent re-renders
  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }, [])

  // B10: Clear focus state helper
  const clearFocusState = useCallback(() => {
    setFocusedField(null)
  }, [])

  // B10: Handle field focus
  const handleFieldFocus = useCallback((field) => {
    setFocusedField(field)
  }, [])

  // B10: Handle field blur
  const handleFieldBlur = useCallback(() => {
    setFocusedField(null)
  }, [])

  // B10: Handle key events (Escape, Enter clear focus)
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape' || e.key === 'Enter') {
      e.target.blur()
      setFocusedField(null)
    }
  }, [])

  // Deactivate PKE, clear focus, and activate LOAD button on load
  const handleLoad = useCallback(() => {
    setCourseLoaded(true)
    setIsPKEActive(false)
    setIsLoadActive(true)  // D7: Activate LOAD button
    clearFocusState()
  }, [setCourseLoaded, clearFocusState])

  // Deactivate PKE, clear focus, and deactivate LOAD button on clear
  const handleClear = useCallback(() => {
    setCourseLoaded(false)
    setIsPKEActive(false)
    setIsLoadActive(false)  // D7: Deactivate LOAD button
    clearFocusState()
    setFormData({
      title: '',
      level: '',
      seniorCourse: false,
      thematic: '',
      duration: '',
      code: '',
      developer: '',
      selectedCourse: '',
      description: ''
    })
  }, [setCourseLoaded, clearFocusState])

  // Deactivate PKE, clear focus, and deactivate LOAD button on save
  const handleSave = useCallback(() => {
    console.log('Saving course data:', formData)
    setIsPKEActive(false)
    setIsLoadActive(false)  // D7: Deactivate LOAD button
    clearFocusState()
  }, [formData, clearFocusState])

  // Deactivate PKE, clear focus, and deactivate LOAD button on delete
  const handleDelete = useCallback(() => {
    setIsPKEActive(false)
    setIsLoadActive(false)  // D7: Deactivate LOAD button
    clearFocusState()
    handleClear()
  }, [handleClear, clearFocusState])

  // Navigation handler that deactivates PKE and clears focus
  const handleNavigateWithPKEClose = useCallback((page) => {
    setIsPKEActive(false)
    clearFocusState()
    onNavigate(page)
  }, [onNavigate, clearFocusState])

  // Toggle PKE active state
  const togglePKE = useCallback(() => {
    setIsPKEActive(prev => !prev)
  }, [])

  // B10: Check if a field should show burnt orange (focused OR hovered when not focused elsewhere)
  const isFieldActive = useCallback((field) => {
    if (focusedField === field) return true
    if (focusedField === null && hoveredField === field) return true
    return false
  }, [focusedField, hoveredField])

  // Sizing constants from layout.js
  const labelFontSize = 'text-[15px]'

  // Level dropdown options (5 options per C1 refinement)
  const levelOptions = [
    { value: '', label: 'Select...' },
    { value: 'awareness', label: 'Awareness' },
    { value: 'foundational', label: 'Foundational' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'expert', label: 'Expert' }
  ]

  // Thematic dropdown options (7 options)
  const thematicOptions = [
    { value: '', label: 'Select...' },
    { value: 'defence-security', label: 'Defence & Security' },
    { value: 'intelligence', label: 'Intelligence' },
    { value: 'policing', label: 'Policing' },
    { value: 'leadership-management', label: 'Leadership & Management' },
    { value: 'crisis-response', label: 'Crisis Response' },
    { value: 'resilience', label: 'Resilience' },
    { value: 'personal-skills', label: 'Personal Skills' }
  ]

  // B10: Get label color based on active state
  const getLabelColor = (field) => {
    return isFieldActive(field) ? 'text-[#FF6600]' : 'text-[#f2f2f2]'
  }

  // Calculate positions from centerline
  const leftFormRightEdge = LAYOUT.LEFT_FORM_RIGHT_EDGE  // -95
  const descriptionLeftEdge = LAYOUT.RIGHT_FORM_LEFT_EDGE  // +95

  // Bottom section Y coordinates (fixed positioning from viewport top)
  const ABOVE_LINE_BOTTOM = 860  // Elements above line - bottom edge Y
  const BOTTOM_LINE_Y = 875      // Horizontal line top edge
  const BELOW_LINE_Y = 910       // Status bar content Y plane (moved up from 915)

  return (
    <>
      {/* Page Title */}
      <div className="flex items-center justify-center gap-3 mb-6 mt-[12px]">
        <h1 className="text-[#f2f2f2] text-xl tracking-[0.3em] font-prometheus uppercase">
          COURSE INFORMATION
        </h1>
        {/* PKE Button */}
        <img 
          src={pkeButton} 
          alt="PKE" 
          className="w-8 h-8 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={togglePKE}
        />
      </div>

      {/* Main Content Area - Using absolute positioning from centerline */}
      <div className="flex-1 relative" style={{ marginTop: `${LAYOUT.FORM_TOP_OFFSET}px` }}>
        
        {/* Left Side - Form Fields */}
        <div
          className="absolute"
          style={{
            right: `calc(50% - ${leftFormRightEdge}px)`,
            top: 0
          }}
        >
          {/* Row-based layout: each row is a flex container with label + input */}
          <div className="flex flex-col" style={{ gap: `${LAYOUT.ROW_GAP}px` }}>

            {/* Row 1: Title */}
            <div className="flex items-center">
              <label
                className={`${getLabelColor('title')} ${labelFontSize} font-prometheus transition-colors text-right pr-4`}
                style={{ width: `${LAYOUT.LABEL_WIDTH}px` }}
              >
                Title:
              </label>
              <GradientBorder isActive={isFieldActive('title')} className={`w-[${LAYOUT.INPUT_WIDTH}px]`}>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  onFocus={() => handleFieldFocus('title')}
                  onBlur={handleFieldBlur}
                  onKeyDown={handleKeyDown}
                  onMouseEnter={() => setHoveredField('title')}
                  onMouseLeave={() => setHoveredField(null)}
                  className={`w-full h-[${LAYOUT.INPUT_HEIGHT}px] bg-[#0d0d0d] text-[#f2f2f2] text-[13px] px-4 rounded-[3px] focus:outline-none font-cascadia`}
                  style={{ border: 'none', boxShadow: 'none', outline: 'none' }}
                />
              </GradientBorder>
            </div>

            {/* Row 2: Level + Senior Course */}
            <div className="flex items-center">
              <label
                className={`${getLabelColor('level')} ${labelFontSize} font-prometheus transition-colors text-right pr-4`}
                style={{ width: `${LAYOUT.LABEL_WIDTH}px` }}
              >
                Level:
              </label>
              <div className="flex items-center gap-4">
                <GradientBorder isActive={isFieldActive('level')} className="w-[190px]">
                  <select
                    value={formData.level}
                    onChange={(e) => handleInputChange('level', e.target.value)}
                    onFocus={() => handleFieldFocus('level')}
                    onBlur={handleFieldBlur}
                    onKeyDown={handleKeyDown}
                    onMouseEnter={() => setHoveredField('level')}
                    onMouseLeave={() => setHoveredField(null)}
                    className={`w-full h-[${LAYOUT.INPUT_HEIGHT}px] bg-[#0d0d0d] text-[#f2f2f2] text-[13px] px-4 rounded-[3px] focus:outline-none font-cascadia cursor-pointer`}
                    style={{ border: 'none', boxShadow: 'none', outline: 'none' }}
                  >
                    {levelOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </GradientBorder>

                {/* C5: Senior Course Y/N Radio Toggle - shifted 30px right per Part C */}
                <div className="flex items-center gap-2 ml-[30px]">
                  <span className="text-[#f2f2f2] text-[13px] font-prometheus">Senior Course Y / N</span>
                  <button
                    type="button"
                    onClick={() => handleInputChange('seniorCourse', !formData.seniorCourse)}
                    className={`w-[40px] h-[22px] rounded-full transition-all duration-200 relative ${
                      formData.seniorCourse
                        ? 'bg-[#FF6600]'
                        : 'bg-[#767171]'
                    }`}
                    style={{
                      boxShadow: formData.seniorCourse
                        ? '0 0 8px 2px rgba(255, 102, 0, 0.4)'
                        : 'none'
                    }}
                  >
                    <div
                      className={`absolute top-[2px] w-[18px] h-[18px] rounded-full bg-white transition-all duration-200 ${
                        formData.seniorCourse ? 'left-[20px]' : 'left-[2px]'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Row 3: Thematic */}
            <div className="flex items-center">
              <label
                className={`${getLabelColor('thematic')} ${labelFontSize} font-prometheus transition-colors text-right pr-4`}
                style={{ width: `${LAYOUT.LABEL_WIDTH}px` }}
              >
                Thematic:
              </label>
              <GradientBorder isActive={isFieldActive('thematic')} className={`w-[${LAYOUT.INPUT_WIDTH}px]`}>
                <select
                  value={formData.thematic}
                  onChange={(e) => handleInputChange('thematic', e.target.value)}
                  onFocus={() => handleFieldFocus('thematic')}
                  onBlur={handleFieldBlur}
                  onKeyDown={handleKeyDown}
                  onMouseEnter={() => setHoveredField('thematic')}
                  onMouseLeave={() => setHoveredField(null)}
                  className={`w-full h-[${LAYOUT.INPUT_HEIGHT}px] bg-[#0d0d0d] text-[#f2f2f2] text-[13px] px-4 rounded-[3px] focus:outline-none font-cascadia cursor-pointer`}
                  style={{ border: 'none', boxShadow: 'none', outline: 'none' }}
                >
                  {thematicOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </GradientBorder>
            </div>

            {/* Row 4: Duration + Code */}
            <div className="flex items-center">
              <label
                className={`${getLabelColor('duration')} ${labelFontSize} font-prometheus transition-colors text-right pr-4`}
                style={{ width: `${LAYOUT.LABEL_WIDTH}px` }}
              >
                Duration:
              </label>
              <div className="flex items-center gap-3" style={{ width: `${LAYOUT.INPUT_WIDTH}px` }}>
                <GradientBorder className="w-[190px]" isActive={isFieldActive('duration')}>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                    onFocus={() => handleFieldFocus('duration')}
                    onBlur={handleFieldBlur}
                    onKeyDown={handleKeyDown}
                    onMouseEnter={() => setHoveredField('duration')}
                    onMouseLeave={() => setHoveredField(null)}
                    className={`w-full h-[${LAYOUT.INPUT_HEIGHT}px] bg-[#0d0d0d] text-[#f2f2f2] text-[13px] px-4 rounded-[3px] focus:outline-none font-cascadia`}
                    style={{ border: 'none', boxShadow: 'none', outline: 'none' }}
                  />
                </GradientBorder>
                <label className={`${getLabelColor('code')} ${labelFontSize} font-prometheus transition-colors`}>
                  Code:
                </label>
                <GradientBorder className="flex-1" isActive={isFieldActive('code')}>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => handleInputChange('code', e.target.value)}
                    onFocus={() => handleFieldFocus('code')}
                    onBlur={handleFieldBlur}
                    onKeyDown={handleKeyDown}
                    onMouseEnter={() => setHoveredField('code')}
                    onMouseLeave={() => setHoveredField(null)}
                    className={`w-full h-[${LAYOUT.INPUT_HEIGHT}px] bg-[#0d0d0d] text-[#f2f2f2] text-[13px] px-4 rounded-[3px] focus:outline-none font-cascadia`}
                    style={{ border: 'none', boxShadow: 'none', outline: 'none' }}
                  />
                </GradientBorder>
              </div>
            </div>

            {/* Row 5: Developer */}
            <div className="flex items-center">
              <label
                className={`${getLabelColor('developer')} ${labelFontSize} font-prometheus transition-colors text-right pr-4`}
                style={{ width: `${LAYOUT.LABEL_WIDTH}px` }}
              >
                Developer:
              </label>
              <GradientBorder isActive={isFieldActive('developer')} className={`w-[${LAYOUT.INPUT_WIDTH}px]`}>
                <input
                  type="text"
                  value={formData.developer}
                  onChange={(e) => handleInputChange('developer', e.target.value)}
                  onFocus={() => handleFieldFocus('developer')}
                  onBlur={handleFieldBlur}
                  onKeyDown={handleKeyDown}
                  onMouseEnter={() => setHoveredField('developer')}
                  onMouseLeave={() => setHoveredField(null)}
                  className={`w-full h-[${LAYOUT.INPUT_HEIGHT}px] bg-[#0d0d0d] text-[#f2f2f2] text-[13px] px-4 rounded-[3px] focus:outline-none font-cascadia`}
                  style={{ border: 'none', boxShadow: 'none', outline: 'none' }}
                />
              </GradientBorder>
            </div>

            {/* Extra gap before Select Course */}
            <div style={{ height: `${LAYOUT.DEVELOPER_SELECT_GAP}px` }} />

            {/* Row 6: Select Course */}
            <div className="flex items-center">
              <label
                className={`${getLabelColor('selectedCourse')} ${labelFontSize} font-prometheus transition-colors text-right pr-4`}
                style={{ width: `${LAYOUT.LABEL_WIDTH}px` }}
              >
                Select Course:
              </label>
              <GradientBorder isActive={isFieldActive('selectedCourse')} className={`w-[${LAYOUT.INPUT_WIDTH}px]`}>
                <select
                  value={formData.selectedCourse}
                  onChange={(e) => handleInputChange('selectedCourse', e.target.value)}
                  onFocus={() => handleFieldFocus('selectedCourse')}
                  onBlur={handleFieldBlur}
                  onKeyDown={handleKeyDown}
                  onMouseEnter={() => setHoveredField('selectedCourse')}
                  onMouseLeave={() => setHoveredField(null)}
                  className={`w-full h-[${LAYOUT.INPUT_HEIGHT}px] bg-[#0d0d0d] text-[#f2f2f2] text-[13px] px-4 rounded-[3px] focus:outline-none font-cascadia cursor-pointer`}
                  style={{ border: 'none', boxShadow: 'none', outline: 'none' }}
                >
                  <option value="">Select...</option>
                  <option value="course1">Course 1</option>
                  <option value="course2">Course 2</option>
                  <option value="course3">Course 3</option>
                </select>
              </GradientBorder>
            </div>

            {/* Load Button - Right aligned (D7: grey default, orange+glow when active) */}
            <div className="flex justify-end" style={{ marginLeft: `${LAYOUT.LABEL_WIDTH}px` }}>
              <button
                onClick={handleLoad}
                className={`h-[31px] px-10 rounded-full text-[13px] font-prometheus uppercase tracking-wider transition-all hover:brightness-110 ${
                  isLoadActive ? 'text-white' : 'text-[#f2f2f2]'
                }`}
                style={{
                  background: isLoadActive
                    ? 'linear-gradient(to bottom, #D65700, #763000)'
                    : '#767171',
                  boxShadow: isLoadActive
                    ? '0 0 10px 2px rgba(255, 102, 0, 0.4)'
                    : 'none',
                  width: `${LAYOUT.INPUT_WIDTH}px`
                }}
              >
                Load
              </button>
            </div>
          </div>
        </div>

        {/* Right Side - Description */}
        <div 
          className="absolute flex flex-col"
          style={{ 
            left: `calc(50% + ${descriptionLeftEdge}px)`,
            top: 0,
            width: `${LAYOUT.DESCRIPTION_WIDTH}px`
          }}
        >
          <GradientBorder className="flex-1" isActive={isFieldActive('description')}>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              onFocus={() => handleFieldFocus('description')}
              onBlur={handleFieldBlur}
              onKeyDown={handleKeyDown}
              onMouseEnter={() => setHoveredField('description')}
              onMouseLeave={() => setHoveredField(null)}
              className={`w-full h-full bg-[#0d0d0d] text-[#f2f2f2] text-[13px] p-5 rounded-[3px] focus:outline-none font-cascadia resize-none`}
              style={{ minHeight: `${LAYOUT.DESCRIPTION_MIN_HEIGHT}px`, border: 'none', boxShadow: 'none', outline: 'none' }}
              placeholder="Enter course description..."
            />
          </GradientBorder>
          {/* Label below textarea */}
          <label 
            className={`${getLabelColor('description')} ${labelFontSize} font-prometheus mt-2 transition-colors`}
          >
            Description
          </label>
        </div>
      </div>

      {/* ============================================== */}
      {/* BOTTOM SECTION - Fixed Y coordinate positioning */}
      {/* Using position: fixed for exact viewport coordinates */}
      {/* ============================================== */}
      
      {/* Elements ABOVE the line - bottom edges at Y = 860px */}
      {/* This means top = 860px - elementHeight */}
      {/* Navigation buttons ~47px tall, PKE 76px tall, action buttons 31px tall */}
      {/* Position container so bottom edge is at 860px */}
      <div 
        className="fixed left-0 right-0 flex items-end justify-between px-[3%]"
        style={{ top: `${ABOVE_LINE_BOTTOM - 120}px`, height: '120px' }}
      >
        {/* Navigation buttons - left side */}
        <div style={{ marginLeft: `${LAYOUT.NAV_LEFT_OFFSET}px` }}>
          <Navigation activePage="define" onNavigate={handleNavigateWithPKEClose} />
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

export default Describe
