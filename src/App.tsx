import { useState } from 'react'
import { CContainer, CCard, CCardBody, CModal, CModalBody, CModalHeader } from '@coreui/react'
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
        <CCardBody className="p-0">
          <div 
            onClick={() => setShowEnlargedMap(true)} 
            style={{ 
              cursor: 'zoom-in', 
              overflow: 'hidden', 
              position: 'relative' 
            }}
          >
            <SvgFloorPlan 
              selectedRoom={selectedRoom}
              onRoomSelect={handleRoomClick}
              rooms={meetingRooms}
            />
          </div>
        </CCardBody>
      </CCard>

      {/* Enlarged Map Modal */}
      <CModal
        visible={showEnlargedMap}
        onClose={() => {
          setShowEnlargedMap(false)
          setSelectedRoom(null) // Reset selection when closing
        }}
        size="xl"
        fullscreen
        className="enlarged-map-modal"
      >
        <CModalHeader className="bg-dark text-white border-0 d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Meeting Rooms Floor Plan</h5>
          <button 
            type="button" 
            className="btn-close btn-close-white" 
            onClick={() => {
              setShowEnlargedMap(false)
              setSelectedRoom(null)
            }}
            aria-label="Close"
            style={{ margin: 0 }}
          />
        </CModalHeader>
        <CModalBody className="p-3" style={{ background: '#f8f9fa', maxHeight: '90vh', overflow: 'auto' }}>
          <SvgFloorPlan 
            selectedRoom={selectedRoom}
            onRoomSelect={(room) => {
              setSelectedRoom(room)
            }}
            rooms={meetingRooms}
            enlarged={true}
          />
        </CModalBody>
      </CModal>

      {/* Footer */}
      <div className="text-center mt-4">
        <small className="text-muted">Meeting Rooms v6.3.4</small>
      </div>
    </CContainer>
  )
}

export default App
