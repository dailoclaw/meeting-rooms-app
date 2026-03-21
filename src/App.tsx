import { useState } from 'react'
import { CContainer, CCard, CCardBody, CModal, CModalBody, CModalHeader } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPeople } from '@coreui/icons'
import { meetingRooms, type MeetingRoom } from './data/meetingRooms'
import SvgFloorPlan from './components/SvgFloorPlan'
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

      {/* Floor Plan */}
      <CCard id="floor-plan">
        <CCardBody className="p-0">
          <div onClick={() => setShowEnlargedMap(true)} style={{ cursor: 'zoom-in' }}>
            <SvgFloorPlan 
              selectedRoom={selectedRoom}
              onRoomSelect={handleRoomClick}
              rooms={meetingRooms}
            />
          </div>
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
        <CModalHeader className="bg-dark text-white border-0">
          <h5 className="mb-0">Meeting Rooms Floor Plan</h5>
          <button 
            type="button" 
            className="btn-close btn-close-white" 
            onClick={() => setShowEnlargedMap(false)}
            aria-label="Close"
          />
        </CModalHeader>
        <CModalBody className="p-3" style={{ background: '#f8f9fa', maxHeight: '90vh', overflow: 'auto' }}>
          <div style={{ transform: 'scale(1.5)', transformOrigin: 'top center', padding: '20px' }}>
            <SvgFloorPlan 
              selectedRoom={selectedRoom}
              onRoomSelect={(room) => {
                setSelectedRoom(room)
              }}
              rooms={meetingRooms}
            />
          </div>
        </CModalBody>
      </CModal>

      {/* Footer */}
      <div className="text-center mt-4">
        <small className="text-muted">Meeting Rooms v6.2.1</small>
      </div>
    </CContainer>
  )
}

export default App
