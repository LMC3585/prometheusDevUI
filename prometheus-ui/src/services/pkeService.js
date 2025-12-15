import api from './api'

const pkeService = {
  // Invocation 1: Validate Objectives
  validateObjectives: async (data) => {
    return api.post('/pke/invoke/1', data)
  },
  acceptValidation: async (resultId) => {
    return api.post(`/pke/accept/1/${resultId}`)
  },
  reviseValidation: async (resultId, feedback) => {
    return api.post(`/pke/revise/1/${resultId}`, { feedback })
  },

  // Invocation 2: Generate Structure
  generateStructure: async (data) => {
    return api.post('/pke/invoke/2', data)
  },
  acceptStructure: async (resultId) => {
    return api.post(`/pke/accept/2/${resultId}`)
  },
  reviseStructure: async (resultId, feedback) => {
    return api.post(`/pke/revise/2/${resultId}`, { feedback })
  },

  // Invocation 3: Enabling Objectives
  generateEnablingObjectives: async (data) => {
    return api.post('/pke/invoke/3', data)
  },
  acceptEnablingObjectives: async (resultId) => {
    return api.post(`/pke/accept/3/${resultId}`)
  },
  reviseEnablingObjectives: async (resultId, feedback) => {
    return api.post(`/pke/revise/3/${resultId}`, { feedback })
  },

  // Invocation 4: Assessment Items
  generateAssessment: async (data) => {
    return api.post('/pke/invoke/4', data)
  },
  acceptAssessment: async (resultId) => {
    return api.post(`/pke/accept/4/${resultId}`)
  },
  reviseAssessment: async (resultId, feedback) => {
    return api.post(`/pke/revise/4/${resultId}`, { feedback })
  },

  // Invocation 5: Content Generation
  generateContent: async (data) => {
    return api.post('/pke/invoke/5', data)
  },
  acceptContent: async (resultId) => {
    return api.post(`/pke/accept/5/${resultId}`)
  },
  reviseContent: async (resultId, feedback) => {
    return api.post(`/pke/revise/5/${resultId}`, { feedback })
  },

  // Get invocation status
  getStatus: async (invocationNumber, resultId) => {
    return api.get(`/pke/status/${invocationNumber}/${resultId}`)
  },

  // Get invocation history
  getHistory: async (courseId) => {
    return api.get(`/pke/history/${courseId}`)
  }
}

export default pkeService
