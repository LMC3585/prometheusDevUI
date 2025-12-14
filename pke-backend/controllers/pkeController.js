/**
 * PKE Controller
 * Handles help mode and UI assistance
 */

const { COURSE_STAGES } = require('../utils/constants');

/**
 * Help Mode
 * Provides context-aware assistance
 * POST /api/pke/help
 */
exports.helpMode = async (req, res, next) => {
  try {
    const { question, context } = req.body;

    // Basic help responses based on context
    const helpResponses = {
      define: 'In the Define stage, enter your course title, duration, level, and target audience. This information helps PKE generate relevant content.',
      design: 'In the Design stage, PKE will help you create learning objectives and course structure. Use the PKE button to start generation.',
      build: 'In the Build stage, PKE generates full course materials including lessons, activities, and assessments.',
      format: 'In the Format stage, you can customize the output format and apply templates.',
      generate: 'In the Generate stage, export your course to PowerPoint, Word, or Excel.',
    };

    const response = helpResponses[context?.stage] || 
      'Welcome to PKE! Start by defining your course in the Define stage.';

    res.json({
      success: true,
      data: {
        answer: response,
        suggestions: [
          'How do I create learning objectives?',
          'What are evidence grades?',
          'How do I export my course?',
        ]
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get available functionality based on state
 * GET /api/pke/functionality
 */
exports.getFunctionality = async (req, res, next) => {
  try {
    const isAuthenticated = !!req.user;

    const functionality = {
      helpMode: true,  // Always available
      invocations: isAuthenticated,
      export: isAuthenticated,
      templates: isAuthenticated && req.user?.role === 'admin',
    };

    res.json({
      success: true,
      data: { functionality }
    });
  } catch (error) {
    next(error);
  }
};
