/**
 * Course Context - Manages course state
 */

import { createContext, useContext, useState, useCallback } from 'react'
import courseService from '../services/courseService'

const CourseContext = createContext(null)

const EMPTY_COURSE = {
  id: null,
  title: '',
  code: '',
  description: '',
  terminalObjectives: [],
  enablingObjectives: [],
  modules: [],
  assessments: [],
  metadata: {
    createdAt: null,
    updatedAt: null,
    version: '1.0'
  }
}

export function CourseProvider({ children }) {
  const [currentCourse, setCurrentCourse] = useState({ ...EMPTY_COURSE })
  const [courses, setCourses] = useState([])
  const [isDirty, setIsDirty] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Create new course
  const createCourse = useCallback(async (courseData) => {
    setIsLoading(true)
    setError(null)
    try {
      const newCourse = await courseService.createCourse(courseData)
      setCurrentCourse(newCourse)
      setIsDirty(false)
      return newCourse
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Load course by ID
  const loadCourse = useCallback(async (courseId) => {
    setIsLoading(true)
    setError(null)
    try {
      const course = await courseService.getCourse(courseId)
      setCurrentCourse(course)
      setIsDirty(false)
      return course
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Save current course
  const saveCourse = useCallback(async () => {
    if (!currentCourse) return null
    setIsLoading(true)
    setError(null)
    try {
      let saved
      if (currentCourse.id) {
        saved = await courseService.updateCourse(currentCourse.id, currentCourse)
      } else {
        saved = await courseService.createCourse(currentCourse)
      }
      setCurrentCourse(saved)
      setIsDirty(false)
      return saved
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [currentCourse])

  // Update course field
  const updateCourse = useCallback((field, value) => {
    setCurrentCourse(prev => ({
      ...prev,
      [field]: value
    }))
    setIsDirty(true)
  }, [])

  // Update nested course data
  const updateCourseData = useCallback((path, value) => {
    setCurrentCourse(prev => {
      const newCourse = { ...prev }
      const keys = path.split('.')
      let current = newCourse
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] }
        current = current[keys[i]]
      }
      current[keys[keys.length - 1]] = value
      return newCourse
    })
    setIsDirty(true)
  }, [])

  // Clear current course
  const clearCourse = useCallback(() => {
    setCurrentCourse({ ...EMPTY_COURSE })
    setIsDirty(false)
    setError(null)
  }, [])

  // Delete course
  const deleteCourse = useCallback(async (courseId) => {
    setIsLoading(true)
    setError(null)
    try {
      await courseService.deleteCourse(courseId || currentCourse?.id)
      if (courseId === currentCourse?.id || !courseId) {
        clearCourse()
      }
      setCourses(prev => prev.filter(c => c.id !== courseId))
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [currentCourse, clearCourse])

  // List all courses
  const listCourses = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const list = await courseService.listCourses()
      setCourses(list)
      return list
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Add terminal objective
  const addTerminalObjective = useCallback((objective) => {
    setCurrentCourse(prev => ({
      ...prev,
      terminalObjectives: [...(prev.terminalObjectives || []), {
        id: `TO-${Date.now()}`,
        ...objective
      }]
    }))
    setIsDirty(true)
  }, [])

  // Update terminal objective
  const updateTerminalObjective = useCallback((id, updates) => {
    setCurrentCourse(prev => ({
      ...prev,
      terminalObjectives: (prev.terminalObjectives || []).map(obj =>
        obj.id === id ? { ...obj, ...updates } : obj
      )
    }))
    setIsDirty(true)
  }, [])

  // Delete terminal objective
  const deleteTerminalObjective = useCallback((id) => {
    setCurrentCourse(prev => ({
      ...prev,
      terminalObjectives: (prev.terminalObjectives || []).filter(obj => obj.id !== id)
    }))
    setIsDirty(true)
  }, [])

  // Add enabling objective
  const addEnablingObjective = useCallback((terminalId, objective) => {
    setCurrentCourse(prev => ({
      ...prev,
      enablingObjectives: [...(prev.enablingObjectives || []), {
        id: `EO-${Date.now()}`,
        terminalObjectiveId: terminalId,
        ...objective
      }]
    }))
    setIsDirty(true)
  }, [])

  // Add module
  const addModule = useCallback((module) => {
    setCurrentCourse(prev => ({
      ...prev,
      modules: [...(prev.modules || []), {
        id: `MOD-${Date.now()}`,
        lessons: [],
        ...module
      }]
    }))
    setIsDirty(true)
  }, [])

  // Add lesson to module
  const addLesson = useCallback((moduleId, lesson) => {
    setCurrentCourse(prev => ({
      ...prev,
      modules: (prev.modules || []).map(mod =>
        mod.id === moduleId
          ? { ...mod, lessons: [...(mod.lessons || []), { id: `LES-${Date.now()}`, ...lesson }] }
          : mod
      )
    }))
    setIsDirty(true)
  }, [])

  const value = {
    currentCourse,
    courses,
    isDirty,
    isLoading,
    error,
    createCourse,
    loadCourse,
    saveCourse,
    updateCourse,
    updateCourseData,
    clearCourse,
    deleteCourse,
    listCourses,
    addTerminalObjective,
    updateTerminalObjective,
    deleteTerminalObjective,
    addEnablingObjective,
    addModule,
    addLesson,
    EMPTY_COURSE
  }

  return (
    <CourseContext.Provider value={value}>
      {children}
    </CourseContext.Provider>
  )
}

export function useCourse() {
  const context = useContext(CourseContext)
  if (!context) {
    throw new Error('useCourse must be used within a CourseProvider')
  }
  return context
}

export default CourseContext
