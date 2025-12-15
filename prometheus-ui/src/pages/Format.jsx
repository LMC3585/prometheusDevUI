/**
 * Format Page - Template & Style Configuration
 * 
 * Features:
 * - Output type selection
 * - Template selection
 * - Style options (colors, fonts, spacing)
 * - Preview area
 */

import { useState, useCallback } from 'react'
import { THEME } from '../constants/theme'
import { useCourse } from '../context/CourseContext'
import { usePKE } from '../context/PKEContext'
import Header from '../components/Header'
import Footer from '../components/Footer'

// Output types
const OUTPUT_TYPES = [
  { id: 'pptx', label: 'PowerPoint', icon: '📊', desc: 'Presentation slides' },
  { id: 'handbook', label: 'Handbook', icon: '📖', desc: 'Participant guide' },
  { id: 'lessonplan', label: 'Lesson Plans', icon: '📋', desc: 'Instructor materials' },
  { id: 'assessment', label: 'Assessments', icon: '✅', desc: 'Tests & quizzes' },
  { id: 'scalar', label: 'Scalar Matrix', icon: '📐', desc: 'Training matrix' }
]

// Templates
const TEMPLATES = {
  pptx: [
    { id: 'rabdan', label: 'Rabdan Academy', preview: '🏛️' },
    { id: 'corporate', label: 'Corporate', preview: '🏢' },
    { id: 'military', label: 'Military', preview: '🎖️' },
    { id: 'minimal', label: 'Minimal', preview: '◻️' }
  ],
  handbook: [
    { id: 'rabdan', label: 'Rabdan Academy', preview: '🏛️' },
    { id: 'technical', label: 'Technical Manual', preview: '⚙️' },
    { id: 'standard', label: 'Standard', preview: '📄' }
  ],
  lessonplan: [
    { id: 'detailed', label: 'Detailed', preview: '📝' },
    { id: 'outline', label: 'Outline', preview: '📋' },
    { id: 'sat', label: 'SAT Format', preview: '🎯' }
  ],
  assessment: [
    { id: 'formal', label: 'Formal Exam', preview: '📝' },
    { id: 'quiz', label: 'Quiz Style', preview: '❓' },
    { id: 'practical', label: 'Practical', preview: '🔧' }
  ],
  scalar: [
    { id: 'standard', label: 'Standard Matrix', preview: '📊' },
    { id: 'detailed', label: 'Detailed', preview: '📈' }
  ]
}

// Style options
const STYLE_OPTIONS = {
  colorSchemes: [
    { id: 'brand', label: 'Brand', colors: ['#D4730C', '#1a1a1a', '#f0f0f0'] },
    { id: 'blue', label: 'Blue', colors: ['#2196F3', '#1a237e', '#e3f2fd'] },
    { id: 'green', label: 'Green', colors: ['#4CAF50', '#1b5e20', '#e8f5e9'] },
    { id: 'mono', label: 'Monochrome', colors: ['#424242', '#212121', '#fafafa'] }
  ],
  fontSizes: [
    { id: 'small', label: 'Small' },
    { id: 'medium', label: 'Medium' },
    { id: 'large', label: 'Large' }
  ],
  spacing: [
    { id: 'compact', label: 'Compact' },
    { id: 'normal', label: 'Normal' },
    { id: 'relaxed', label: 'Relaxed' }
  ]
}

function Format({ onNavigate, onSave, onClear, onDelete, user, courseState, progress }) {
  const { currentCourse } = useCourse()
  const { openPKE, closePKE, isActive: isPKEActive } = usePKE()

  // Local state
  const [selectedOutput, setSelectedOutput] = useState('pptx')
  const [selectedTemplate, setSelectedTemplate] = useState('rabdan')
  const [colorScheme, setColorScheme] = useState('brand')
  const [fontSize, setFontSize] = useState('medium')
  const [spacing, setSpacing] = useState('normal')
  const [includeOptions, setIncludeOptions] = useState({
    speakerNotes: true,
    headerFooter: true,
    pageNumbers: true,
    toc: true,
    appendix: false
  })
  const [previewMode, setPreviewMode] = useState('thumbnails') // 'thumbnails' | 'full'

  // Handle navigation
  const handleNavigate = useCallback((section) => {
    onNavigate?.(section)
  }, [onNavigate])

  // Toggle include option
  const toggleOption = useCallback((option) => {
    setIncludeOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }))
  }, [])

  // Get templates for selected output
  const templates = TEMPLATES[selectedOutput] || []

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
      <Header pageTitle="FORMAT" />

      {/* Main Content - 3 Panel Layout */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          padding: '24px 40px',
          paddingBottom: '140px',
          gap: '24px',
          overflow: 'hidden'
        }}
      >
        {/* Left Panel: Output Types */}
        <div
          style={{
            width: '200px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}
        >
          <h3 style={{ fontSize: '10px', color: THEME.AMBER, letterSpacing: '2px', marginBottom: '8px' }}>
            OUTPUT TYPE
          </h3>
          {OUTPUT_TYPES.map(type => (
            <OutputTypeButton
              key={type.id}
              type={type}
              selected={selectedOutput === type.id}
              onClick={() => {
                setSelectedOutput(type.id)
                setSelectedTemplate(TEMPLATES[type.id]?.[0]?.id || '')
              }}
            />
          ))}
        </div>

        {/* Center Panel: Preview */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            background: 'rgba(0,0,0,0.2)',
            borderRadius: '8px',
            overflow: 'hidden'
          }}
        >
          {/* Preview header */}
          <div
            style={{
              padding: '12px 16px',
              borderBottom: `1px solid ${THEME.BORDER}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <span style={{ fontSize: '10px', color: THEME.TEXT_DIM, letterSpacing: '1px' }}>
              PREVIEW
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setPreviewMode('thumbnails')}
                style={{
                  padding: '4px 12px',
                  background: previewMode === 'thumbnails' ? THEME.AMBER : 'transparent',
                  border: `1px solid ${THEME.BORDER}`,
                  borderRadius: '3px',
                  color: previewMode === 'thumbnails' ? '#000' : THEME.TEXT_SECONDARY,
                  fontSize: '9px',
                  cursor: 'pointer'
                }}
              >
                THUMBNAILS
              </button>
              <button
                onClick={() => setPreviewMode('full')}
                style={{
                  padding: '4px 12px',
                  background: previewMode === 'full' ? THEME.AMBER : 'transparent',
                  border: `1px solid ${THEME.BORDER}`,
                  borderRadius: '3px',
                  color: previewMode === 'full' ? '#000' : THEME.TEXT_SECONDARY,
                  fontSize: '9px',
                  cursor: 'pointer'
                }}
              >
                FULL VIEW
              </button>
            </div>
          </div>

          {/* Preview area */}
          <PreviewArea
            mode={previewMode}
            outputType={selectedOutput}
            template={selectedTemplate}
            colorScheme={colorScheme}
            courseTitle={currentCourse?.title}
          />
        </div>

        {/* Right Panel: Options */}
        <div
          style={{
            width: '280px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            overflowY: 'auto'
          }}
        >
          {/* Templates */}
          <div>
            <h3 style={{ fontSize: '10px', color: THEME.AMBER, letterSpacing: '2px', marginBottom: '12px' }}>
              TEMPLATE
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {templates.map(template => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  selected={selectedTemplate === template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                />
              ))}
            </div>
          </div>

          {/* Color Scheme */}
          <OptionGroup title="COLOR SCHEME">
            <div style={{ display: 'flex', gap: '8px' }}>
              {STYLE_OPTIONS.colorSchemes.map(scheme => (
                <ColorOption
                  key={scheme.id}
                  scheme={scheme}
                  selected={colorScheme === scheme.id}
                  onClick={() => setColorScheme(scheme.id)}
                />
              ))}
            </div>
          </OptionGroup>

          {/* Font Size */}
          <OptionGroup title="FONT SIZE">
            <div style={{ display: 'flex', gap: '8px' }}>
              {STYLE_OPTIONS.fontSizes.map(size => (
                <button
                  key={size.id}
                  onClick={() => setFontSize(size.id)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    background: fontSize === size.id ? 'rgba(212, 115, 12, 0.2)' : 'transparent',
                    border: `1px solid ${fontSize === size.id ? THEME.AMBER : THEME.BORDER}`,
                    borderRadius: '4px',
                    color: fontSize === size.id ? THEME.AMBER : THEME.TEXT_SECONDARY,
                    fontSize: '10px',
                    cursor: 'pointer'
                  }}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </OptionGroup>

          {/* Spacing */}
          <OptionGroup title="SPACING">
            <div style={{ display: 'flex', gap: '8px' }}>
              {STYLE_OPTIONS.spacing.map(sp => (
                <button
                  key={sp.id}
                  onClick={() => setSpacing(sp.id)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    background: spacing === sp.id ? 'rgba(212, 115, 12, 0.2)' : 'transparent',
                    border: `1px solid ${spacing === sp.id ? THEME.AMBER : THEME.BORDER}`,
                    borderRadius: '4px',
                    color: spacing === sp.id ? THEME.AMBER : THEME.TEXT_SECONDARY,
                    fontSize: '10px',
                    cursor: 'pointer'
                  }}
                >
                  {sp.label}
                </button>
              ))}
            </div>
          </OptionGroup>

          {/* Include Options */}
          <OptionGroup title="INCLUDE">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <ToggleOption
                label="Speaker Notes"
                checked={includeOptions.speakerNotes}
                onChange={() => toggleOption('speakerNotes')}
              />
              <ToggleOption
                label="Headers & Footers"
                checked={includeOptions.headerFooter}
                onChange={() => toggleOption('headerFooter')}
              />
              <ToggleOption
                label="Page Numbers"
                checked={includeOptions.pageNumbers}
                onChange={() => toggleOption('pageNumbers')}
              />
              <ToggleOption
                label="Table of Contents"
                checked={includeOptions.toc}
                onChange={() => toggleOption('toc')}
              />
              <ToggleOption
                label="Appendix"
                checked={includeOptions.appendix}
                onChange={() => toggleOption('appendix')}
              />
            </div>
          </OptionGroup>

          {/* Save as Default */}
          <button
            style={{
              padding: '12px',
              background: 'transparent',
              border: `1px solid ${THEME.BORDER}`,
              borderRadius: '4px',
              color: THEME.TEXT_SECONDARY,
              fontSize: '10px',
              letterSpacing: '1px',
              cursor: 'pointer',
              marginTop: 'auto'
            }}
          >
            SAVE AS DEFAULT
          </button>
        </div>
      </div>

      <Footer
        currentSection="format"
        onNavigate={handleNavigate}
        isPKEActive={isPKEActive}
        onPKEToggle={(active) => active ? openPKE() : closePKE()}
        onSave={onSave}
        onClear={onClear}
        onDelete={onDelete}
        user={user}
        courseState={courseState}
        progress={progress}
      />
    </div>
  )
}

// ===========================================
// Sub-components
// ===========================================

function OutputTypeButton({ type, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 16px',
        background: selected ? 'rgba(212, 115, 12, 0.1)' : 'transparent',
        border: `1px solid ${selected ? THEME.AMBER : THEME.BORDER}`,
        borderRadius: '4px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        textAlign: 'left'
      }}
    >
      <span style={{ fontSize: '24px' }}>{type.icon}</span>
      <div>
        <div style={{ fontSize: '11px', color: selected ? THEME.AMBER : THEME.TEXT_PRIMARY }}>
          {type.label}
        </div>
        <div style={{ fontSize: '9px', color: THEME.TEXT_DIM }}>
          {type.desc}
        </div>
      </div>
    </button>
  )
}

function TemplateCard({ template, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '80px',
        height: '80px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        background: selected ? 'rgba(212, 115, 12, 0.1)' : 'rgba(255,255,255,0.02)',
        border: `1px solid ${selected ? THEME.AMBER : THEME.BORDER}`,
        borderRadius: '4px',
        cursor: 'pointer'
      }}
    >
      <span style={{ fontSize: '24px' }}>{template.preview}</span>
      <span style={{ fontSize: '9px', color: selected ? THEME.AMBER : THEME.TEXT_SECONDARY }}>
        {template.label}
      </span>
    </button>
  )
}

function OptionGroup({ title, children }) {
  return (
    <div>
      <h4 style={{ fontSize: '9px', color: THEME.TEXT_DIM, letterSpacing: '1px', marginBottom: '10px' }}>
        {title}
      </h4>
      {children}
    </div>
  )
}

function ColorOption({ scheme, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '48px',
        height: '48px',
        padding: '4px',
        background: selected ? 'rgba(212, 115, 12, 0.2)' : 'transparent',
        border: `2px solid ${selected ? THEME.AMBER : THEME.BORDER}`,
        borderRadius: '4px',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: '2px'
      }}
      title={scheme.label}
    >
      {scheme.colors.map((color, idx) => (
        <div
          key={idx}
          style={{
            flex: 1,
            background: color,
            borderRadius: idx === 0 ? '2px 2px 0 0' : idx === 2 ? '0 0 2px 2px' : '0'
          }}
        />
      ))}
    </button>
  )
}

function ToggleOption({ label, checked, onChange }) {
  return (
    <label
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        cursor: 'pointer'
      }}
    >
      <div
        onClick={onChange}
        style={{
          width: '36px',
          height: '20px',
          background: checked ? THEME.AMBER : 'rgba(255,255,255,0.1)',
          borderRadius: '10px',
          position: 'relative',
          transition: 'background 0.2s ease'
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '2px',
            left: checked ? '18px' : '2px',
            width: '16px',
            height: '16px',
            background: '#fff',
            borderRadius: '50%',
            transition: 'left 0.2s ease'
          }}
        />
      </div>
      <span style={{ fontSize: '11px', color: THEME.TEXT_SECONDARY }}>{label}</span>
    </label>
  )
}

function PreviewArea({ mode, outputType, template, colorScheme, courseTitle }) {
  const schemeColors = STYLE_OPTIONS.colorSchemes.find(s => s.id === colorScheme)?.colors || ['#D4730C', '#1a1a1a', '#f0f0f0']

  if (mode === 'full') {
    return (
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px'
        }}
      >
        {/* Single slide preview */}
        <div
          style={{
            width: '100%',
            maxWidth: '600px',
            aspectRatio: '16/9',
            background: schemeColors[2],
            borderRadius: '4px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            display: 'flex',
            flexDirection: 'column',
            padding: '24px',
            position: 'relative'
          }}
        >
          {/* Header bar */}
          <div
            style={{
              height: '4px',
              background: schemeColors[0],
              marginBottom: '16px'
            }}
          />
          {/* Title */}
          <div
            style={{
              fontSize: '18px',
              color: schemeColors[1],
              fontWeight: 'bold',
              marginBottom: '12px'
            }}
          >
            {courseTitle || 'Course Title'}
          </div>
          {/* Content lines */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ height: '12px', width: '80%', background: 'rgba(0,0,0,0.1)', borderRadius: '2px' }} />
            <div style={{ height: '12px', width: '60%', background: 'rgba(0,0,0,0.1)', borderRadius: '2px' }} />
            <div style={{ height: '12px', width: '70%', background: 'rgba(0,0,0,0.1)', borderRadius: '2px' }} />
          </div>
          {/* Footer */}
          <div style={{ fontSize: '8px', color: 'rgba(0,0,0,0.3)', textAlign: 'right' }}>
            Template: {template}
          </div>
        </div>
      </div>
    )
  }

  // Thumbnails mode
  return (
    <div
      style={{
        flex: 1,
        padding: '24px',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '16px',
        overflowY: 'auto'
      }}
    >
      {[1, 2, 3, 4, 5, 6].map(num => (
        <div
          key={num}
          style={{
            aspectRatio: '16/9',
            background: schemeColors[2],
            borderRadius: '4px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            padding: '12px',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <div style={{ height: '2px', background: schemeColors[0], marginBottom: '8px' }} />
          <div style={{ fontSize: '10px', color: schemeColors[1], marginBottom: '4px' }}>
            Slide {num}
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ height: '6px', width: '70%', background: 'rgba(0,0,0,0.1)', borderRadius: '1px' }} />
            <div style={{ height: '6px', width: '50%', background: 'rgba(0,0,0,0.1)', borderRadius: '1px' }} />
          </div>
        </div>
      ))}
    </div>
  )
}

export default Format
