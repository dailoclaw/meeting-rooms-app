import { useState } from 'react'
import { CContainer, CCard, CCardBody, CInputGroup, CFormInput, CButton, CModal, CModalBody, CModalHeader } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPeople, cilSearch, cilZoomIn, cilX } from '@coreui/icons'
import { meetingRooms, type MeetingRoom } from './data/meetingRooms'
import './App.css'

function App() {
  const [selectedRoom, setSelectedRoom] = useState<MeetingRoom | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showEnlargedMap, setShowEnlargedMap] = useState(false)

  const filteredRooms = meetingRooms.filter(room =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
      <div className="d-flex align-items-center mb-3">
        <h2 className="text-white mb-0 flex-grow-1 text-center">Meeting Rooms</h2>
      </div>

      {/* Search */}
      <CInputGroup className="mb-3">
        <CInputGroup className="mb-0">
          <span className="input-group-text">
            <CIcon icon={cilSearch} />
          </span>
          <CFormInput
            placeholder="Search rooms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CInputGroup>
      </CInputGroup>

      {/* Room List */}
      <CCard className="mb-3">
        <CCardBody className="p-2">
          <div className="row g-2">
            {filteredRooms.map(room => (
              <div key={room.id} className="col-6">
                <div
                  onClick={() => handleRoomClick(room)}
                  style={{ cursor: 'pointer' }}
                  className={`p-2 rounded ${selectedRoom?.id === room.id ? 'bg-primary text-white' : 'bg-light'}`}
                >
                  <strong>#{room.id} {room.name}</strong>
                </div>
              </div>
            ))}
          </div>
        </CCardBody>
      </CCard>

      {/* Floor Plan */}
      <CCard id="floor-plan">
        <CCardBody className="p-2">
          <div className="d-flex justify-content-end mb-2">
            <CButton
              color="primary"
              size="sm"
              onClick={() => setShowEnlargedMap(true)}
            >
              <CIcon icon={cilZoomIn} className="me-1" />
              Enlarge Map
            </CButton>
          </div>
          <div 
            className="floor-plan-container"
            onClick={() => setShowEnlargedMap(true)}
            style={{ cursor: 'pointer' }}
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
        <CModalHeader className="bg-dark text-white border-0">
          <h5 className="mb-0">Meeting Rooms Floor Plan</h5>
          <CButton
            color="light"
            variant="ghost"
            onClick={() => setShowEnlargedMap(false)}
            className="text-white"
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
    </CContainer>
  )
}

export default App
