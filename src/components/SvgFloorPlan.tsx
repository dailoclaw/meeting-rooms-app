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
    <svg
      viewBox="0 0 944 730"
      className="floor-plan-svg"
      style={{
        width: '100%',
        height: 'auto',
        maxHeight: '600px',
        border: '2px solid #495057',
      }}
    >
      {/* Embedded original floor plan image */}
      <image
        href="/meeting-rooms-map.jpg"
        width="944"
        height="730"
        preserveAspectRatio="none"
      />
      
      {/* Interactive room markers overlaid on the image */}
      {rooms.map(room => {
        const coords = roomCoordinates[room.id]
        if (!coords) return null
        
        const [x, y] = coords
        const isSelected = selectedRoom?.id === room.id
        
        return (
          <g 
            key={room.id}
            onClick={() => onRoomSelect(room)}
            style={{ cursor: 'pointer' }}
          >
            {/* Clickable circle marker */}
            <circle
              cx={x}
              cy={y}
              r={isSelected ? 28 : 22}
              fill={isSelected ? 'rgba(255, 193, 7, 0.7)' : 'rgba(255, 193, 7, 0.3)'}
              stroke={isSelected ? '#ff9800' : '#ffc107'}
              strokeWidth={isSelected ? 3 : 2}
            />
            
            {/* Room number */}
            <text
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={isSelected ? 18 : 16}
              fontWeight="bold"
              fill="#000"
              pointerEvents="none"
            >
              {room.id}
            </text>
            
            {/* Tooltip on hover/selection */}
            {isSelected && (
              <g>
                <rect
                  x={x - 60}
                  y={y - 50}
                  width="120"
                  height="30"
                  fill="rgba(0, 0, 0, 0.8)"
                  stroke="#ffc107"
                  strokeWidth="2"
                  rx="4"
                />
                <text
                  x={x}
                  y={y - 42}
                  textAnchor="middle"
                  fontSize="11"
                  fill="white"
                  fontWeight="bold"
                  pointerEvents="none"
                >
                  {room.name}
                </text>
                <text
                  x={x}
                  y={y - 28}
                  textAnchor="middle"
                  fontSize="10"
                  fill="#ffc107"
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
  )
}
