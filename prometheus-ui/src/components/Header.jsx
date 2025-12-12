import logo from '../assets/burntorangelogo.png'

function Header({ courseLoaded = false, courseData = {} }) {
  // Default values for when course is loaded
  const defaults = {
    courseName: 'Example',
    duration: '3 Days',
    level: 'Basic',
    thematic: 'Intelligence'
  }

  const data = courseLoaded ? { ...defaults, ...courseData } : {}

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        padding: '15px 40px',
        position: 'relative'
      }}
    >
      {/* Left side - Logo (+25%: 73px → 91px) */}
      <div style={{ flexShrink: 0 }}>
        <img
          src={logo}
          alt="Prometheus"
          style={{
            width: '91px',
            height: '91px',
            objectFit: 'contain'
          }}
        />
      </div>

      {/* Center - Title on ONE LINE, centered, +75% size (25px → 44px) */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          top: '20px',
          textAlign: 'center',
          whiteSpace: 'nowrap'
        }}
      >
        <span
          style={{
            color: '#f2f2f2',
            fontSize: '44px',
            letterSpacing: '0.1em',
            fontFamily: 'Candara, Calibri, "Segoe UI", sans-serif',
            textTransform: 'uppercase'
          }}
        >
          PROMETHEUS COURSE GENERATION SYSTEM 2.0
        </span>
      </div>

      {/* Right side - Info cluster (+25% font: 11px → 14px, moved LEFT by 50px) */}
      <div
        style={{
          marginRight: '50px',
          flexShrink: 0
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'auto auto',
            gap: '2px 12px',
            fontSize: '14px',
            fontFamily: 'Candara, Calibri, "Segoe UI", sans-serif'
          }}
        >
          <span style={{ color: '#f2f2f2', textAlign: 'right' }}>Course Loaded:</span>
          <span style={{ color: '#00FF00', fontFamily: '"Fira Code", "Cascadia Code", "Consolas", monospace' }}>
            {courseLoaded ? data.courseName : '---'}
          </span>

          <span style={{ color: '#f2f2f2', textAlign: 'right' }}>Duration:</span>
          <span style={{ color: '#00FF00', fontFamily: '"Fira Code", "Cascadia Code", "Consolas", monospace' }}>
            {courseLoaded ? data.duration : '---'}
          </span>

          <span style={{ color: '#f2f2f2', textAlign: 'right' }}>Level:</span>
          <span style={{ color: '#00FF00', fontFamily: '"Fira Code", "Cascadia Code", "Consolas", monospace' }}>
            {courseLoaded ? data.level : '---'}
          </span>

          <span style={{ color: '#f2f2f2', textAlign: 'right' }}>Thematic:</span>
          <span style={{ color: '#00FF00', fontFamily: '"Fira Code", "Cascadia Code", "Consolas", monospace' }}>
            {courseLoaded ? data.thematic : '---'}
          </span>
        </div>
      </div>
    </div>
  )
}

export default Header
