/**
 * Course Controller
 * Handles course CRUD operations
 */

const Course = require('../models/Course');
const auditService = require('../services/auditService');
const { COURSE_STAGES, GATES } = require('../utils/constants');

/**
 * Create a new course
 * POST /api/courses
 */
exports.createCourse = async (req, res, next) => {
  try {
    const { title, duration, level, theme, targetAudience } = req.body;

    // Title is optional at creation (Gate B not required yet)
    const course = new Course({
      owner: req.user.id,
      title: title || '',
      metadata: {
        duration: duration || { value: 1, unit: 'days' },
        level: level || 'intermediate',
        theme: theme || '',
        targetAudience: targetAudience || ''
      }
    });

    await course.save();

    // Log course creation
    await auditService.logCourseCreated({
      courseId: course._id,
      userId: req.user.id
    });

    res.status(201).json({
      success: true,
      data: { course }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all courses for current user
 * GET /api/courses
 */
exports.getCourses = async (req, res, next) => {
  try {
    const { 
      status, 
      stage,
      search,
      page = 1, 
      limit = 20,
      sortBy = 'updatedAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query - owned or collaborated
    const query = {
      $or: [
        { owner: req.user.id },
        { collaborators: req.user.id }
      ]
    };

    // Apply filters
    if (status) query.status = status;
    if (stage) query.currentStage = stage;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { 'metadata.theme': { $regex: search, $options: 'i' } }
      ];
    }

    // Execute query with pagination
    const total = await Course.countDocuments(query);
    const courses = await Course.find(query)
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('owner', 'name email')
      .lean();

    res.json({
      success: true,
      data: {
        courses,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single course
 * GET /api/courses/:id
 */
exports.getCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('collaborators', 'name email');

    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      });
    }

    // Check access
    const hasAccess = 
      course.owner._id.toString() === req.user.id ||
      course.collaborators.some(c => c._id.toString() === req.user.id);

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: { course }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update course
 * PUT /api/courses/:id
 */
exports.updateCourse = async (req, res, next) => {
  try {
    const { title, description, metadata, learningObjectives, structure } = req.body;

    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      });
    }

    // Check ownership
    if (course.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Only course owner can update'
      });
    }

    // Update fields
    if (title !== undefined) course.title = title;
    if (description !== undefined) course.description = description;
    if (metadata) course.metadata = { ...course.metadata, ...metadata };
    if (learningObjectives) course.learningObjectives = learningObjectives;
    if (structure) course.structure = structure;

    // Add to revision history
    course.revisionHistory.push({
      version: course.revisionHistory.length + 1,
      changedBy: req.user.id,
      changeType: 'UPDATE',
      summary: 'Course updated',
    });

    await course.save();

    res.json({
      success: true,
      data: { course }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete (archive) course
 * DELETE /api/courses/:id
 */
exports.deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      });
    }

    // Check ownership
    if (course.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Only course owner can delete'
      });
    }

    // Soft delete - archive instead of remove
    course.status = 'archived';
    await course.save();

    res.json({
      success: true,
      message: 'Course archived successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Save course title (Gate B)
 * PUT /api/courses/:id/title
 */
exports.saveTitle = async (req, res, next) => {
  try {
    const { title } = req.body;

    if (!title || title.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Title is required'
      });
    }

    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      });
    }

    // Check ownership
    if (course.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Only course owner can update title'
      });
    }

    course.title = title.trim();
    course.gates.gateB = true;

    // Add to revision history
    course.revisionHistory.push({
      version: course.revisionHistory.length + 1,
      changedBy: req.user.id,
      changeType: 'TITLE_SAVED',
      summary: `Title set to: ${title}`,
    });

    await course.save();

    // Log Gate B passed
    await auditService.log({
      action: 'GATE_PASSED',
      userId: req.user.id,
      courseId: course._id,
      courseTitle: course.title,
      metadata: { gate: 'B' }
    });

    res.json({
      success: true,
      data: { 
        course,
        gateB: true,
        message: 'Gate B passed - you can now use PKE generation'
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add collaborator
 * POST /api/courses/:id/collaborators
 */
exports.addCollaborator = async (req, res, next) => {
  try {
    const { email } = req.body;
    const User = require('../models/User');

    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      });
    }

    // Check ownership
    if (course.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Only course owner can add collaborators'
      });
    }

    // Find user by email
    const collaborator = await User.findOne({ email: email.toLowerCase() });
    if (!collaborator) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Check if already collaborator
    if (course.collaborators.includes(collaborator._id)) {
      return res.status(400).json({
        success: false,
        error: 'User is already a collaborator'
      });
    }

    course.collaborators.push(collaborator._id);
    await course.save();

    res.json({
      success: true,
      message: 'Collaborator added',
      data: { collaborator: { id: collaborator._id, email: collaborator.email, name: collaborator.name } }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Remove collaborator
 * DELETE /api/courses/:id/collaborators/:userId
 */
exports.removeCollaborator = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      });
    }

    // Check ownership
    if (course.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Only course owner can remove collaborators'
      });
    }

    course.collaborators = course.collaborators.filter(
      c => c.toString() !== req.params.userId
    );
    await course.save();

    res.json({
      success: true,
      message: 'Collaborator removed'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get revision history
 * GET /api/courses/:id/history
 */
exports.getRevisionHistory = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('revisionHistory.changedBy', 'name email');

    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      });
    }

    res.json({
      success: true,
      data: { history: course.revisionHistory }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Export course
 * GET /api/courses/:id/export?format=pptx|docx|xlsx|json|all
 */
exports.exportCourse = async (req, res, next) => {
  try {
    const { format = 'json' } = req.query;
    const rendererService = require('../services/rendererService');

    const course = await Course.findById(req.params.id)
      .populate('owner', 'name email')
      .lean();

    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      });
    }

    // Check access
    const hasAccess = 
      course.owner._id.toString() === req.user.id ||
      course.collaborators?.some(c => c.toString() === req.user.id);

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    // Export based on format
    switch (format.toLowerCase()) {
      case 'json':
        res.json({
          success: true,
          data: { course }
        });
        break;

      case 'pptx':
      case 'powerpoint':
        const pptxResult = await rendererService.render(course, 'pptx');
        res.setHeader('Content-Type', pptxResult.mimeType);
        res.setHeader('Content-Disposition', `attachment; filename="${pptxResult.filename}"`);
        res.send(pptxResult.buffer);
        break;

      case 'docx':
      case 'word':
        const docxResult = await rendererService.render(course, 'docx');
        res.setHeader('Content-Type', docxResult.mimeType);
        res.setHeader('Content-Disposition', `attachment; filename="${docxResult.filename}"`);
        res.send(docxResult.buffer);
        break;

      case 'xlsx':
      case 'excel':
        const xlsxResult = await rendererService.render(course, 'xlsx');
        res.setHeader('Content-Type', xlsxResult.mimeType);
        res.setHeader('Content-Disposition', `attachment; filename="${xlsxResult.filename}"`);
        res.send(xlsxResult.buffer);
        break;

      case 'all':
        // Generate all formats and return as JSON with file paths
        const allResults = await rendererService.renderAll(course);
        res.json({
          success: true,
          data: { exports: allResults }
        });
        break;

      default:
        return res.status(400).json({
          success: false,
          error: `Export format '${format}' not supported. Use: json, pptx, docx, xlsx, or all`
        });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Clone a course
 * POST /api/courses/:id/clone
 */
exports.cloneCourse = async (req, res, next) => {
  try {
    const { newTitle } = req.body;

    const sourceCourse = await Course.findById(req.params.id).lean();

    if (!sourceCourse) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      });
    }

    // Check access
    const hasAccess = 
      sourceCourse.owner.toString() === req.user.id ||
      sourceCourse.collaborators?.some(c => c.toString() === req.user.id);

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    // Create clone
    const clonedCourse = new Course({
      ...sourceCourse,
      _id: undefined,
      title: newTitle || `${sourceCourse.title} (Copy)`,
      owner: req.user.id,
      collaborators: [],
      status: 'draft',
      gates: { gateA: true, gateB: !!newTitle },
      completedInvocations: [],
      revisionHistory: [{
        version: 1,
        changedBy: req.user.id,
        changeType: 'CLONED',
        summary: `Cloned from: ${sourceCourse.title}`,
      }],
      createdAt: undefined,
      updatedAt: undefined,
    });

    await clonedCourse.save();

    res.status(201).json({
      success: true,
      data: { course: clonedCourse }
    });
  } catch (error) {
    next(error);
  }
};
