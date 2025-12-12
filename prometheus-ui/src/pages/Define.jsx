/**
 * Define Page - Slide 3 of Mockup 2.1
 *
 * Three-column layout:
 * - Left: DETAILS (Title, Thematic, Module, Duration, Level, Seniority)
 * - Center: DESCRIPTION (textarea + delivery buttons + toggles)
 * - Right: LEARNING OBJECTIVES (numbered list with + buttons)
 *
 * Features:
 * - Discrete-snap sliders for Level and Seniority
 * - Duration slider with unit dropdown
 * - Delivery mode toggle buttons
 * - Mini NavWheel in bottom-left
 */

import { useState, useCallback } from 'react'
import { THEME, LEVEL_OPTIONS, SENIORITY_OPTIONS, DURATION_UNITS, DURATION_MAX, DELIVERY_OPTIONS } from '../constants/theme'
import NavWheel from '../components/NavWheel'
import Slider from '../components/Slider'
import GradientBorder from '../components/GradientBorder'
import StatusBar from '../components/StatusBar'
import PKEInterface from '../components/PKEInterface'
import pkeButton from '../assets/PKE_Button.png'

function Define({ onNavigate, courseData, setCourseData, courseLoaded }) {
  const [isPKEActive, setIsPKEActive] = useState(false)
  const [wheelExpanded, setWheelExpanded] = useState(false)
  const [focusedField, setFocusedField] = useState(null)
  const [hoveredField, setHoveredField] = useState(null)

  // Form state
  const [formData, setFormData] = useState({
    title: courseData?.title || '',
    thematic: courseData?.thematic || '',
    module: courseData?.module || 1,
    code: courseData?.code || '',
    duration: courseData?.duration || 0,
    durationUnit: courseData?.durationUnit || 'DAYS',
    level: courseData?.level || 'FOUNDATIONAL',
    seniority: courseData?.seniority || 'JUNIOR',
    description: courseData?.description || '',
    deliveryModes: courseData?.deliveryModes || [],
    qualification: courseData?.qualification || false,
    accredited: courseData?.accredited || false,
    certified: courseData?.certified || false,
    learningObjectives: courseData?.learningObjectives || ['']
  })

  // Update form field
  const updateField = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }, [])

  // Toggle delivery mode
  const toggleDelivery = useCallback((mode) => {
    setFormData(prev => ({
      ...prev,
      deliveryModes: prev.deliveryModes.includes(mode)
        ? prev.deliveryModes.filter(m => m !== mode)
        : [...prev.deliveryModes, mode]
    }))
  }, [])

  // Learning objectives handlers
  const updateLO = useCallback((index, value) => {
    setFormData(prev => {
      const newLOs = [...prev.learningObjectives]
      newLOs[index] = value
      return { ...prev, learningObjectives: newLOs }
    })
  }, [])

  const addLO = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      learningObjectives: [...prev.learningObjectives, '']
    }))
  }, [])

  // Check if field is active
  const isFieldActive = useCallback((field) => {
    return focusedField === field || (focusedField === null && hoveredField === field)
  }, [focusedField, hoveredField])

  // Handle navigation
  const handleNavigate = useCallback((section) => {
    setWheelExpanded(false)
    onNavigate?.(section)
  }, [onNavigate])

  // Handle save
  const handleSave = useCallback(() => {
    setCourseData?.(formData)
    setIsPKEActive(false)
  }, [formData, setCourseData])

  // Thematic options
  const thematicOptions = [
    'Defence & Security',
    'Intelligence',
    'Policing',
    'Leadership & Management',
    'Crisis Response',
    'Resilience',
    'Personal Skills'
  ]

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
            fontSize: '27px',
            letterSpacing: '9px',
            color: THEME.OFF_WHITE,
            fontFamily: THEME.FONT_PRIMARY
          }}
        >
          COURSE INFORMATION
        </h1>
        <img
          src={pkeButton}
          alt="PKE"
          onClick={() => setIsPKEActive(!isPKEActive)}
          style={{
            width: '28px',
            height: '28px',
            cursor: 'pointer',
            opacity: isPKEActive ? 1 : 0.7,
            transition: 'opacity 0.2s ease'
          }}
        />
      </div>

      {/* Main Content - Three Columns */}
      <div
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '40px',
          padding: '0 60px',
          paddingBottom: '180px' // Space for bottom controls
        }}
      >
        {/* LEFT COLUMN - DETAILS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2
            style={{
              fontSize: '18px',
              letterSpacing: '4.5px',
              color: THEME.AMBER,
              fontFamily: THEME.FONT_PRIMARY,
              borderBottom: `1px solid ${THEME.BORDER}`,
              paddingBottom: '8px',
              marginBottom: '8px'
            }}
          >
            DETAILS
          </h2>

          {/* Title */}
          <div>
            <label style={labelStyle(isFieldActive('title'))}>Title</label>
            <GradientBorder isActive={isFieldActive('title')}>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => updateField('title', e.target.value)}
                onFocus={() => setFocusedField('title')}
                onBlur={() => setFocusedField(null)}
                onMouseEnter={() => setHoveredField('title')}
                onMouseLeave={() => setHoveredField(null)}
                style={inputStyle}
                placeholder="Enter course title..."
              />
            </GradientBorder>
          </div>

          {/* Thematic */}
          <div>
            <label style={labelStyle(isFieldActive('thematic'))}>Thematic</label>
            <GradientBorder isActive={isFieldActive('thematic')}>
              <select
                value={formData.thematic}
                onChange={(e) => updateField('thematic', e.target.value)}
                onFocus={() => setFocusedField('thematic')}
                onBlur={() => setFocusedField(null)}
                onMouseEnter={() => setHoveredField('thematic')}
                onMouseLeave={() => setHoveredField(null)}
                style={{ ...inputStyle, cursor: 'pointer' }}
              >
                <option value="">Select...</option>
                {thematicOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </GradientBorder>
          </div>

          {/* Module + Code */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle(isFieldActive('module'))}>Module</label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <GradientBorder isActive={isFieldActive('module')}>
                  <input
                    type="number"
                    min="1"
                    value={formData.module}
                    onChange={(e) => updateField('module', parseInt(e.target.value) || 1)}
                    onFocus={() => setFocusedField('module')}
                    onBlur={() => setFocusedField(null)}
                    style={{ ...inputStyle, width: '60px', textAlign: 'center' }}
                  />
                </GradientBorder>
                <button
                  onClick={() => updateField('module', formData.module + 1)}
                  style={smallButtonStyle}
                >
                  +
                </button>
              </div>
            </div>
            <div style={{ flex: 2 }}>
              <label style={labelStyle(isFieldActive('code'))}>Code</label>
              <GradientBorder isActive={isFieldActive('code')}>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => updateField('code', e.target.value)}
                  onFocus={() => setFocusedField('code')}
                  onBlur={() => setFocusedField(null)}
                  style={inputStyle}
                  placeholder="INT-001"
                />
              </GradientBorder>
            </div>
          </div>

          {/* Duration */}
          <div>
            <label style={labelStyle(isFieldActive('duration'))}>Duration</label>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <Slider
                  continuous
                  value={formData.duration}
                  min={0}
                  max={DURATION_MAX[formData.durationUnit]}
                  onChange={(val) => updateField('duration', val)}
                  showBubble={false}
                  width={180}
                />
              </div>
              <div
                style={{
                  padding: '6px 12px',
                  background: THEME.BG_INPUT,
                  border: `1px solid ${THEME.BORDER}`,
                  borderRadius: '3px',
                  minWidth: '50px',
                  textAlign: 'center'
                }}
              >
                <span style={{ color: THEME.AMBER, fontFamily: THEME.FONT_MONO, fontSize: '18px' }}>
                  {formData.duration}
                </span>
              </div>
              <GradientBorder isActive={isFieldActive('durationUnit')}>
                <select
                  value={formData.durationUnit}
                  onChange={(e) => {
                    updateField('durationUnit', e.target.value)
                    updateField('duration', 0) // Reset on unit change
                  }}
                  onFocus={() => setFocusedField('durationUnit')}
                  onBlur={() => setFocusedField(null)}
                  style={{ ...inputStyle, width: '80px', cursor: 'pointer' }}
                >
                  {DURATION_UNITS.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </GradientBorder>
            </div>
          </div>

          {/* Level */}
          <div>
            <label style={labelStyle(isFieldActive('level'))}>Level</label>
            <Slider
              options={LEVEL_OPTIONS}
              value={formData.level}
              onChange={(val) => updateField('level', val)}
              width={320}
            />
          </div>

          {/* Seniority */}
          <div>
            <label style={labelStyle(isFieldActive('seniority'))}>Seniority</label>
            <Slider
              options={SENIORITY_OPTIONS}
              value={formData.seniority}
              onChange={(val) => updateField('seniority', val)}
              width={320}
              highlightLast
            />
          </div>
        </div>

        {/* CENTER COLUMN - DESCRIPTION */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2
            style={{
              fontSize: '18px',
              letterSpacing: '4.5px',
              color: THEME.AMBER,
              fontFamily: THEME.FONT_PRIMARY,
              borderBottom: `1px solid ${THEME.BORDER}`,
              paddingBottom: '8px',
              marginBottom: '8px'
            }}
          >
            DESCRIPTION
          </h2>

          {/* Description Textarea */}
          <GradientBorder isActive={isFieldActive('description')}>
            <textarea
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
              onFocus={() => setFocusedField('description')}
              onBlur={() => setFocusedField(null)}
              onMouseEnter={() => setHoveredField('description')}
              onMouseLeave={() => setHoveredField(null)}
              style={{
                ...inputStyle,
                minHeight: '200px',
                resize: 'vertical'
              }}
              placeholder="Enter course description..."
            />
          </GradientBorder>

          {/* Delivery Mode Buttons */}
          <div>
            <label style={{ ...labelStyle(false), marginBottom: '12px', display: 'block' }}>
              Delivery
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {DELIVERY_OPTIONS.map(mode => {
                const isSelected = formData.deliveryModes.includes(mode)
                return (
                  <button
                    key={mode}
                    onClick={() => toggleDelivery(mode)}
                    style={{
                      padding: '12px 21px',
                      fontSize: '14px',
                      letterSpacing: '2px',
                      fontFamily: THEME.FONT_PRIMARY,
                      background: isSelected ? THEME.GRADIENT_BUTTON : 'transparent',
                      border: `1px solid ${isSelected ? THEME.AMBER : THEME.BORDER}`,
                      borderRadius: '3px',
                      color: isSelected ? THEME.WHITE : THEME.TEXT_SECONDARY,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {mode}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Toggle Options */}
          <div style={{ display: 'flex', gap: '20px', marginTop: '12px' }}>
            {[
              { key: 'qualification', label: 'Qualification' },
              { key: 'accredited', label: 'Accredited' },
              { key: 'certified', label: 'Certified' }
            ].map(toggle => (
              <div key={toggle.key} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={() => updateField(toggle.key, !formData[toggle.key])}
                  style={{
                    width: '54px',
                    height: '24px',
                    borderRadius: '12px',
                    background: formData[toggle.key] ? THEME.AMBER : THEME.BORDER_GREY,
                    border: 'none',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'background 0.2s ease'
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: '2px',
                      left: formData[toggle.key] ? '30px' : '2px',
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      background: THEME.WHITE,
                      transition: 'left 0.2s ease'
                    }}
                  />
                </button>
                <span style={{ fontSize: '15px', color: THEME.TEXT_SECONDARY, fontFamily: THEME.FONT_PRIMARY }}>
                  {toggle.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN - LEARNING OBJECTIVES */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2
            style={{
              fontSize: '18px',
              letterSpacing: '4.5px',
              color: THEME.AMBER,
              fontFamily: THEME.FONT_PRIMARY,
              borderBottom: `1px solid ${THEME.BORDER}`,
              paddingBottom: '8px',
              marginBottom: '8px'
            }}
          >
            LEARNING OBJECTIVES
          </h2>

          {/* LO List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {formData.learningObjectives.map((lo, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: THEME.AMBER_DARK,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '17px',
                    color: THEME.WHITE,
                    fontFamily: THEME.FONT_MONO,
                    flexShrink: 0
                  }}
                >
                  {idx + 1}
                </span>
                <GradientBorder isActive={isFieldActive(`lo-${idx}`)} className="flex-1">
                  <input
                    type="text"
                    value={lo}
                    onChange={(e) => updateLO(idx, e.target.value)}
                    onFocus={() => setFocusedField(`lo-${idx}`)}
                    onBlur={() => setFocusedField(null)}
                    style={inputStyle}
                    placeholder={idx === 0 ? "EXPLAIN something..." : "Enter learning objective..."}
                  />
                </GradientBorder>
                {idx === formData.learningObjectives.length - 1 && (
                  <button onClick={addLO} style={smallButtonStyle}>+</button>
                )}
              </div>
            ))}
          </div>

          {/* CLO hint */}
          <div
            style={{
              fontSize: '12px',
              color: THEME.TEXT_DIM,
              fontFamily: THEME.FONT_MONO,
              marginTop: '8px',
              letterSpacing: '1.5px'
            }}
          >
            TIP: Start with a Bloom's verb (EXPLAIN, DESCRIBE, ANALYSE...)
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0
        }}
      >
        {/* Control Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            padding: '0 40px 20px 130px', // Left padding for NavWheel
            marginBottom: '15px'
          }}
        >
          {/* Analytics Button Placeholder */}
          <button
            style={{
              padding: '15px 30px',
              fontSize: '15px',
              letterSpacing: '3px',
              fontFamily: THEME.FONT_PRIMARY,
              background: 'transparent',
              border: `1px solid ${THEME.BORDER}`,
              borderRadius: '3px',
              color: THEME.TEXT_DIM,
              cursor: 'not-allowed'
            }}
          >
            ANALYTICS
          </button>

          {/* Center: < + > and PKE */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button style={navButtonStyle}>&lt;</button>
              <span style={{ color: THEME.TEXT_DIM, fontSize: '18px' }}>+</span>
              <button style={navButtonStyle}>&gt;</button>
            </div>
            <PKEInterface isActive={isPKEActive} onClose={() => setIsPKEActive(false)} />
          </div>

          {/* Right: Action buttons */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button style={actionButtonStyle}>DELETE</button>
            <button style={actionButtonStyle}>CLEAR</button>
            <button style={{ ...actionButtonStyle, ...primaryButtonStyle }} onClick={handleSave}>
              SAVE
            </button>
          </div>
        </div>

        {/* Bottom Line */}
        <div style={{ width: '100%', height: '1px', background: THEME.GRADIENT_LINE_BOTTOM }} />

        {/* Status Bar */}
        <StatusBar courseLoaded={courseLoaded} />
      </div>

      {/* Mini NavWheel */}
      <div style={{ position: 'absolute', bottom: '100px', left: '30px' }}>
        <NavWheel
          currentSection="define"
          onNavigate={handleNavigate}
          isExpanded={wheelExpanded}
          onToggle={() => setWheelExpanded(!wheelExpanded)}
        />
      </div>
    </div>
  )
}

// Style helpers
const labelStyle = (isActive) => ({
  display: 'block',
  fontSize: '15px',
  letterSpacing: '3px',
  color: isActive ? THEME.AMBER : THEME.TEXT_DIM,
  fontFamily: THEME.FONT_PRIMARY,
  marginBottom: '9px',
  transition: 'color 0.2s ease'
})

const inputStyle = {
  width: '100%',
  padding: '14px 16px',
  background: THEME.BG_INPUT,
  border: 'none',
  borderRadius: '3px',
  color: THEME.TEXT_PRIMARY,
  fontSize: '18px',
  fontFamily: THEME.FONT_MONO,
  outline: 'none'
}

const smallButtonStyle = {
  width: '36px',
  height: '36px',
  borderRadius: '50%',
  background: THEME.AMBER_DARK,
  border: 'none',
  color: THEME.WHITE,
  fontSize: '21px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'background 0.2s ease'
}

const navButtonStyle = {
  background: 'transparent',
  border: 'none',
  color: THEME.TEXT_DIM,
  fontSize: '27px',
  cursor: 'pointer',
  padding: '6px 12px',
  transition: 'color 0.2s ease'
}

const actionButtonStyle = {
  padding: '14px 36px',
  fontSize: '15px',
  letterSpacing: '3px',
  fontFamily: THEME.FONT_PRIMARY,
  background: 'transparent',
  border: `1px solid ${THEME.BORDER}`,
  borderRadius: '20px',
  color: THEME.TEXT_SECONDARY,
  cursor: 'pointer',
  transition: 'all 0.2s ease'
}

const primaryButtonStyle = {
  background: THEME.GRADIENT_BUTTON,
  border: `1px solid ${THEME.AMBER}`,
  color: THEME.WHITE
}

export default Define
