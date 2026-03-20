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
              {meetingRooms.map(room => (
                <div
                  key={room.id}
                  className={`room-marker ${selectedRoom?.id === room.id ? 'active' : ''}`}
                  style={{
                    left: `${room.x}%`,
                    top: `${room.y}%`,
                  }}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleMapClick(room)
                  }}
                >
                  <div className="room-marker-pulse" />
                  <div className="room-marker-circle"></div>
                </div>
              ))}
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
            <img
              src="/meeting-rooms-map.jpg"
              alt="Meeting Rooms Floor Plan - Enlarged"
              className="enlarged-map-image"
            />
            {meetingRooms.map(room => (
              <div
                key={room.id}
                className={`room-marker enlarged ${selectedRoom?.id === room.id ? 'active' : ''}`}
                style={{
                  left: `${room.x}%`,
                  top: `${room.y}%`,
                }}
                onClick={() => {
                  setSelectedRoom(room)
                }}
              >
                <div className="room-marker-pulse" />
                <div className="room-marker-circle"></div>
                <div className="room-marker-label">#{room.id} {room.name}</div>
              </div>
            ))}
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
        <small className="text-muted">Meeting Rooms v1.2.1</small>
      </footer>
    </CContainer>
  )
}

export default App
