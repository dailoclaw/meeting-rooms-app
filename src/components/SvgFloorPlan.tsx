import { type MeetingRoom } from '../data/meetingRooms'

interface SvgFloorPlanProps {
  selectedRoom: MeetingRoom | null
  onRoomSelect: (room: MeetingRoom) => void
  rooms: MeetingRoom[]
}

// Exact pixel coordinates from original image (x, y)
const roomCoordinates: Record<number, [number, number]> = {
  1: [51.9, 91.2],
  2: [523.9, 62.1],
  3: [892.1, 94.9],
  4: [509.8, 335.8],
  5: [372.9, 554.8],
  6: [467.3, 554.8],
  7: [566.4, 554.8],
  8: [236.0, 32.9],
  9: [179.4, 284.7],
  10: [188.8, 365.0],
  11: [188.8, 511.0],
  12: [165.2, 631.5],
  13: [94.4, 631.5],
  14: [618.3, 310.2],
  15: [618.3, 368.6],
  16: [443.7, 412.4],
  17: [443.7, 489.1],
}

export default function SvgFloorPlan({ selectedRoom, onRoomSelect, rooms }: SvgFloorPlanProps) {
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {/* Vector floor plan - fully scalable! */}
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
      
      {/* Interactive overlay SVG for room markers and clickable areas */}
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
        {/* Room circles and numbers */}
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
              {/* Yellow circle marker */}
              <circle
                cx={x}
                cy={y}
                r={isSelected ? 20 : 18}
                fill="#F5C200"
                stroke={isSelected ? '#ff9800' : '#e6b800'}
                strokeWidth={isSelected ? 2.5 : 1.5}
              />
              
              {/* Room number inside circle */}
              <text
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={isSelected ? 16 : 14}
                fontWeight="bold"
                fill="#000000"
                pointerEvents="none"
              >
                {room.id}
              </text>
              
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
