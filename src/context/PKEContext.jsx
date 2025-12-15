/**
 * PKE Context - Prometheus Knowledge Engine State Management
 * 
 * Provides:
 * - PKE invocation state
 * - Execute/Accept/Revise operations
 * - Progress tracking
 */

import { createContext, useContext, useState, useCallback } from 'react'
import pkeService from '../services/pkeService'
import { useCourse } from './CourseContext'

const PKEContext = createContext(null)

// Invocation names for display
export const INVOCATION_NAMES = {
  1: 'Validate Objectives',
  2: 'Generate Structure',
  3: 'Generate Enabling Objectives',
  4: 'Generate Assessment',
  5: 'Generate Content'
}

// Initial state for each invocation
const INITIAL_INVOCATION_STATE = {
  1: { status: 'pending', result: null, history: [] },
  2: { status: 'pending', result: null, history: [] },
  3: { status: 'pending', result: null, history: [] },
  4: { status: 'pending', result: null, history: [] },
  5: { status: 'pending', result: null, history: [] }
}

export function PKEProvider({ children }) {
  const { currentCourse } = useCourse()
  
  const [isActive, setIsActive] = useState(false)
  const [currentInvocation, setCurrentInvocation] = useState(1)
  const [invocations, setInvocations] = useState({ ...INITIAL_INVOCATION_STATE })
  const [pendingResult, setPendingResult] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('info') // info, success, error, warning

  // ==========================================
  // PKE Control
  // ==========================================

  /**
   * Open PKE interface
   */
  const openPKE = useCallback((invocation = null) => {
    setIsActive(true)
    if (invocation) {
      setCurrentInvocation(invocation)
    }
  }, [])

  /**
   * Close PKE interface
   */
  const closePKE = useCallback(() => {
    setIsActive(false)
    setMessage('')
  }, [])

  /**
   * Set current invocation
   */
  const setInvocation = useCallback((num) => {
    setCurrentInvocation(num)
  }, [])

  // ==========================================
  // Invocation Operations
  // ==========================================

  /**
   * Execute an invocation
   */
  const executeInvocation = useCallback(async (invocationNum, data = {}) => {
    if (!currentCourse?.id) {
      setMessage('Please save the course first')
      setMessageType('error')
      return null
    }

    setIsProcessing(true)
    setMessage(`Running ${INVOCATION_NAMES[invocationNum]}...`)
    setMessageType('info')

    try {
      const result = await pkeService.invoke(currentCourse.id, invocationNum, data)
      
      setInvocations(prev => ({
        ...prev,
        [invocationNum]: {
          ...prev[invocationNum],
          status: 'review',
          result: result
        }
      }))
      
      setPendingResult(result)
      setMessage(`${INVOCATION_NAMES[invocationNum]} complete. Review the results.`)
      setMessageType('success')
      
      return result
    } catch (err) {
      setMessage(`Error: ${err.message}`)
      setMessageType('error')
      
      setInvocations(prev => ({
        ...prev,
        [invocationNum]: {
          ...prev[invocationNum],
          status: 'error'
        }
      }))
      
      throw err
    } finally {
      setIsProcessing(false)
    }
  }, [currentCourse?.id])

  /**
   * Accept invocation result
   */
  const acceptInvocation = useCallback(async (invocationNum, data = null) => {
    if (!currentCourse?.id) {
      setMessage('Please save the course first')
      setMessageType('error')
      return null
    }

    setIsProcessing(true)
    setMessage('Accepting results...')
    setMessageType('info')

    try {
      const acceptData = data || pendingResult
      const result = await pkeService.accept(currentCourse.id, invocationNum, acceptData)
      
      setInvocations(prev => ({
        ...prev,
        [invocationNum]: {
          ...prev[invocationNum],
          status: 'complete',
          history: [...prev[invocationNum].history, { action: 'accept', data: acceptData }]
        }
      }))
      
      setPendingResult(null)
      setMessage(`${INVOCATION_NAMES[invocationNum]} accepted!`)
      setMessageType('success')
      
      // Auto-advance to next invocation if not at end
      if (invocationNum < 5) {
        setCurrentInvocation(invocationNum + 1)
      }
      
      return result
    } catch (err) {
      setMessage(`Error: ${err.message}`)
      setMessageType('error')
      throw err
    } finally {
      setIsProcessing(false)
    }
  }, [currentCourse?.id, pendingResult])

  /**
   * Revise invocation with feedback
   */
  const reviseInvocation = useCallback(async (invocationNum, feedback, data = null) => {
    if (!currentCourse?.id) {
      setMessage('Please save the course first')
      setMessageType('error')
      return null
    }

    setIsProcessing(true)
    setMessage('Revising with your feedback...')
    setMessageType('info')

    try {
      const reviseData = { feedback, ...(data || pendingResult) }
      const result = await pkeService.revise(currentCourse.id, invocationNum, reviseData)
      
      setInvocations(prev => ({
        ...prev,
        [invocationNum]: {
          ...prev[invocationNum],
          status: 'review',
          result: result,
          history: [...prev[invocationNum].history, { action: 'revise', feedback }]
        }
      }))
      
      setPendingResult(result)
      setMessage('Revision complete. Review the updated results.')
      setMessageType('success')
      
      return result
    } catch (err) {
      setMessage(`Error: ${err.message}`)
      setMessageType('error')
      throw err
    } finally {
      setIsProcessing(false)
    }
  }, [currentCourse?.id, pendingResult])

  /**
   * Reset an invocation
   */
  const resetInvocation = useCallback(async (invocationNum) => {
    if (!currentCourse?.id) {
      // Just reset local state
      setInvocations(prev => ({
        ...prev,
        [invocationNum]: { ...INITIAL_INVOCATION_STATE[invocationNum] }
      }))
      return
    }

    try {
      await pkeService.resetInvocation(currentCourse.id, invocationNum)
      
      setInvocations(prev => ({
        ...prev,
        [invocationNum]: { ...INITIAL_INVOCATION_STATE[invocationNum] }
      }))
      
      setMessage(`${INVOCATION_NAMES[invocationNum]} reset`)
      setMessageType('info')
    } catch (err) {
      setMessage(`Error: ${err.message}`)
      setMessageType('error')
    }
  }, [currentCourse?.id])

  // ==========================================
  // Utility Methods
  // ==========================================

  /**
   * Get invocation status
   */
  const getInvocationStatus = useCallback((invocationNum) => {
    return invocations[invocationNum]?.status || 'pending'
  }, [invocations])

  /**
   * Get invocation result
   */
  const getInvocationResult = useCallback((invocationNum) => {
    return invocations[invocationNum]?.result || null
  }, [invocations])

  /**
   * Check if can execute invocation
   */
  const canExecuteInvocation = useCallback((invocationNum) => {
    // First invocation always available
    if (invocationNum === 1) return true
    
    // Others require previous to be complete
    const prevStatus = invocations[invocationNum - 1]?.status
    return prevStatus === 'complete'
  }, [invocations])

  /**
   * Get overall progress percentage
   */
  const getProgress = useCallback(() => {
    const completed = Object.values(invocations).filter(i => i.status === 'complete').length
    return Math.round((completed / 5) * 100)
  }, [invocations])

  /**
   * Reset all PKE state
   */
  const resetPKE = useCallback(() => {
    setInvocations({ ...INITIAL_INVOCATION_STATE })
    setPendingResult(null)
    setCurrentInvocation(1)
    setMessage('')
  }, [])

  const value = {
    // State
    isActive,
    currentInvocation,
    invocations,
    pendingResult,
    isProcessing,
    message,
    messageType,
    
    // Control
    openPKE,
    closePKE,
    setInvocation,
    
    // Operations
    executeInvocation,
    acceptInvocation,
    reviseInvocation,
    resetInvocation,
    
    // Utilities
    getInvocationStatus,
    getInvocationResult,
    canExecuteInvocation,
    getProgress,
    resetPKE
  }

  return (
    <PKEContext.Provider value={value}>
      {children}
    </PKEContext.Provider>
  )
}

export function usePKE() {
  const context = useContext(PKEContext)
  if (!context) {
    throw new Error('usePKE must be used within a PKEProvider')
  }
  return context
}

export default PKEContext
