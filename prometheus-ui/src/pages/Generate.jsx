/**
 * Generate Page - Content Generation & Export
 *
 * Features:
 * - Content Generation (Invocation 5)
 * - Export to various formats
 * - Progress tracking
 * - Download management
 */

import { useState, useCallback } from 'react'
import { THEME } from '../constants/theme'
import { useCourse } from '../context/CourseContext'
import { usePKE } from '../context/PKEContext'
import exportService from '../services/exportService'
import Header from '../components/Header'
import Footer from '../components/Footer'
import pkeButton from '../assets/PKE_Button.png'

// Generation items
const GENERATION_ITEMS = [
  { id: 'slides', label: 'Presentation Slides', icon: '📊', invocation: 5 },
  { id: 'handbook', label: 'Participant Handbook', icon: '📖', invocation: 5 },
  { id: 'lessonplans', label: 'Lesson Plans', icon: '📋', invocation: 5 },
  { id: 'assessments', label: 'Assessments', icon: '✅', invocation: 4 },
  { id: 'instructorguide', label: 'Instructor Guide', icon: '👨‍🏫', invocation: 5 }
]

// Export formats
const EXPORT_FORMATS = [
  { id: 'pptx', label: 'PowerPoint', ext: '.pptx', icon: '📊' },
  { id: 'docx', label: 'Word Document', ext: '.docx', icon: '📄' },
  { id: 'pdf', label: 'PDF', ext: '.pdf', icon: '📕' },
  { id: 'xlsx', label: 'Excel', ext: '.xlsx', icon: '📈' },
  { id: 'zip', label: 'Full Package', ext: '.zip', icon: '📦' }
]

function Generate({ onNavigate, onSave, onClear, onDelete, user, courseState, progress }) {
  const { currentCourse } = useCourse()
  const { 
    openPKE, 
    closePKE, 
    isActive: isPKEActive,
    executeInvocation,
    isProcessing,
    message,
    messageType,
    getProgress
  } = usePKE()

  // Local state
  const [generationQueue, setGenerationQueue] = useState([])
  const [generationStatus, setGenerationStatus] = useState({})
  const [downloads, setDownloads] = useState([])
  const [isExporting, setIsExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)

  // Handle navigation
  const handleNavigate = useCallback((section) => {
    onNavigate?.(section)
  }, [onNavigate])

  // Add item to generation queue
  const handleAddToQueue = useCallback((item) => {
    if (!generationQueue.find(q => q.id === item.id)) {
      setGenerationQueue(prev => [...prev, item])
      setGenerationStatus(prev => ({ ...prev, [item.id]: 'pending' }))
    }
  }, [generationQueue])

  // Remove item from queue
  const handleRemoveFromQueue = useCallback((itemId) => {
    setGenerationQueue(prev => prev.filter(q => q.id !== itemId))
    setGenerationStatus(prev => {
      const next = { ...prev }
      delete next[itemId]
      return next
    })
  }, [])

  // Generate single item
  const handleGenerateItem = useCallback(async (item) => {
    if (!currentCourse?.id) {
      alert('Please save the course first')
      return
    }

    setGenerationStatus(prev => ({ ...prev, [item.id]: 'generating' }))

    try {
      const result = await executeInvocation(item.invocation, {
        contentType: item.id,
        courseData: currentCourse
      })

      setGenerationStatus(prev => ({ ...prev, [item.id]: 'complete' }))

      // Add to downloads
      if (result?.downloadUrl) {
        setDownloads(prev => [...prev, {
          id: Date.now(),
          name: `${currentCourse.title || 'Course'} - ${item.label}`,
          type: item.id,
          url: result.downloadUrl,
          generatedAt: new Date().toISOString()
        }])
      }
    } catch (err) {
      console.error('Generation failed:', err)
      setGenerationStatus(prev => ({ ...prev, [item.id]: 'error' }))
    }
  }, [currentCourse, executeInvocation])

  // Generate all items in queue
  const handleGenerateAll = useCallback(async () => {
    for (const item of generationQueue) {
      if (generationStatus[item.id] !== 'complete') {
        await handleGenerateItem(item)
      }
    }
  }, [generationQueue, generationStatus, handleGenerateItem])

  // Export to specific format
  const handleExport = useCallback(async (format) => {
    if (!currentCourse?.id) {
      alert('Please save the course first')
      return
    }

    setIsExporting(true)
    setExportProgress(0)

    try {
      let blob
      const filename = `${currentCourse.title || 'Course'}_${new Date().toISOString().split('T')[0]}`

      // Simulate progress
      const progressInterval = setInterval(() => {
        setExportProgress(prev => Math.min(prev + 10, 90))
      }, 200)

      switch (format.id) {
        case 'pptx':
          blob = await exportService.exportPowerPoint(currentCourse.id)
          break
        case 'docx':
          blob = await exportService.exportHandbook(currentCourse.id)
          break
        case 'pdf':
          blob = await exportService.exportSummaryPDF(currentCourse.id)
          break
        case 'xlsx':
          blob = await exportService.exportScalar(currentCourse.id)
          break
        case 'zip':
          blob = await exportService.exportFullPackage(currentCourse.id)
          break
        default:
          throw new Error('Unknown format')
      }

      clearInterval(progressInterval)
      setExportProgress(100)

      // Download the file
      exportService.downloadBlob(blob, `${filename}${format.ext}`)

      // Add to downloads list
      setDownloads(prev => [...prev, {
        id: Date.now(),
        name: `${filename}${format.ext}`,
        type: format.id,
        generatedAt: new Date().toISOString(),
        size: blob.size
      }])

    } catch (err) {
      console.error('Export failed:', err)
      alert(`Export failed: ${err.message}`)
    } finally {
      setIsExporting(false)
      setExportProgress(0)
    }
  }, [currentCourse])

  // Clear downloads
  const handleClearDownloads = useCallback(() => {
    setDownloads([])
  }, [])

  // Get overall completion
  const completionPercent = getProgress()
  const canGenerate = completionPercent >= 60

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
      <Header pageTitle="GENERATE" />

      {/* Progress Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '12px 40px',
          gap: '16px',
          borderBottom: `1px solid ${THEME.BORDER}`
        }}
      >
        <img
          src={pkeButton}
          alt="PKE"
          onClick={() => openPKE(5)}
          style={{
            width: '28px',
            height: '28px',
            cursor: 'pointer',
            opacity: isPKEActive ? 1 : 0.7
          }}
        />
        <span style={{ fontSize: '10px', color: THEME.TEXT_DIM, letterSpacing: '1px' }}>
          COURSE COMPLETION
        </span>
        <div
          style={{
            flex: 1,
            maxWidth: '300px',
            height: '8px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '4px',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              width: `${completionPercent}%`,
              height: '100%',
              background: completionPercent >= 60 ? THEME.GRADIENT_BUTTON : '#F44336',
              transition: 'width 0.3s ease'
            }}
          />
        </div>
        <span
          style={{
            fontSize: '12px',
            color: completionPercent >= 60 ? THEME.AMBER : '#F44336',
            fontWeight: 'bold'
          }}
        >
          {completionPercent}%
        </span>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: '11px', color: THEME.TEXT_DIM }}>
          {currentCourse?.title || 'Untitled Course'}
        </span>
      </div>

      {/* Warning if not ready */}
      {!canGenerate && (
        <div
          style={{
            padding: '12px 40px',
            background: 'rgba(244, 67, 54, 0.1)',
            borderBottom: '1px solid #F44336',
            color: '#F44336',
            fontSize: '12px',
            fontFamily: THEME.FONT_MONO,
            letterSpacing: '1px'
          }}
        >
          ⚠️ Course completion must be at least 60% before generating content.
        </div>
      )}

      {/* PKE Message Bar */}
      {message && (
        <div
          style={{
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
          }}
        >
          {message}
        </div>
      )}

      {/* Main Content */}
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
        {/* Left Panel: Generation */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Available Items */}
          <div>
            <h3 style={{ fontSize: '11px', color: THEME.AMBER, letterSpacing: '2px', marginBottom: '12px' }}>
              AVAILABLE CONTENT
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {GENERATION_ITEMS.map(item => (
                <GenerationItemCard
                  key={item.id}
                  item={item}
                  inQueue={generationQueue.some(q => q.id === item.id)}
                  status={generationStatus[item.id]}
                  onAdd={() => handleAddToQueue(item)}
                  disabled={!canGenerate}
                />
              ))}
            </div>
          </div>

          {/* Generation Queue */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '11px', color: THEME.AMBER, letterSpacing: '2px' }}>
                GENERATION QUEUE ({generationQueue.length})
              </h3>
              {generationQueue.length > 0 && (
                <button
                  onClick={handleGenerateAll}
                  disabled={isProcessing || !canGenerate}
                  style={{
                    padding: '8px 20px',
                    background: THEME.GRADIENT_BUTTON,
                    border: `1px solid ${THEME.AMBER}`,
                    borderRadius: '4px',
                    color: '#000',
                    fontSize: '10px',
                    letterSpacing: '2px',
                    cursor: isProcessing || !canGenerate ? 'not-allowed' : 'pointer',
                    opacity: isProcessing || !canGenerate ? 0.5 : 1
                  }}
                >
                  {isProcessing ? 'GENERATING...' : 'GENERATE ALL'}
                </button>
              )}
            </div>

            <div
              style={{
                flex: 1,
                background: 'rgba(0,0,0,0.3)',
                borderRadius: '8px',
                padding: '16px',
                overflowY: 'auto'
              }}
            >
              {generationQueue.length === 0 ? (
                <div
                  style={{
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: THEME.TEXT_MUTED,
                    fontSize: '12px',
                    fontFamily: THEME.FONT_MONO
                  }}
                >
                  Click items above to add to generation queue
                </div>
              ) : (
                generationQueue.map((item, idx) => (
                  <QueueItem
                    key={item.id}
                    item={item}
                    index={idx}
                    status={generationStatus[item.id]}
                    onRemove={() => handleRemoveFromQueue(item.id)}
                    onGenerate={() => handleGenerateItem(item)}
                    isProcessing={isProcessing}
                  />
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Panel: Export & Downloads */}
        <div style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Quick Export */}
          <div>
            <h3 style={{ fontSize: '11px', color: THEME.AMBER, letterSpacing: '2px', marginBottom: '12px' }}>
              QUICK EXPORT
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {EXPORT_FORMATS.map(format => (
                <ExportButton
                  key={format.id}
                  format={format}
                  onClick={() => handleExport(format)}
                  disabled={isExporting || !canGenerate}
                />
              ))}
            </div>

            {/* Export Progress */}
            {isExporting && (
              <div style={{ marginTop: '12px' }}>
                <div
                  style={{
                    height: '4px',
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '2px',
                    overflow: 'hidden'
                  }}
                >
                  <div
                    style={{
                      width: `${exportProgress}%`,
                      height: '100%',
                      background: THEME.AMBER,
                      transition: 'width 0.2s ease'
                    }}
                  />
                </div>
                <div style={{ fontSize: '10px', color: THEME.TEXT_DIM, marginTop: '4px', textAlign: 'center' }}>
                  Exporting... {exportProgress}%
                </div>
              </div>
            )}
          </div>

          {/* Downloads */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '11px', color: THEME.AMBER, letterSpacing: '2px' }}>
                DOWNLOADS ({downloads.length})
              </h3>
              {downloads.length > 0 && (
                <button
                  onClick={handleClearDownloads}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: THEME.TEXT_MUTED,
                    fontSize: '10px',
                    cursor: 'pointer'
                  }}
                >
                  CLEAR
                </button>
              )}
            </div>

            <div
              style={{
                flex: 1,
                background: 'rgba(0,0,0,0.3)',
                borderRadius: '8px',
                padding: '12px',
                overflowY: 'auto'
              }}
            >
              {downloads.length === 0 ? (
                <div
                  style={{
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: THEME.TEXT_MUTED,
                    fontSize: '11px',
                    fontFamily: THEME.FONT_MONO,
                    textAlign: 'center'
                  }}
                >
                  Generated files will appear here
                </div>
              ) : (
                downloads.map(download => (
                  <DownloadItem key={download.id} download={download} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer
        currentSection="generate"
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

function GenerationItemCard({ item, inQueue, status, onAdd, disabled }) {
  const statusColors = {
    pending: THEME.TEXT_MUTED,
    generating: THEME.AMBER,
    complete: '#4CAF50',
    error: '#F44336'
  }

  return (
    <button
      onClick={onAdd}
      disabled={disabled || inQueue}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '12px 16px',
        background: inQueue ? 'rgba(212, 115, 12, 0.1)' : 'rgba(255,255,255,0.02)',
        border: `1px solid ${inQueue ? THEME.AMBER : THEME.BORDER}`,
        borderRadius: '4px',
        cursor: disabled || inQueue ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'all 0.2s ease'
      }}
    >
      <span style={{ fontSize: '20px' }}>{item.icon}</span>
      <span style={{ fontSize: '11px', color: inQueue ? THEME.AMBER : THEME.TEXT_PRIMARY }}>
        {item.label}
      </span>
      {status && (
        <span
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: statusColors[status],
            marginLeft: '4px'
          }}
        />
      )}
    </button>
  )
}

function QueueItem({ item, index, status, onRemove, onGenerate, isProcessing }) {
  const statusLabels = {
    pending: 'Pending',
    generating: 'Generating...',
    complete: 'Complete',
    error: 'Error'
  }

  const statusColors = {
    pending: THEME.TEXT_MUTED,
    generating: THEME.AMBER,
    complete: '#4CAF50',
    error: '#F44336'
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '12px',
        marginBottom: '8px',
        background: 'rgba(255,255,255,0.02)',
        border: `1px solid ${THEME.BORDER}`,
        borderRadius: '4px'
      }}
    >
      <span style={{ fontSize: '20px', marginRight: '12px' }}>{item.icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '11px', color: THEME.TEXT_PRIMARY }}>{item.label}</div>
        <div style={{ fontSize: '9px', color: statusColors[status], marginTop: '2px' }}>
          {statusLabels[status]}
        </div>
      </div>
      {status === 'pending' && (
        <>
          <button
            onClick={onGenerate}
            disabled={isProcessing}
            style={{
              padding: '4px 12px',
              background: 'transparent',
              border: `1px solid ${THEME.AMBER}`,
              borderRadius: '3px',
              color: THEME.AMBER,
              fontSize: '9px',
              cursor: isProcessing ? 'not-allowed' : 'pointer',
              marginRight: '8px'
            }}
          >
            RUN
          </button>
          <button
            onClick={onRemove}
            style={{
              background: 'transparent',
              border: 'none',
              color: THEME.TEXT_MUTED,
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            ✕
          </button>
        </>
      )}
      {status === 'generating' && (
        <div
          style={{
            width: '20px',
            height: '20px',
            border: `2px solid ${THEME.AMBER}`,
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}
        />
      )}
      {status === 'complete' && (
        <span style={{ color: '#4CAF50', fontSize: '16px' }}>✓</span>
      )}
      {status === 'error' && (
        <button
          onClick={onGenerate}
          style={{
            padding: '4px 12px',
            background: 'transparent',
            border: '1px solid #F44336',
            borderRadius: '3px',
            color: '#F44336',
            fontSize: '9px',
            cursor: 'pointer'
          }}
        >
          RETRY
        </button>
      )}
    </div>
  )
}

function ExportButton({ format, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 16px',
        background: 'rgba(255,255,255,0.02)',
        border: `1px solid ${THEME.BORDER}`,
        borderRadius: '4px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'all 0.2s ease'
      }}
    >
      <span style={{ fontSize: '20px' }}>{format.icon}</span>
      <div style={{ flex: 1, textAlign: 'left' }}>
        <div style={{ fontSize: '11px', color: THEME.TEXT_PRIMARY }}>{format.label}</div>
        <div style={{ fontSize: '9px', color: THEME.TEXT_MUTED }}>{format.ext}</div>
      </div>
      <span style={{ color: THEME.AMBER, fontSize: '12px' }}>→</span>
    </button>
  )
}

function DownloadItem({ download }) {
  const formatSize = (bytes) => {
    if (!bytes) return ''
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const formatTime = (iso) => {
    return new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '10px',
        marginBottom: '6px',
        background: 'rgba(255,255,255,0.02)',
        borderRadius: '4px'
      }}
    >
      <span style={{ fontSize: '16px', marginRight: '10px' }}>📥</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: '10px',
            color: THEME.TEXT_PRIMARY,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {download.name}
        </div>
        <div style={{ fontSize: '9px', color: THEME.TEXT_MUTED }}>
          {formatTime(download.generatedAt)}
          {download.size && ` • ${formatSize(download.size)}`}
        </div>
      </div>
    </div>
  )
}

export default Generate
