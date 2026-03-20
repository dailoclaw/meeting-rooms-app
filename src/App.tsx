import { useState } from 'react'
import { CContainer, CCard, CCardBody, CButton, CModal, CModalBody, CModalHeader } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPeople, cilX } from '@coreui/icons'
import { meetingRooms, type MeetingRoom } from './data/meetingRooms'
import './App.css'

function App() {
  const [selectedRoom, setSelectedRoom] = useState<MeetingRoom | null>(null)
  const [showEnlargedMap, setShowEnlargedMap] = useState(false)

  const handleRoomClick = (room: MeetingRoom) => {
    setSelectedRoom(room)
    // Scroll to map
    document.getElementById('floor-plan')?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleMapClick = (room: MeetingRoom) => {
    setSelectedRoom(room)
  }

  return (
    <CContainer className="py-3">
      <div className="mb-3 text-center">
        <h2 className="mb-0 text-dark">Meeting Rooms</h2>
      </div>

      {/* Room List */}
      <CCard className="mb-3">
        <CCardBody className="p-2">
          <div className="row g-2">
            {meetingRooms.map(room => (
              <div key={room.id} className="col-6">
                <div
                  onClick={() => handleRoomClick(room)}
                  style={{ cursor: 'pointer', textAlign: 'left' }}
                  className={`p-2 rounded ${selectedRoom?.id === room.id ? 'bg-primary text-white' : 'bg-light'}`}
                >
                  <strong className="room-name">#{room.id} {room.name}</strong>
                </div>
              </div>
            ))}
          </div>
        </CCardBody>
      </CCard>

      {/* Floor Plan */}
      <CCard id="floor-plan">
        <CCardBody className="p-2">
          <div 
            className="floor-plan-container"
            onClick={() => setShowEnlargedMap(true)}
            style={{ cursor: 'zoom-in' }}
          >
            <div className="floor-plan-wrapper">
              <img
                src="/meeting-rooms-map.jpg"
                alt="Meeting Rooms Floor Plan"
                className="floor-plan-image"
              />
              <svg 
                className="floor-plan-svg-overlay" 
                viewBox="0 0 944 730"
                preserveAspectRatio="xMidYMid meet"
              >
                {[
                  { id: 1, cx: 51.9, cy: 91.2 },
                  { id: 2, cx: 523.9, cy: 62.1 },
                  { id: 3, cx: 892.1, cy: 94.9 },
                  { id: 4, cx: 509.8, cy: 335.8 },
                  { id: 5, cx: 372.9, cy: 554.8 },
                  { id: 6, cx: 467.3, cy: 554.8 },
                  { id: 7, cx: 566.4, cy: 554.8 },
                  { id: 8, cx: 236.0, cy: 32.9 },
                  { id: 9, cx: 179.4, cy: 284.7 },
                  { id: 10, cx: 188.8, cy: 365.0 },
                  { id: 11, cx: 188.8, cy: 511.0 },
                  { id: 12, cx: 165.2, cy: 631.5 },
                  { id: 13, cx: 94.4, cy: 631.5 },
                  { id: 14, cx: 618.3, cy: 310.2 },
                  { id: 15, cx: 618.3, cy: 368.6 },
                  { id: 16, cx: 443.7, cy: 412.4 },
                  { id: 17, cx: 443.7, cy: 489.1 },
                ].map((pos) => {
                  const room = meetingRooms.find(r => r.id === pos.id)!
                  const isActive = selectedRoom?.id === pos.id
                  return (
                    <g key={pos.id}>
                      {isActive && (
                        <circle
                          cx={pos.cx}
                          cy={pos.cy}
                          r="30"
                          className="svg-pulse"
                        />
                      )}
                      <circle
                        cx={pos.cx}
                        cy={pos.cy}
                        r="25"
                        className="svg-hotspot"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleMapClick(room)
                        }}
                      />
                    </g>
                  )
                })}
              </svg>
            </div>
          </div>

          {selectedRoom && (
            <div className="selected-room-info mt-3 p-3 bg-light rounded">
              <h5>{selectedRoom.name}</h5>
              <p className="mb-0">
                <CIcon icon={cilPeople} className="me-2" />
                Capacity: <strong>{selectedRoom.capacity} people</strong>
              </p>
            </div>
          )}
        </CCardBody>
      </CCard>

      {/* Enlarged Map Modal */}
      <CModal
        visible={showEnlargedMap}
        onClose={() => setShowEnlargedMap(false)}
        fullscreen
        className="enlarged-map-modal"
      >
        <CModalHeader className="bg-dark text-white border-0" closeButton={false}>
          <h5 className="mb-0">Meeting Rooms Floor Plan</h5>
          <CButton
            color="light"
            variant="ghost"
            onClick={() => setShowEnlargedMap(false)}
            className="text-white ms-auto"
          >
            <CIcon icon={cilX} size="lg" />
          </CButton>
        </CModalHeader>
        <CModalBody className="p-0 bg-dark">
          <div className="enlarged-map-container">
            <div className="enlarged-map-wrapper">
              <img
                src="/meeting-rooms-map.jpg"
                alt="Meeting Rooms Floor Plan - Enlarged"
                className="enlarged-map-image"
              />
              <svg 
                className="enlarged-svg-overlay" 
                viewBox="0 0 944 730"
                preserveAspectRatio="xMidYMid meet"
              >
                {[
                  { id: 1, cx: 51.9, cy: 91.2 },
                  { id: 2, cx: 523.9, cy: 62.1 },
                  { id: 3, cx: 892.1, cy: 94.9 },
                  { id: 4, cx: 509.8, cy: 335.8 },
                  { id: 5, cx: 372.9, cy: 554.8 },
                  { id: 6, cx: 467.3, cy: 554.8 },
                  { id: 7, cx: 566.4, cy: 554.8 },
                  { id: 8, cx: 236.0, cy: 32.9 },
                  { id: 9, cx: 179.4, cy: 284.7 },
                  { id: 10, cx: 188.8, cy: 365.0 },
                  { id: 11, cx: 188.8, cy: 511.0 },
                  { id: 12, cx: 165.2, cy: 631.5 },
                  { id: 13, cx: 94.4, cy: 631.5 },
                  { id: 14, cx: 618.3, cy: 310.2 },
                  { id: 15, cx: 618.3, cy: 368.6 },
                  { id: 16, cx: 443.7, cy: 412.4 },
                  { id: 17, cx: 443.7, cy: 489.1 },
                ].map((pos) => {
                  const room = meetingRooms.find(r => r.id === pos.id)!
                  const isActive = selectedRoom?.id === pos.id
                  return (
                    <g key={pos.id}>
                      {isActive && (
                        <circle
                          cx={pos.cx}
                          cy={pos.cy}
                          r="40"
                          className="svg-pulse-enlarged"
                        />
                      )}
                      <circle
                        cx={pos.cx}
                        cy={pos.cy}
                        r="30"
                        className="svg-hotspot-enlarged"
                        onClick={() => setSelectedRoom(room)}
                      />
                      {isActive && (
                        <text
                          x={pos.cx}
                          y={pos.cy + 60}
                          className="svg-label"
                          textAnchor="middle"
                        >
                          #{room.id} {room.name}
                        </text>
                      )}
                    </g>
                  )
                })}
              </svg>
            </div>
          </div>
          {selectedRoom && (
            <div className="enlarged-room-info">
              <h5 className="text-white mb-1">{selectedRoom.name}</h5>
              <p className="text-white-50 mb-0">
                <CIcon icon={cilPeople} className="me-2" />
                Capacity: <strong>{selectedRoom.capacity} people</strong>
              </p>
            </div>
          )}
        </CModalBody>
      </CModal>

      {/* Footer */}
      <footer className="text-center mt-4 pb-3">
        <small className="text-muted">Meeting Rooms v2.0.0</small>
      </footer>
    </CContainer>
  )
}

export default App
