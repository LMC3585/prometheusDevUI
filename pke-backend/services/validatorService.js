/**
 * Validator Service
 * Validates generated content for coherence, level, and citations
 * 
 * From PKE Workflow: "Validator Agent - Coherence, level, citations"
 */

/**
 * Validate Invocation 1 output (Course Description)
 */
const validateInvocation1 = (result) => {
  const errors = [];
  const warnings = [];

  if (!result.description) {
    errors.push('Missing course description');
  } else {
    if (result.description.length < 100) {
      warnings.push('Description is quite short - consider expanding');
    }
    if (result.description.length > 2000) {
      warnings.push('Description is very long - consider condensing');
    }
  }

  if (!result.assistanceTier) {
    warnings.push('Assistance tier not specified - defaulting to "full"');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    score: calculateValidationScore(errors, warnings),
  };
};

/**
 * Validate Invocation 2 output (Learning Objectives)
 */
const validateInvocation2 = (result) => {
  const errors = [];
  const warnings = [];

  const objectives = result.learningObjectives || [];

  if (objectives.length === 0) {
    errors.push('No learning objectives generated');
  }

  if (objectives.length < 3) {
    warnings.push('Consider adding more learning objectives (recommended: 3-7)');
  }

  if (objectives.length > 10) {
    warnings.push('Many objectives - consider consolidating (recommended: 3-7)');
  }

  // Validate each objective
  objectives.forEach((lo, idx) => {
    if (!lo.text || lo.text.trim().length === 0) {
      errors.push(`Learning objective ${idx + 1} has no text`);
    }

    // Check for action verbs (simple check)
    const actionVerbs = ['identify', 'describe', 'explain', 'analyze', 'apply', 
                         'evaluate', 'create', 'design', 'develop', 'demonstrate',
                         'compare', 'contrast', 'list', 'define', 'summarize'];
    const hasActionVerb = actionVerbs.some(verb => 
      lo.text?.toLowerCase().includes(verb)
    );
    if (!hasActionVerb && lo.text) {
      warnings.push(`LO${idx + 1} may lack a measurable action verb`);
    }
  });

  // Check for Bloom's level distribution
  const bloomLevels = objectives.map(lo => lo.bloomLevel).filter(Boolean);
  if (bloomLevels.length > 0) {
    const uniqueLevels = [...new Set(bloomLevels)];
    if (uniqueLevels.length < 2) {
      warnings.push('Consider varying Bloom\'s taxonomy levels across objectives');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    score: calculateValidationScore(errors, warnings),
    objectiveCount: objectives.length,
  };
};

/**
 * Validate Invocation 3 output (Course Structure)
 */
const validateInvocation3 = (result) => {
  const errors = [];
  const warnings = [];

  const topics = result.topics || [];

  if (topics.length === 0) {
    errors.push('No topics generated');
  }

  // Validate structure depth
  let totalLessons = 0;
  let emptySubtopics = 0;

  topics.forEach((topic, tIdx) => {
    if (!topic.title) {
      errors.push(`Topic ${tIdx + 1} has no title`);
    }

    const subtopics = topic.subtopics || [];
    if (subtopics.length === 0) {
      warnings.push(`Topic "${topic.title}" has no subtopics`);
      emptySubtopics++;
    }

    subtopics.forEach((subtopic, sIdx) => {
      if (!subtopic.title) {
        errors.push(`Subtopic ${sIdx + 1} in "${topic.title}" has no title`);
      }

      const lessons = subtopic.lessons || [];
      totalLessons += lessons.length;

      if (lessons.length === 0) {
        warnings.push(`Subtopic "${subtopic.title}" has no lessons`);
      }
    });
  });

  if (totalLessons < 5) {
    warnings.push('Very few lessons - consider expanding the course structure');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    score: calculateValidationScore(errors, warnings),
    stats: {
      topicCount: topics.length,
      totalLessons,
      emptySubtopics,
    },
  };
};

/**
 * Validate Invocation 4 output (Full Build)
 */
const validateInvocation4 = (result) => {
  const errors = [];
  const warnings = [];

  // Validate topics
  const structureValidation = validateInvocation3({ topics: result.topics });
  errors.push(...structureValidation.errors);
  warnings.push(...structureValidation.warnings);

  // Validate assessments
  const assessments = result.assessments || [];
  if (assessments.length === 0) {
    warnings.push('No assessments generated');
  } else {
    assessments.forEach((assessment, idx) => {
      if (!assessment.question) {
        errors.push(`Assessment ${idx + 1} has no question`);
      }
      if (!assessment.correctAnswer) {
        warnings.push(`Assessment ${idx + 1} has no correct answer specified`);
      }
    });
  }

  // Check LO alignment
  const linkedLOs = assessments.filter(a => a.linkedLO).length;
  if (assessments.length > 0 && linkedLOs < assessments.length / 2) {
    warnings.push('Many assessments are not linked to learning objectives');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    score: calculateValidationScore(errors, warnings),
    stats: {
      ...structureValidation.stats,
      assessmentCount: assessments.length,
      linkedAssessments: linkedLOs,
    },
  };
};

/**
 * Calculate validation score
 */
const calculateValidationScore = (errors, warnings) => {
  const errorPenalty = errors.length * 20;
  const warningPenalty = warnings.length * 5;
  return Math.max(0, 100 - errorPenalty - warningPenalty);
};

/**
 * Validate content coherence (general check)
 */
const validateCoherence = (course) => {
  const issues = [];

  // Check if LOs align with description
  if (course.description && course.learningObjectives?.length > 0) {
    // Simple keyword overlap check
    const descWords = course.description.toLowerCase().split(/\s+/);
    const loTexts = course.learningObjectives.map(lo => lo.text?.toLowerCase() || '');
    
    const hasOverlap = loTexts.some(loText => 
      descWords.some(word => word.length > 4 && loText.includes(word))
    );

    if (!hasOverlap) {
      issues.push('Learning objectives may not align well with course description');
    }
  }

  return {
    coherent: issues.length === 0,
    issues,
  };
};

module.exports = {
  validateInvocation1,
  validateInvocation2,
  validateInvocation3,
  validateInvocation4,
  validateCoherence,
  calculateValidationScore,
};
