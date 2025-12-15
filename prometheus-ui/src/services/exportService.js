import { TokenManager, ApiError } from './api'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const exportService = {
  // Export PowerPoint
  exportPowerPoint: async (courseId) => {
    return downloadFile(`/export/${courseId}/pptx`, 'presentation.pptx')
  },

  // Export Handbook
  exportHandbook: async (courseId) => {
    return downloadFile(`/export/${courseId}/handbook`, 'handbook.docx')
  },

  // Export Lesson Plans
  exportLessonPlans: async (courseId) => {
    return downloadFile(`/export/${courseId}/lesson-plans`, 'lesson-plans.docx')
  },

  // Export Assessments
  exportAssessments: async (courseId) => {
    return downloadFile(`/export/${courseId}/assessments`, 'assessments.docx')
  },

  // Export Scalar Matrix
  exportScalar: async (courseId) => {
    return downloadFile(`/export/${courseId}/scalar`, 'scalar-matrix.xlsx')
  },

  // Export Full Package (ZIP)
  exportFullPackage: async (courseId) => {
    return downloadFile(`/export/${courseId}/package`, 'course-package.zip')
  },

  // Export Summary PDF
  exportSummaryPDF: async (courseId) => {
    return downloadFile(`/export/${courseId}/summary`, 'summary.pdf')
  },

  // Download blob utility
  downloadBlob: (blob, filename) => {
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }
}

// Helper function to download files
async function downloadFile(endpoint, defaultFilename) {
  const token = TokenManager.getToken()
  const headers = {}
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: 'GET',
    headers
  })

  if (!response.ok) {
    throw new ApiError('Download failed', response.status)
  }

  return response.blob()
}

export default exportService
