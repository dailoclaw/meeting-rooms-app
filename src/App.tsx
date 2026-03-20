import { useState } from 'react'
import { CContainer, CCard, CCardBody, CModal, CModalBody, CModalHeader } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPeople } from '@coreui/icons'
import { meetingRooms, type MeetingRoom } from './data/meetingRooms'
import LeafletMap from './components/LeafletMap'
import './App.css'

function App() {
  const [selectedRoom, setSelectedRoom] = useState<MeetingRoom | null>(null)
  const [showEnlargedMap, setShowEnlargedMap] = useState(false)

  const handleRoomClick = (room: MeetingRoom) => {
    // Toggle selection - if clicking same room, deselect
    if (selectedRoom?.id === room.id) {
      setSelectedRoom(null)
    } else {
      setSelectedRoom(room)
      // Scroll to map
      document.getElementById('floor-plan')?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <CContainer className="py-4">
      <h2 className="text-center mb-4" style={{ color: '#333' }}>Meeting Rooms</h2>

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
          <div className="d-flex align-items-center justify-content-end mb-2">
            <small className="text-muted" style={{ cursor: 'zoom-in' }} onClick={() => setShowEnlargedMap(true)}>
              Click map to enlarge
            </small>
          </div>
          <LeafletMap 
            selectedRoom={selectedRoom}
            onRoomSelect={handleRoomClick}
            rooms={meetingRooms}
          />
        </CCardBody>
      </CCard>

      {/* Room Info */}
      {selectedRoom && (
        <CCard className="mt-3">
          <CCardBody>
            <h4>#{selectedRoom.id} {selectedRoom.name}</h4>
            <p className="mb-1">
              <CIcon icon={cilPeople} className="me-2" />
              Capacity: {selectedRoom.capacity}
            </p>
          </CCardBody>
        </CCard>
      )}

      {/* Enlarged Map Modal */}
      <CModal
        visible={showEnlargedMap}
        onClose={() => setShowEnlargedMap(false)}
        size="xl"
        fullscreen
        className="enlarged-map-modal"
      >
        <CModalHeader closeButton className="bg-dark text-white border-0">
          <h5 className="mb-0">Meeting Rooms Floor Plan</h5>
        </CModalHeader>
        <CModalBody className="p-0 bg-dark">
          <LeafletMap 
            selectedRoom={selectedRoom}
            onRoomSelect={(room) => {
              setSelectedRoom(room)
            }}
            rooms={meetingRooms}
            enlarged
          />
        </CModalBody>
      </CModal>

      {/* Footer */}
      <div className="text-center mt-4">
        <small className="text-muted">Meeting Rooms v4.0.3</small>
      </div>
    </CContainer>
  )
}

export default App
