import { type MeetingRoom } from '../data/meetingRooms'

interface SvgFloorPlanProps {
  selectedRoom: MeetingRoom | null
  onRoomSelect: (room: MeetingRoom) => void
  rooms: MeetingRoom[]
}

// Room positions and sizes (all in SVG coordinates)
const roomLayout: Record<number, { x: number; y: number; width: number; height: number }> = {
  1: { x: 30, y: 70, width: 80, height: 80 },      // The Hub (top-left)
  2: { x: 480, y: 40, width: 120, height: 80 },    // The Café (top-center)
  3: { x: 840, y: 70, width: 80, height: 80 },     // El Questro (top-right)
  4: { x: 470, y: 300, width: 100, height: 80 },   // Rottnest Island
  5: { x: 340, y: 530, width: 90, height: 60 },    // Streaky Bay (bottom row)
  6: { x: 440, y: 530, width: 90, height: 60 },    // Cradle Mountain
  7: { x: 540, y: 530, width: 90, height: 60 },    // Broome
  8: { x: 200, y: 15, width: 90, height: 60 },     // Undara (top-left area)
  9: { x: 140, y: 260, width: 90, height: 70 },    // Pambula Beach (left side)
  10: { x: 150, y: 340, width: 90, height: 70 },   // Lake Hume (left side)
  11: { x: 150, y: 485, width: 90, height: 70 },   // Kings Canyon (left side)
  12: { x: 130, y: 610, width: 90, height: 60 },   // Jindabyne (bottom-left)
  13: { x: 60, y: 610, width: 90, height: 60 },    // Goolwa (bottom-left)
  14: { x: 585, y: 285, width: 90, height: 70 },   // Mount Isa (right side)
  15: { x: 585, y: 345, width: 90, height: 70 },   // Byron Bay (right side)
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
        border: '1px solid #ddd',
        background: '#f8f9fa',
      }}
    >
      {/* Background floor outline */}
      <rect x="10" y="10" width="924" height="710" fill="#e9ecef" stroke="#adb5bd" strokeWidth="2" rx="4" />
      
      {/* Main building structure */}
      <rect x="25" y="25" width="894" height="680" fill="white" stroke="#6c757d" strokeWidth="3" rx="2" />
      
      {/* Corridor/hallway areas (lighter gray) */}
      <rect x="120" y="180" width="60" height="400" fill="#f1f3f5" stroke="#dee2e6" strokeWidth="1" />
      <rect x="340" y="450" width="300" height="60" fill="#f1f3f5" stroke="#dee2e6" strokeWidth="1" />
      
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
          >
            {/* Room rectangle */}
            <rect
              x={layout.x}
              y={layout.y}
              width={layout.width}
              height={layout.height}
              fill={isSelected ? '#fff3cd' : 'white'}
              stroke={isSelected ? '#ffc107' : '#adb5bd'}
              strokeWidth={isSelected ? 3 : 1.5}
              rx="3"
            />
            
            {/* Room number circle */}
            <circle
              cx={layout.x + layout.width / 2}
              cy={layout.y + layout.height / 2}
              r={isSelected ? 20 : 16}
              fill="#ffc107"
              stroke={isSelected ? '#ff9800' : '#ffc107'}
              strokeWidth={isSelected ? 2 : 1}
            />
            
            {/* Room number text */}
            <text
              x={layout.x + layout.width / 2}
              y={layout.y + layout.height / 2}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={isSelected ? 16 : 14}
              fontWeight="bold"
              fill="#000"
            >
              {room.id}
            </text>
            
            {/* Room name label */}
            <text
              x={layout.x + layout.width / 2}
              y={layout.y + layout.height + 15}
              textAnchor="middle"
              fontSize="11"
              fill="#495057"
              fontWeight={isSelected ? 'bold' : 'normal'}
            >
              {room.name}
            </text>
          </g>
        )
      })}
      
      {/* Legend */}
      <text x="20" y="25" fontSize="10" fill="#6c757d">Meeting Rooms Floor Plan</text>
    </svg>
  )
}
