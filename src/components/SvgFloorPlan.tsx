import { type MeetingRoom } from '../data/meetingRooms'

interface SvgFloorPlanProps {
  selectedRoom: MeetingRoom | null
  onRoomSelect: (room: MeetingRoom) => void
  rooms: MeetingRoom[]
}

// Exact pixel coordinates - manually marked by user on vector SVG (x, y)
const roomCoordinates: Record<number, [number, number]> = {
  1: [68, 88],    // The Hub
  2: [556, 60],   // The Café
  3: [889, 102],  // El Questro
  4: [543, 313],  // Rottnest Island
  5: [505, 478],  // Streaky Bay
  6: [567, 481],  // Cradle Mountain
  7: [628, 479],  // Broome
  8: [180, 27],   // Undara
  9: [270, 278],  // Pambula Beach
  10: [270, 336], // Lake Hume
  11: [273, 447], // Kings Canyon
  12: [209, 554], // Jindabyne
  13: [151, 555], // Goolwa
  14: [635, 293], // Mount Isa
  15: [634, 334], // Byron Bay
  16: [505, 367], // Airlie Beach
  17: [503, 413], // Bright
}

export default function SvgFloorPlan({ selectedRoom, onRoomSelect, rooms }: SvgFloorPlanProps) {
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {/* Vector floor plan with yellow circles and room numbers built-in! */}
      <object
        data="/meeting-rooms-vector.svg"
        type="image/svg+xml"
        style={{
          width: '100%',
          height: 'auto',
          maxHeight: '600px',
          border: '2px solid #495057',
          pointerEvents: 'none',
        }}
      />
      
      {/* Interactive overlay SVG for clickable areas and tooltips only */}
      <svg
        viewBox="0 0 944 730"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      >
        {/* Invisible clickable areas over each room */}
        {rooms.map(room => {
          const coords = roomCoordinates[room.id]
          if (!coords) return null
          
          const [x, y] = coords
          const isSelected = selectedRoom?.id === room.id
          
          return (
            <g 
              key={room.id}
              onClick={() => onRoomSelect(room)}
              style={{ cursor: 'pointer', pointerEvents: 'all' }}
            >
              {/* Invisible clickable circle */}
              <circle
                cx={x}
                cy={y}
                r={30}
                fill="transparent"
                stroke="none"
              />
              
              {/* Tooltip popup - only shown when selected */}
              {isSelected && (
                <g>
                  {/* Tooltip background */}
                  <rect
                    x={x - 70}
                    y={y - 60}
                    width="140"
                    height="45"
                    fill="rgba(0, 0, 0, 0.85)"
                    stroke="#F5C200"
                    strokeWidth="2"
                    rx="6"
                  />
                  {/* Room number */}
                  <text
                    x={x}
                    y={y - 42}
                    textAnchor="middle"
                    fontSize="13"
                    fill="#F5C200"
                    fontWeight="bold"
                    pointerEvents="none"
                  >
                    Room #{room.id}
                  </text>
                  {/* Room name */}
                  <text
                    x={x}
                    y={y - 27}
                    textAnchor="middle"
                    fontSize="12"
                    fill="white"
                    fontWeight="600"
                    pointerEvents="none"
                  >
                    {room.name}
                  </text>
                  {/* Capacity */}
                  <text
                    x={x}
                    y={y - 13}
                    textAnchor="middle"
                    fontSize="10"
                    fill="#adb5bd"
                    pointerEvents="none"
                  >
                    👥 Capacity: {room.capacity}
                  </text>
                </g>
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}
