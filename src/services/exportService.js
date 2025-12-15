/**
 * Export Service
 * 
 * Handles all document export/download operations:
 * - PowerPoint generation
 * - Handbook export
 * - Lesson plans
 * - Assessment documents
 * - Scalar matrix
 * - Full course package
 */

import api from './api'

const exportService = {
  // ==========================================
  // Document Generation
  // ==========================================
  
  /**
   * Export course as PowerPoint
   * @param {string} courseId
   * @param {Object} options - { template, includeNotes }
   * @returns {Promise<Blob>}
   */
  exportPowerPoint: async (courseId, options = {}) => {
    return api.download(`/export/${courseId}/pptx?${new URLSearchParams(options)}`)
  },
  
  /**
   * Export individual lesson slides
   * @param {string} courseId
   * @param {string} lessonId
   * @param {Object} options
   * @returns {Promise<Blob>}
   */
  exportLessonSlides: async (courseId, lessonId, options = {}) => {
    return api.download(`/export/${courseId}/lessons/${lessonId}/pptx?${new URLSearchParams(options)}`)
  },
  
  /**
   * Export participant handbook
   * @param {string} courseId
   * @param {Object} options - { template, format }
   * @returns {Promise<Blob>}
   */
  exportHandbook: async (courseId, options = {}) => {
    return api.download(`/export/${courseId}/handbook?${new URLSearchParams(options)}`)
  },
  
  /**
   * Export lesson plans
   * @param {string} courseId
   * @param {Object} options
   * @returns {Promise<Blob>}
   */
  exportLessonPlan: async (courseId, options = {}) => {
    return api.download(`/export/${courseId}/lesson-plans?${new URLSearchParams(options)}`)
  },
  
  /**
   * Export instructor guide
   * @param {string} courseId
   * @param {Object} options
   * @returns {Promise<Blob>}
   */
  exportInstructorGuide: async (courseId, options = {}) => {
    return api.download(`/export/${courseId}/instructor-guide?${new URLSearchParams(options)}`)
  },
  
  /**
   * Export scalar matrix as Excel
   * @param {string} courseId
   * @param {Object} options
   * @returns {Promise<Blob>}
   */
  exportScalar: async (courseId, options = {}) => {
    return api.download(`/export/${courseId}/scalar?${new URLSearchParams(options)}`)
  },
  
  /**
   * Export assessments
   * @param {string} courseId
   * @param {Object} options - { type, format }
   * @returns {Promise<Blob>}
   */
  exportAssessments: async (courseId, options = {}) => {
    return api.download(`/export/${courseId}/assessments?${new URLSearchParams(options)}`)
  },
  
  /**
   * Export course data as JSON
   * @param {string} courseId
   * @returns {Promise<Blob>}
   */
  exportCourseData: async (courseId) => {
    return api.download(`/export/${courseId}/data`)
  },
  
  /**
   * Export course summary PDF
   * @param {string} courseId
   * @param {Object} options
   * @returns {Promise<Blob>}
   */
  exportSummaryPDF: async (courseId, options = {}) => {
    return api.download(`/export/${courseId}/summary?${new URLSearchParams(options)}`)
  },
  
  /**
   * Export assessment PDF
   * @param {string} courseId
   * @param {Object} options
   * @returns {Promise<Blob>}
   */
  exportAssessmentPDF: async (courseId, options = {}) => {
    return api.download(`/export/${courseId}/assessment-pdf?${new URLSearchParams(options)}`)
  },
  
  /**
   * Export full course package (ZIP)
   * @param {string} courseId
   * @param {Object} options - { include: ['pptx', 'handbook', 'lessonPlans', 'assessments'] }
   * @returns {Promise<Blob>}
   */
  exportFullPackage: async (courseId, options = {}) => {
    return api.download(`/export/${courseId}/package?${new URLSearchParams(options)}`)
  },
  
  // ==========================================
  // Utility Methods
  // ==========================================
  
  /**
   * Get available export options for course
   * @param {string} courseId
   * @returns {Promise<Object>}
   */
  getExportOptions: async (courseId) => {
    const response = await api.get(`/export/${courseId}/options`)
    return response
  },
  
  /**
   * Get export history
   * @param {string} courseId
   * @returns {Promise<Array>}
   */
  getExportHistory: async (courseId) => {
    const response = await api.get(`/export/${courseId}/history`)
    return response.history || response
  },
  
  /**
   * Download blob as file
   * @param {Blob} blob
   * @param {string} filename
   */
  downloadBlob: (blob, filename) => {
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  },
  
  /**
   * Get file extension for export type
   * @param {string} type
   * @returns {string}
   */
  getExtension: (type) => {
    const extensions = {
      pptx: '.pptx',
      docx: '.docx',
      pdf: '.pdf',
      xlsx: '.xlsx',
      json: '.json',
      zip: '.zip'
    }
    return extensions[type] || ''
  }
}

export default exportService
