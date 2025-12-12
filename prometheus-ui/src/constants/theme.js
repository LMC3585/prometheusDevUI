/**
 * Theme Constants - Prometheus 2.0 Design System
 *
 * Single source of truth for colors, typography, and UI configuration.
 * Based on Mockup 2.1 specifications and reference HTML patterns.
 */

export const THEME = {
  // ============================================
  // BACKGROUNDS
  // ============================================
  BG_BASE: '#080808',
  BG_DARK: '#0d0d0d',
  BG_MEDIUM: '#121212',
  BG_LIGHT: '#181818',
  BG_LIGHTER: '#1e1e1e',
  BG_CARD: '#141414',
  BG_INPUT: '#0a0a0a',
  BG_PANEL: '#1a1a1a',

  // ============================================
  // AMBER/ORANGE (Primary Accent)
  // ============================================
  AMBER_DARKEST: '#5a3000',
  AMBER_DARK: '#8B4513',
  AMBER: '#d4730c',
  AMBER_LIGHT: '#e8a33a',
  AMBER_GLOW: '#ff9500',

  // Button gradients
  BUTTON_GRADIENT_START: '#D65700',
  BUTTON_GRADIENT_END: '#763000',

  // Border accent
  BORDER_AMBER: 'rgba(212, 115, 12, 0.25)',

  // ============================================
  // STATUS COLORS
  // ============================================
  GREEN: '#2e7d32',
  GREEN_LIGHT: '#4CAF50',
  GREEN_BRIGHT: '#00FF00',
  GREEN_DIM: 'rgba(46, 125, 50, 0.12)',

  RED: '#b71c1c',
  RED_LIGHT: '#c0392b',

  CYAN: '#006064',
  CYAN_LIGHT: '#00838f',

  // ============================================
  // TEXT COLORS
  // Updated: improved contrast for dark greys (110-150 range)
  // ============================================
  TEXT_PRIMARY: '#d8d8d8',
  TEXT_SECONDARY: '#a0a0a0',
  TEXT_DIM: '#6e6e6e',      // Was #555555 (85) → now #6e6e6e (110)
  TEXT_MUTED: '#787878',     // Was #404040 (64) → now #787878 (120)
  WHITE: '#f0f0f0',
  OFF_WHITE: '#f2f2f2',

  // ============================================
  // BORDERS
  // ============================================
  BORDER: '#1f1f1f',
  BORDER_LIGHT: '#2d2d2d',
  BORDER_GREY: '#767171',
  BORDER_INPUT: '#404040',

  // ============================================
  // PKE COLORS
  // ============================================
  PKE_GOLD: '#BF9000',
  PKE_ACTIVE: '#FF6600',

  // ============================================
  // TYPOGRAPHY
  // ============================================
  FONT_PRIMARY: "'Candara', 'Calibri', sans-serif",
  FONT_MONO: "'Cascadia Code', 'Consolas', monospace",

  // Typography scale minimums (used as fallback for scaled UI)
  FONT_SIZE_BODY: '14px',      // Body text minimum
  FONT_SIZE_LABEL: '12px',     // Small labels minimum
  FONT_SIZE_BUTTON: '14px',    // Button text minimum
  FONT_SIZE_TITLE: '18px',     // Section titles
  FONT_SIZE_HEADING: '24px',   // Page headings

  // Letter-spacing constraints
  // <= 12px fonts: max 2px letter-spacing
  // 13-18px fonts: max 4px
  // > 18px fonts: max 6px
  LETTER_SPACING_TIGHT: '1px',
  LETTER_SPACING_NORMAL: '2px',
  LETTER_SPACING_WIDE: '4px',
  LETTER_SPACING_EXTRA: '6px',

  // ============================================
  // GRADIENTS
  // ============================================
  GRADIENT_BORDER: 'linear-gradient(to right, #767171, #ffffff 50%, #767171)',
  GRADIENT_BORDER_ACTIVE: '#FF6600',
  GRADIENT_LINE_TOP: 'linear-gradient(to right, #767171, #ffffff)',
  GRADIENT_LINE_BOTTOM: 'linear-gradient(to right, #ffffff, #767171 46%, #3b3838)',
  GRADIENT_BUTTON: 'linear-gradient(to bottom, #D65700, #763000)',
  GRADIENT_PKE: 'linear-gradient(to right, #3b3838, #767171 25%, #ffffff 50%, #767171 75%, #3b3838)',
}

// ============================================
// SLIDER CONFIGURATIONS
// ============================================
export const LEVEL_OPTIONS = ['AWARENESS', 'FOUNDATIONAL', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']
export const SENIORITY_OPTIONS = ['JUNIOR', 'MID MGMT', 'DIRECTOR', 'EXECUTIVE', 'ALL']
export const DURATION_UNITS = ['HRS', 'DAYS', 'WKS']
export const DURATION_MAX = { HRS: 40, DAYS: 45, WKS: 8 }

// ============================================
// DELIVERY OPTIONS
// ============================================
export const DELIVERY_OPTIONS = ['ONLINE', 'CLASSROOM', 'SEMINAR', 'HYBRID', 'SELF STUDY']

// ============================================
// NAVIGATION SECTIONS
// ============================================
export const NAV_SECTIONS = [
  { id: 'define', label: 'DEFINE', angle: 0 },      // North (top)
  { id: 'design', label: 'DESIGN', angle: 90 },     // East (right)
  { id: 'build', label: 'BUILD', angle: 180 },      // South (bottom)
  { id: 'format', label: 'FORMAT', angle: 270 },    // West (left)
  { id: 'generate', label: 'GENERATE', angle: null } // Center
]

// ============================================
// ANIMATION TIMING
// ============================================
export const ANIMATION = {
  // Easing functions
  EASE_SMOOTH: 'cubic-bezier(0.4, 0, 0.2, 1)',
  EASE_OUT: 'ease-out',
  EASE_IN_OUT: 'ease-in-out',

  // Durations
  DURATION_FAST: '0.3s',
  DURATION_NORMAL: '0.4s',
  DURATION_SLOW: '0.5s',
  DURATION_WHEEL: '0.5s',

  // NavWheel specific
  WHEEL_COLLAPSED_SIZE: 70,
  WHEEL_EXPANDED_SIZE: 280,
  WHEEL_NODE_SIZE: 40,
  WHEEL_RADIUS: 100,
}

// ============================================
// LAYOUT CONSTANTS (Extended)
// ============================================
export const LAYOUT_THEME = {
  // Canvas dimensions
  CANVAS_WIDTH: 1920,
  CANVAS_HEIGHT: 1080,

  // Content zone (per UI_DOCTRINE.md)
  CONTENT_TOP: 180,
  CONTENT_BOTTOM: 780,

  // Bottom frame
  ABOVE_LINE_Y: 860,
  BOTTOM_LINE_Y: 875,
  STATUS_BAR_Y: 910,

  // NavWheel positioning
  WHEEL_BOTTOM: 30,
  WHEEL_LEFT: 30,
}

export default THEME
