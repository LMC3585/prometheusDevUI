/**
 * Renderer Service
 * Generates PPT / DOCX / XLSX output files from validated course data
 * 
 * From PKE Workflow: "Renderers - PPT / DOCX / XLSX generation"
 */

const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const PptxGenJS = require('pptxgenjs');
const ExcelJS = require('exceljs');
const fs = require('fs').promises;
const path = require('path');

// Branding configuration
const BRANDING = {
  primaryColor: 'BF9000',
  secondaryColor: '1a1a1a',
  accentColor: 'FF6600',
  fontPrimary: 'Arial',
};

/**
 * Render course to specified format
 */
const render = async (course, format, options = {}) => {
  const timestamp = Date.now();
  const safeTitle = (course.title || 'course').replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30);

  let buffer, filename, mimeType;

  switch (format.toLowerCase()) {
    case 'pptx':
    case 'powerpoint':
      buffer = await renderPPTX(course, options);
      filename = `${safeTitle}_${timestamp}.pptx`;
      mimeType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
      break;

    case 'docx':
    case 'word':
      buffer = await renderDOCX(course, options);
      filename = `${safeTitle}_${timestamp}.docx`;
      mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      break;

    case 'xlsx':
    case 'excel':
      buffer = await renderXLSX(course, options);
      filename = `${safeTitle}_${timestamp}.xlsx`;
      mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      break;

    default:
      throw new Error(`Unsupported format: ${format}`);
  }

  return { buffer, filename, mimeType };
};

/**
 * Generate PowerPoint presentation
 */
const renderPPTX = async (course, options = {}) => {
  const pptx = new PptxGenJS();

  pptx.author = 'PKE';
  pptx.title = course.title;

  // Title slide
  let slide = pptx.addSlide();
  slide.addText(course.title, {
    x: 0.5, y: 2, w: 9, h: 1.5,
    fontSize: 44, color: BRANDING.primaryColor, bold: true, align: 'center',
  });
  slide.addText(`${course.metadata?.duration?.value || ''} ${course.metadata?.duration?.unit || 'Day'} Course`, {
    x: 0.5, y: 3.5, w: 9, h: 0.5,
    fontSize: 24, color: '666666', align: 'center',
  });

  // Learning Objectives slide
  if (course.learningObjectives?.length > 0) {
    slide = pptx.addSlide();
    slide.addText('Learning Objectives', {
      x: 0.5, y: 0.5, w: 9, h: 0.75,
      fontSize: 32, color: BRANDING.primaryColor, bold: true,
    });

    const loText = course.learningObjectives.map((lo, idx) => ({
      text: `${lo.code || `LO${idx + 1}`}: ${lo.text}`,
      options: { bullet: true, fontSize: 18, breakLine: true },
    }));

    slide.addText(loText, { x: 0.5, y: 1.5, w: 9, h: 4 });
  }

  // Topic slides
  course.structure?.topics?.forEach(topic => {
    slide = pptx.addSlide();
    slide.addText(topic.title, {
      x: 0.5, y: 2, w: 9, h: 1,
      fontSize: 36, color: BRANDING.primaryColor, bold: true, align: 'center',
    });

    // Subtopic slides
    topic.subtopics?.forEach(subtopic => {
      slide = pptx.addSlide();
      slide.addText(subtopic.title, {
        x: 0.5, y: 0.5, w: 9, h: 0.75,
        fontSize: 28, color: BRANDING.primaryColor, bold: true,
      });

      if (subtopic.lessons?.length > 0) {
        const lessonText = subtopic.lessons.map(lesson => ({
          text: lesson.title,
          options: { bullet: true, fontSize: 20, breakLine: true },
        }));
        slide.addText(lessonText, { x: 0.5, y: 1.5, w: 9, h: 4 });
      }
    });
  });

  return await pptx.write({ outputType: 'nodebuffer' });
};

/**
 * Generate Word document
 */
const renderDOCX = async (course, options = {}) => {
  const { Document, Packer, Paragraph, TextRun, HeadingLevel } = require('docx');

  const children = [];

  // Title
  children.push(new Paragraph({
    text: course.title,
    heading: HeadingLevel.TITLE,
  }));

  // Description
  if (course.description) {
    children.push(
      new Paragraph({ text: 'Course Description', heading: HeadingLevel.HEADING_1 }),
      new Paragraph({ text: course.description })
    );
  }

  // Learning Objectives
  if (course.learningObjectives?.length > 0) {
    children.push(new Paragraph({ text: 'Learning Objectives', heading: HeadingLevel.HEADING_1 }));
    course.learningObjectives.forEach((lo, idx) => {
      children.push(new Paragraph({
        text: `${lo.code || `LO${idx + 1}`}: ${lo.text}`,
        bullet: { level: 0 },
      }));
    });
  }

  // Course Structure
  if (course.structure?.topics?.length > 0) {
    children.push(new Paragraph({ text: 'Course Structure', heading: HeadingLevel.HEADING_1 }));

    course.structure.topics.forEach(topic => {
      children.push(new Paragraph({ text: topic.title, heading: HeadingLevel.HEADING_2 }));

      topic.subtopics?.forEach(subtopic => {
        children.push(new Paragraph({ text: subtopic.title, heading: HeadingLevel.HEADING_3 }));

        subtopic.lessons?.forEach(lesson => {
          children.push(new Paragraph({
            text: `• ${lesson.title}`,
            indent: { left: 720 },
          }));
        });
      });
    });
  }

  const doc = new Document({ sections: [{ children }] });
  return await Packer.toBuffer(doc);
};

/**
 * Generate Excel spreadsheet
 */
const renderXLSX = async (course, options = {}) => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'PKE';

  // Overview sheet
  const overview = workbook.addWorksheet('Overview');
  overview.columns = [
    { header: 'Property', key: 'prop', width: 20 },
    { header: 'Value', key: 'val', width: 50 },
  ];
  overview.addRows([
    { prop: 'Title', val: course.title },
    { prop: 'Duration', val: `${course.metadata?.duration?.value || ''} ${course.metadata?.duration?.unit || ''}` },
    { prop: 'Level', val: course.metadata?.level || '' },
    { prop: 'Description', val: course.description || '' },
  ]);

  // Learning Objectives sheet
  const loSheet = workbook.addWorksheet('Learning Objectives');
  loSheet.columns = [
    { header: 'Code', key: 'code', width: 10 },
    { header: 'Objective', key: 'text', width: 60 },
    { header: 'Bloom Level', key: 'bloom', width: 15 },
  ];
  course.learningObjectives?.forEach((lo, idx) => {
    loSheet.addRow({
      code: lo.code || `LO${idx + 1}`,
      text: lo.text,
      bloom: lo.bloomLevel || '',
    });
  });

  // Structure sheet
  const structure = workbook.addWorksheet('Structure');
  structure.columns = [
    { header: 'Topic', key: 'topic', width: 25 },
    { header: 'Subtopic', key: 'subtopic', width: 25 },
    { header: 'Lesson', key: 'lesson', width: 35 },
    { header: 'Duration', key: 'duration', width: 12 },
  ];
  course.structure?.topics?.forEach(topic => {
    topic.subtopics?.forEach(subtopic => {
      subtopic.lessons?.forEach(lesson => {
        structure.addRow({
          topic: topic.title,
          subtopic: subtopic.title,
          lesson: lesson.title,
          duration: lesson.duration || '',
        });
      });
    });
  });

  return await workbook.xlsx.writeBuffer();
};

/**
 * Render all formats
 */
const renderAll = async (course, options = {}) => {
  const results = {};

  for (const format of ['pptx', 'docx', 'xlsx']) {
    try {
      const { buffer, filename, mimeType } = await render(course, format, options);
      results[format] = { success: true, filename, mimeType, size: buffer.length };
    } catch (error) {
      results[format] = { success: false, error: error.message };
    }
  }

  return results;
};

module.exports = {
  render,
  renderPPTX,
  renderDOCX,
  renderXLSX,
  renderAll,
  BRANDING,
};
