import { type MeetingRoom } from '../data/meetingRooms'

interface SvgFloorPlanProps {
  selectedRoom: MeetingRoom | null
  onRoomSelect: (room: MeetingRoom) => void
  rooms: MeetingRoom[]
}

// Room positions and sizes matching original floor plan layout
const roomLayout: Record<number, { x: number; y: number; width: number; height: number }> = {
  1: { x: 30, y: 70, width: 80, height: 80 },      // The Hub (top-left large room)
  2: { x: 480, y: 30, width: 120, height: 90 },    // The Café (top-center large)
  3: { x: 840, y: 70, width: 80, height: 80 },     // El Questro (top-right)
  4: { x: 470, y: 300, width: 100, height: 80 },   // Rottnest Island
  5: { x: 340, y: 530, width: 90, height: 60 },    // Streaky Bay (bottom row)
  6: { x: 440, y: 530, width: 90, height: 60 },    // Cradle Mountain
  7: { x: 540, y: 530, width: 90, height: 60 },    // Broome
  8: { x: 200, y: 15, width: 90, height: 60 },     // Undara (top area)
  9: { x: 140, y: 260, width: 90, height: 70 },    // Pambula Beach (left)
  10: { x: 150, y: 340, width: 90, height: 70 },   // Lake Hume (left)
  11: { x: 150, y: 485, width: 90, height: 70 },   // Kings Canyon (left)
  12: { x: 130, y: 610, width: 90, height: 60 },   // Jindabyne (bottom-left)
  13: { x: 60, y: 610, width: 90, height: 60 },    // Goolwa (bottom-left)
  14: { x: 585, y: 285, width: 90, height: 70 },   // Mount Isa (right)
  15: { x: 585, y: 345, width: 90, height: 70 },   // Byron Bay (right)
  16: { x: 410, y: 390, width: 90, height: 70 },   // Airlie Beach (center)
  17: { x: 410, y: 465, width: 90, height: 70 },   // Bright (center)
}

export default function SvgFloorPlan({ selectedRoom, onRoomSelect, rooms }: SvgFloorPlanProps) {
  return (
    <svg
      viewBox="0 0 944 730"
      className="floor-plan-svg"
      style={{
        width: '100%',
        height: 'auto',
        maxHeight: '600px',
        border: '2px solid #495057',
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
      }}
    >
      {/* Building exterior wall */}
      <rect x="15" y="15" width="914" height="700" fill="white" stroke="#343a40" strokeWidth="4" rx="3" />
      
      {/* Main horizontal corridor */}
      <rect x="120" y="180" width="60" height="420" fill="#e9ecef" stroke="#adb5bd" strokeWidth="2" />
      
      {/* Secondary horizontal corridor */}
      <rect x="330" y="450" width="320" height="60" fill="#e9ecef" stroke="#adb5bd" strokeWidth="2" />
      
      {/* Vertical corridor sections */}
      <rect x="400" y="120" width="200" height="50" fill="#e9ecef" stroke="#adb5bd" strokeWidth="2" />
      <rect x="400" y="200" width="200" height="50" fill="#e9ecef" stroke="#adb5bd" strokeWidth="2" />
      
      {/* Interior walls - vertical */}
      <line x1="300" y1="180" x2="300" y2="600" stroke="#6c757d" strokeWidth="3" />
      <line x1="680" y1="250" x2="680" y2="420" stroke="#6c757d" strokeWidth="3" />
      
      {/* Interior walls - horizontal */}
      <line x1="300" y1="250" x2="680" y2="250" stroke="#6c757d" strokeWidth="3" />
      <line x1="330" y1="510" x2="650" y2="510" stroke="#6c757d" strokeWidth="3" />
      
      {/* Decorative floor tiles pattern */}
      <defs>
        <pattern id="floorTile" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <rect width="40" height="40" fill="none" stroke="#dee2e6" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect x="120" y="180" width="60" height="420" fill="url(#floorTile)" opacity="0.3" />
      
      {/* Entrance/Exit markers */}
      <rect x="450" y="10" width="60" height="10" fill="#17a2b8" stroke="#138496" strokeWidth="1" />
      <text x="480" y="8" fontSize="8" fill="#343a40" textAnchor="middle">ENTRANCE</text>
      
      {/* Render all rooms */}
      {rooms.map(room => {
        const layout = roomLayout[room.id]
        if (!layout) return null
        
        const isSelected = selectedRoom?.id === room.id
        
        return (
          <g 
            key={room.id}
            onClick={() => onRoomSelect(room)}
            style={{ cursor: 'pointer' }}
            className={isSelected ? 'room-selected' : ''}
          >
            {/* Room rectangle with shadow effect */}
            <rect
              x={layout.x + 2}
              y={layout.y + 2}
              width={layout.width}
              height={layout.height}
              fill="rgba(0,0,0,0.1)"
              rx="4"
            />
            <rect
              x={layout.x}
              y={layout.y}
              width={layout.width}
              height={layout.height}
              fill={isSelected ? '#fff3cd' : 'white'}
              stroke={isSelected ? '#ffc107' : '#6c757d'}
              strokeWidth={isSelected ? 3 : 2}
              rx="4"
            />
            
            {/* Room interior details - diagonal lines for texture */}
            <line 
              x1={layout.x + 5} 
              y1={layout.y + 5} 
              x2={layout.x + 15} 
              y2={layout.y + 15} 
              stroke="#e9ecef" 
              strokeWidth="1" 
              opacity="0.5"
            />
            
            {/* Room number circle with gradient */}
            <defs>
              <radialGradient id={`roomGradient${room.id}`}>
                <stop offset="0%" stopColor="#ffd54f" />
                <stop offset="100%" stopColor="#ffc107" />
              </radialGradient>
            </defs>
            <circle
              cx={layout.x + layout.width / 2}
              cy={layout.y + layout.height / 2}
              r={isSelected ? 22 : 18}
              fill={`url(#roomGradient${room.id})`}
              stroke={isSelected ? '#ff9800' : '#ffb300'}
              strokeWidth={isSelected ? 2.5 : 1.5}
            />
            
            {/* Room number text with shadow */}
            <text
              x={layout.x + layout.width / 2 + 1}
              y={layout.y + layout.height / 2 + 1}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={isSelected ? 17 : 15}
              fontWeight="bold"
              fill="rgba(0,0,0,0.2)"
            >
              {room.id}
            </text>
            <text
              x={layout.x + layout.width / 2}
              y={layout.y + layout.height / 2}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={isSelected ? 17 : 15}
              fontWeight="bold"
              fill="#212529"
            >
              {room.id}
            </text>
            
            {/* Room name label with background */}
            <rect
              x={layout.x + layout.width / 2 - 45}
              y={layout.y + layout.height + 8}
              width="90"
              height="16"
              fill={isSelected ? '#ffc107' : 'white'}
              stroke={isSelected ? '#ff9800' : '#adb5bd'}
              strokeWidth="1"
              rx="2"
              opacity="0.9"
            />
            <text
              x={layout.x + layout.width / 2}
              y={layout.y + layout.height + 17}
              textAnchor="middle"
              fontSize="10"
              fill={isSelected ? '#212529' : '#495057'}
              fontWeight={isSelected ? 'bold' : '600'}
            >
              {room.name}
            </text>
            
            {/* Capacity indicator */}
            <text
              x={layout.x + layout.width - 8}
              y={layout.y + 12}
              fontSize="9"
              fill="#6c757d"
              textAnchor="end"
            >
              👥{room.capacity}
            </text>
          </g>
        )
      })}
      
      {/* Floor plan title and legend */}
      <rect x="10" y="690" width="200" height="30" fill="white" stroke="#6c757d" strokeWidth="1" rx="2" />
      <text x="20" y="705" fontSize="11" fill="#343a40" fontWeight="bold">Meeting Rooms Floor Plan</text>
      <text x="20" y="716" fontSize="8" fill="#6c757d">Click room to select</text>
      
      {/* Compass rose */}
      <g transform="translate(900, 690)">
        <circle cx="0" cy="0" r="15" fill="white" stroke="#6c757d" strokeWidth="1" />
        <polygon points="0,-10 -3,5 0,3 3,5" fill="#dc3545" />
        <text x="0" y="-12" fontSize="8" fill="#6c757d" textAnchor="middle">N</text>
      </g>
    </svg>
  )
}
