/**
 * Build Page - Enabling Objectives & Assessment
 */

import { useState, useCallback } from 'react'
import { THEME } from '../constants/theme'
import { useCourse } from '../context/CourseContext'
import { usePKE } from '../context/PKEContext'
import Header from '../components/Header'
import Footer from '../components/Footer'

const BLOOMS_LEVELS = [
  { id: 'remember', label: 'Remember', color: '#8B5CF6' },
  { id: 'understand', label: 'Understand', color: '#3B82F6' },
  { id: 'apply', label: 'Apply', color: '#10B981' },
  { id: 'analyze', label: 'Analyze', color: '#F59E0B' },
  { id: 'evaluate', label: 'Evaluate', color: '#EF4444' },
  { id: 'create', label: 'Create', color: '#EC4899' }
]

const ASSESSMENT_TYPES = [
  { id: 'mcq', label: 'Multiple Choice' },
  { id: 'truefalse', label: 'True/False' },
  { id: 'shortanswer', label: 'Short Answer' },
  { id: 'essay', label: 'Essay' },
  { id: 'practical', label: 'Practical' }
]

function Build({ onNavigate, onSave, onClear, onDelete, user, courseState, progress }) {
  const { currentCourse, addEnablingObjective, addModule, addLesson } = useCourse()
  const { openPKE, closePKE, isActive: isPKEActive, executeInvocation, isProcessing, message, messageType } = usePKE()

  const [activeTab, setActiveTab] = useState('enabling')
  const [selectedModule, setSelectedModule] = useState(null)
  const [selectedLesson, setSelectedLesson] = useState(null)

  const handleNavigate = useCallback((section) => {
    onNavigate?.(section)
  }, [onNavigate])

  const handleRunPKE = useCallback(async (invocationNum) => {
    try {
      await executeInvocation(invocationNum, { courseData: currentCourse })
    } catch (err) {
      console.error('PKE invocation failed:', err)
    }
  }, [executeInvocation, currentCourse])

  const modules = currentCourse?.modules || []
  const enablingObjectives = currentCourse?.enablingObjectives || []
  const assessments = currentCourse?.assessments || []

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: THEME.BG_DARK,
      display: 'flex',
      flexDirection: 'column',
      position: 'relative'
    }}>
      <Header pageTitle="BUILD" />

      {/* PKE Message Bar */}
      {message && (
        <div style={{
          padding: '12px 40px',
          background: messageType === 'error' ? 'rgba(244, 67, 54, 0.1)' :
                     messageType === 'success' ? 'rgba(76, 175, 80, 0.1)' :
                     'rgba(212, 115, 12, 0.1)',
          borderBottom: `1px solid ${
            messageType === 'error' ? '#F44336' :
            messageType === 'success' ? '#4CAF50' :
            THEME.AMBER
          }`,
          color: messageType === 'error' ? '#F44336' :
                 messageType === 'success' ? '#4CAF50' :
                 THEME.AMBER,
          fontSize: '12px',
          fontFamily: THEME.FONT_MONO
        }}>
          {message}
        </div>
      )}

      {/* Tabs */}
      <div style={{
        display: 'flex',
        borderBottom: `1px solid ${THEME.BORDER}`,
        padding: '0 40px'
      }}>
        <TabButton 
          label="ENABLING OBJECTIVES" 
          active={activeTab === 'enabling'} 
          onClick={() => setActiveTab('enabling')} 
        />
        <TabButton 
          label="ASSESSMENT" 
          active={activeTab === 'assessment'} 
          onClick={() => setActiveTab('assessment')} 
        />
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        display: 'flex',
        padding: '24px 40px',
        paddingBottom: '140px',
        gap: '24px',
        overflow: 'hidden'
      }}>
        {activeTab === 'enabling' ? (
          <EnablingObjectivesTab
            modules={modules}
            enablingObjectives={enablingObjectives}
            selectedModule={selectedModule}
            selectedLesson={selectedLesson}
            onSelectModule={setSelectedModule}
            onSelectLesson={setSelectedLesson}
            onRunPKE={() => handleRunPKE(3)}
            isProcessing={isProcessing}
          />
        ) : (
          <AssessmentTab
            assessments={assessments}
            onRunPKE={() => handleRunPKE(4)}
            isProcessing={isProcessing}
          />
        )}
      </div>

      <Footer
        currentSection="build"
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

function TabButton({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '16px 24px',
        background: 'transparent',
        border: 'none',
        borderBottom: `2px solid ${active ? THEME.AMBER : 'transparent'}`,
        color: active ? THEME.AMBER : THEME.TEXT_SECONDARY,
        fontSize: '11px',
        letterSpacing: '2px',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
      }}
    >
      {label}
    </button>
  )
}

function EnablingObjectivesTab({ modules, enablingObjectives, selectedModule, selectedLesson, onSelectModule, onSelectLesson, onRunPKE, isProcessing }) {
  return (
    <>
      {/* Left: Module/Lesson Tree */}
      <div style={{ width: '280px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '11px', color: THEME.AMBER, letterSpacing: '2px' }}>MODULES</h3>
          <button
            onClick={onRunPKE}
            disabled={isProcessing}
            style={{
              padding: '6px 12px',
              background: THEME.GRADIENT_BUTTON,
              border: `1px solid ${THEME.AMBER}`,
              borderRadius: '4px',
              color: '#000',
              fontSize: '9px',
              letterSpacing: '1px',
              cursor: isProcessing ? 'not-allowed' : 'pointer',
              opacity: isProcessing ? 0.5 : 1
            }}
          >
            {isProcessing ? 'RUNNING...' : 'PKE GEN'}
          </button>
        </div>
        <div style={{
          flex: 1,
          background: 'rgba(0,0,0,0.3)',
          borderRadius: '8px',
          padding: '12px',
          overflowY: 'auto'
        }}>
          {modules.length === 0 ? (
            <div style={{ color: THEME.TEXT_MUTED, fontSize: '11px', textAlign: 'center', padding: '20px' }}>
              No modules yet. Define structure first.
            </div>
          ) : (
            modules.map((mod, idx) => (
              <ModuleItem
                key={mod.id}
                module={mod}
                index={idx}
                selected={selectedModule === mod.id}
                selectedLesson={selectedLesson}
                onSelect={() => onSelectModule(mod.id)}
                onSelectLesson={onSelectLesson}
              />
            ))
          )}
        </div>
      </div>

      {/* Right: Enabling Objectives List */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h3 style={{ fontSize: '11px', color: THEME.AMBER, letterSpacing: '2px' }}>
          ENABLING OBJECTIVES ({enablingObjectives.length})
        </h3>
        <div style={{
          flex: 1,
          background: 'rgba(0,0,0,0.3)',
          borderRadius: '8px',
          padding: '16px',
          overflowY: 'auto'
        }}>
          {enablingObjectives.length === 0 ? (
            <div style={{ color: THEME.TEXT_MUTED, fontSize: '12px', textAlign: 'center', padding: '40px' }}>
              No enabling objectives yet. Click "PKE GEN" to generate.
            </div>
          ) : (
            enablingObjectives.map((obj, idx) => (
              <ObjectiveCard key={obj.id} objective={obj} index={idx} />
            ))
          )}
        </div>
      </div>
    </>
  )
}

function AssessmentTab({ assessments, onRunPKE, isProcessing }) {
  return (
    <>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '11px', color: THEME.AMBER, letterSpacing: '2px' }}>
            ASSESSMENT ITEMS ({assessments.length})
          </h3>
          <button
            onClick={onRunPKE}
            disabled={isProcessing}
            style={{
              padding: '8px 16px',
              background: THEME.GRADIENT_BUTTON,
              border: `1px solid ${THEME.AMBER}`,
              borderRadius: '4px',
              color: '#000',
              fontSize: '10px',
              letterSpacing: '1px',
              cursor: isProcessing ? 'not-allowed' : 'pointer',
              opacity: isProcessing ? 0.5 : 1
            }}
          >
            {isProcessing ? 'GENERATING...' : 'PKE GENERATE'}
          </button>
        </div>
        <div style={{
          flex: 1,
          background: 'rgba(0,0,0,0.3)',
          borderRadius: '8px',
          padding: '16px',
          overflowY: 'auto'
        }}>
          {assessments.length === 0 ? (
            <div style={{ color: THEME.TEXT_MUTED, fontSize: '12px', textAlign: 'center', padding: '40px' }}>
              No assessment items yet. Click "PKE GENERATE" to create.
            </div>
          ) : (
            assessments.map((item, idx) => (
              <AssessmentCard key={item.id} item={item} index={idx} />
            ))
          )}
        </div>
      </div>

      {/* Assessment Types Legend */}
      <div style={{ width: '200px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h4 style={{ fontSize: '10px', color: THEME.TEXT_DIM, letterSpacing: '1px' }}>TYPES</h4>
        {ASSESSMENT_TYPES.map(type => (
          <div key={type.id} style={{
            padding: '8px 12px',
            background: 'rgba(255,255,255,0.02)',
            borderRadius: '4px',
            fontSize: '11px',
            color: THEME.TEXT_SECONDARY
          }}>
            {type.label}
          </div>
        ))}
      </div>
    </>
  )
}

function ModuleItem({ module, index, selected, selectedLesson, onSelect, onSelectLesson }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div style={{ marginBottom: '8px' }}>
      <div
        onClick={() => { onSelect(); setExpanded(!expanded) }}
        style={{
          padding: '10px 12px',
          background: selected ? 'rgba(212, 115, 12, 0.1)' : 'transparent',
          border: `1px solid ${selected ? THEME.AMBER : THEME.BORDER}`,
          borderRadius: '4px',
          cursor: 'pointer',
          display: 'flex',
