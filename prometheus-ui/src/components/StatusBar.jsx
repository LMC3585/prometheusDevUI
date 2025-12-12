/**
 * StatusBar - Bottom status bar component
 *
 * Positioned by parent at Y = 910px plane
 * Contains: OWNER, START DATE, STATUS, PROGRESS, APPROVED, Date/Time
 *
 * Date/Time positioning: TIME left edge on centerline, DATE to its left
 *
 * Font size: 20px (50% increase from original 13px)
 */

function StatusBar({ courseLoaded = false, statusData = {} }) {
  // Default values when course is loaded
  const defaults = {
    owner: 'MATTHEW DODDS',
    startDate: '24/11/25',
    status: 'IN DEVELOPMENT',
    progress: 15,
    approved: 'N'
  }
  
  const data = courseLoaded ? { ...defaults, ...statusData } : {
    owner: '---',
    startDate: '---',
    status: '---',
    progress: 0,
    approved: '---'
  }

  // Current date/time
  const now = new Date()
  const dateStr = now.toLocaleDateString('en-GB', { 
    day: '2-digit', 
    month: '2-digit', 
    year: '2-digit' 
  }).replace(/\//g, '/')
  const timeStr = now.toLocaleTimeString('en-GB', { 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit',
    hour12: false 
  })

  return (
    <div className="w-full relative">
      {/* All content on the Y = 910px plane (positioned by parent) */}
      <div className="flex items-center px-[2%]">
        {/* Left side - Owner and metadata */}
        <div className="flex items-center gap-8 text-[20px] font-cascadia">
          <div className="flex gap-2">
            <span className="text-[#f2f2f2]">OWNER:</span>
            <span className="text-[#00FF00]">{data.owner}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-[#f2f2f2]">START DATE:</span>
            <span className="text-[#00FF00]">{data.startDate}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-[#f2f2f2]">STATUS:</span>
            <span className="text-[#ff8c00]">{data.status}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#f2f2f2]">PROGRESS:</span>
            <span className="text-[#00FF00]">{data.progress}%</span>
            {/* Progress bar */}
            <div className="w-32 h-[12px] bg-[#252525] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${data.progress}%`,
                  background: 'linear-gradient(to right, #FF6600, #D65700)',
                  boxShadow: data.progress > 0 ? '0 0 10px rgba(255, 102, 0, 0.5)' : 'none'
                }}
              />
            </div>
          </div>
        </div>

        {/* Spacer to push approval to right */}
        <div className="flex-1" />

        {/* Right side - Approval status */}
        <div className="text-[20px] font-cascadia flex gap-2">
          <span className="text-[#f2f2f2]">APPROVED FOR USE Y/N:</span>
          <span className={data.approved === 'N' ? 'text-[#ff0000]' : 'text-[#00FF00]'}>
            {data.approved}
          </span>
        </div>
      </div>

      {/* Date/Time - Positioned so TIME left edge is on centerline */}
      {/* DATE is to the left of TIME with spacing preserved */}
      <div
        className="absolute text-[20px] font-cascadia text-[#00FF00]"
        style={{
          left: '50%',  // Start at centerline
          top: '0',
          transform: 'translateX(-100%)',  // Move left by the width of DATE
          paddingRight: '3px'  // Small gap between DATE and TIME
        }}
      >
        {dateStr}
      </div>
      <div
        className="absolute text-[20px] font-cascadia text-[#00FF00]"
        style={{
          left: '50%',  // TIME left edge at centerline
          top: '0'
        }}
      >
        {timeStr}
      </div>
    </div>
  )
}

export default StatusBar
