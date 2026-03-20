import { useState, useEffect, useRef } from 'react'
import { CContainer, CCard, CCardBody, CButton, CModal, CModalBody, CModalHeader } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPeople, cilX } from '@coreui/icons'
import { meetingRooms, type MeetingRoom } from './data/meetingRooms'
import imageMapResize from 'image-map-resizer'
import './App.css'

function App() {
  const [selectedRoom, setSelectedRoom] = useState<MeetingRoom | null>(null)
  const [showEnlargedMap, setShowEnlargedMap] = useState(false)
  const [mainZoom, setMainZoom] = useState(1)
  const [enlargedScale, setEnlargedScale] = useState(1.5)
  const [enlargedPosition, setEnlargedPosition] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const [panStart, setPanStart] = useState({ x: 0, y: 0 })
  const mapRef = useRef<HTMLImageElement>(null)
  const enlargedMapRef = useRef<HTMLImageElement>(null)
  
  useEffect(() => {
    imageMapResize()
    window.addEventListener('resize', imageMapResize)
    return () => window.removeEventListener('resize', imageMapResize)
  }, [])
  
  useEffect(() => {
    if (showEnlargedMap) {
      setTimeout(() => imageMapResize(), 100)
      // Reset zoom and position when opening
      setEnlargedScale(1.5)
      setEnlargedPosition({ x: 0, y: 0 })
    }
  }, [showEnlargedMap])
  
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsPanning(true)
    setPanStart({ x: e.clientX - enlargedPosition.x, y: e.clientY - enlargedPosition.y })
  }
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return
    setEnlargedPosition({
      x: e.clientX - panStart.x,
      y: e.clientY - panStart.y
    })
  }
  
  const handleMouseUp = () => {
    setIsPanning(false)
  }
  
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsPanning(true)
      setPanStart({ 
        x: e.touches[0].clientX - enlargedPosition.x, 
        y: e.touches[0].clientY - enlargedPosition.y 
      })
    }
  }
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPanning || e.touches.length !== 1) return
    setEnlargedPosition({
      x: e.touches[0].clientX - panStart.x,
      y: e.touches[0].clientY - panStart.y
    })
  }
  
  const handleTouchEnd = () => {
    setIsPanning(false)
  }

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

  const handleMapClick = (room: MeetingRoom) => {
    // Toggle selection - if clicking same room, deselect
    if (selectedRoom?.id === room.id) {
      setSelectedRoom(null)
    } else {
      setSelectedRoom(room)
    }
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
          <div className="d-flex align-items-center justify-content-between mb-2">
            <div className="d-flex align-items-center">
              <label className="me-2 mb-0 small">Zoom:</label>
              <input 
                type="range" 
                min="1" 
                max="3" 
                step="0.1" 
                value={selectedRoom ? 2.5 : mainZoom}
                onChange={(e) => {
                  if (!selectedRoom) {
                    setMainZoom(parseFloat(e.target.value))
                  }
                }}
                className="zoom-slider-small"
                disabled={!!selectedRoom}
              />
              <span className="ms-2 small">{selectedRoom ? '2.5x' : mainZoom.toFixed(1) + 'x'}</span>
            </div>
            <small className="text-muted" style={{ cursor: 'zoom-in' }} onClick={() => setShowEnlargedMap(true)}>
              Click to enlarge
            </small>
          </div>
          <div 
            className="floor-plan-container"
            onClick={() => setShowEnlargedMap(true)}
            style={{ cursor: 'zoom-in' }}
          >
            <div 
              className="floor-plan-wrapper"
              style={selectedRoom ? {
                transform: 'scale(2.5)',
                transformOrigin: `${meetingRooms.find(r => r.id === selectedRoom.id)?.x}% ${meetingRooms.find(r => r.id === selectedRoom.id)?.y}%`,
                transition: 'transform 0.5s ease-in-out'
              } : {
                transform: `scale(${mainZoom})`,
                transformOrigin: 'center center',
                transition: 'transform 0.3s ease-in-out'
              }}
            >
              <img
                ref={mapRef}
                src="/meeting-rooms-map-labeled.jpg"
                alt="Meeting Rooms Floor Plan"
                className="floor-plan-image"
                useMap="#roommap"
              />
              <map name="roommap">
                <area shape="circle" coords="52,91,35" onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleMapClick(meetingRooms[0]) }} alt="The Hub" />
                <area shape="circle" coords="524,62,35" onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleMapClick(meetingRooms[1]) }} alt="The Café" />
                <area shape="circle" coords="892,95,35" onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleMapClick(meetingRooms[2]) }} alt="El Questro" />
                <area shape="circle" coords="510,336,35" onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleMapClick(meetingRooms[3]) }} alt="Rottnest Island" />
                <area shape="circle" coords="373,555,35" onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleMapClick(meetingRooms[4]) }} alt="Streaky Bay" />
                <area shape="circle" coords="467,555,35" onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleMapClick(meetingRooms[5]) }} alt="Cradle Mountain" />
                <area shape="circle" coords="566,555,35" onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleMapClick(meetingRooms[6]) }} alt="Broome" />
                <area shape="circle" coords="236,33,35" onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleMapClick(meetingRooms[7]) }} alt="Undara" />
                <area shape="circle" coords="179,285,35" onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleMapClick(meetingRooms[8]) }} alt="Pambula Beach" />
                <area shape="circle" coords="189,365,35" onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleMapClick(meetingRooms[9]) }} alt="Lake Hume" />
                <area shape="circle" coords="189,511,35" onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleMapClick(meetingRooms[10]) }} alt="Kings Canyon" />
                <area shape="circle" coords="165,632,35" onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleMapClick(meetingRooms[11]) }} alt="Jindabyne" />
                <area shape="circle" coords="94,632,35" onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleMapClick(meetingRooms[12]) }} alt="Goolwa" />
                <area shape="circle" coords="618,310,35" onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleMapClick(meetingRooms[13]) }} alt="Mount Isa" />
                <area shape="circle" coords="618,369,35" onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleMapClick(meetingRooms[14]) }} alt="Byron Bay" />
                <area shape="circle" coords="444,412,35" onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleMapClick(meetingRooms[15]) }} alt="Airlie Beach" />
                <area shape="circle" coords="444,489,35" onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleMapClick(meetingRooms[16]) }} alt="Bright" />
              </map>

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
          <div className="enlarged-controls">
            <label className="text-white me-2">Zoom:</label>
            <input 
              type="range" 
              min="1" 
              max="3" 
              step="0.1" 
              value={enlargedScale}
              onChange={(e) => setEnlargedScale(parseFloat(e.target.value))}
              className="zoom-slider"
            />
            <span className="text-white ms-2">{enlargedScale.toFixed(1)}x</span>
          </div>
          <div 
            className="enlarged-map-container"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{ cursor: isPanning ? 'grabbing' : 'grab' }}
          >
            <div 
              className="enlarged-map-wrapper"
              style={{
                transform: `scale(${enlargedScale}) translate(${enlargedPosition.x / enlargedScale}px, ${enlargedPosition.y / enlargedScale}px)`,
                transition: isPanning ? 'none' : 'transform 0.1s ease-out'
              }}
            >
              <img
                ref={enlargedMapRef}
                src="/meeting-rooms-map-labeled.jpg"
                alt="Meeting Rooms Floor Plan - Enlarged"
                className="enlarged-map-image"
                useMap="#roommap-enlarged"
                draggable={false}
              />
              <map name="roommap-enlarged">
                <area shape="circle" coords="52,91,45" onClick={(e) => { e.preventDefault(); setSelectedRoom(meetingRooms[0]) }} alt="The Hub" />
                <area shape="circle" coords="524,62,45" onClick={(e) => { e.preventDefault(); setSelectedRoom(meetingRooms[1]) }} alt="The Café" />
                <area shape="circle" coords="892,95,45" onClick={(e) => { e.preventDefault(); setSelectedRoom(meetingRooms[2]) }} alt="El Questro" />
                <area shape="circle" coords="510,336,45" onClick={(e) => { e.preventDefault(); setSelectedRoom(meetingRooms[3]) }} alt="Rottnest Island" />
                <area shape="circle" coords="373,555,45" onClick={(e) => { e.preventDefault(); setSelectedRoom(meetingRooms[4]) }} alt="Streaky Bay" />
                <area shape="circle" coords="467,555,45" onClick={(e) => { e.preventDefault(); setSelectedRoom(meetingRooms[5]) }} alt="Cradle Mountain" />
                <area shape="circle" coords="566,555,45" onClick={(e) => { e.preventDefault(); setSelectedRoom(meetingRooms[6]) }} alt="Broome" />
                <area shape="circle" coords="236,33,45" onClick={(e) => { e.preventDefault(); setSelectedRoom(meetingRooms[7]) }} alt="Undara" />
                <area shape="circle" coords="179,285,45" onClick={(e) => { e.preventDefault(); setSelectedRoom(meetingRooms[8]) }} alt="Pambula Beach" />
                <area shape="circle" coords="189,365,45" onClick={(e) => { e.preventDefault(); setSelectedRoom(meetingRooms[9]) }} alt="Lake Hume" />
                <area shape="circle" coords="189,511,45" onClick={(e) => { e.preventDefault(); setSelectedRoom(meetingRooms[10]) }} alt="Kings Canyon" />
                <area shape="circle" coords="165,632,45" onClick={(e) => { e.preventDefault(); setSelectedRoom(meetingRooms[11]) }} alt="Jindabyne" />
                <area shape="circle" coords="94,632,45" onClick={(e) => { e.preventDefault(); setSelectedRoom(meetingRooms[12]) }} alt="Goolwa" />
                <area shape="circle" coords="618,310,45" onClick={(e) => { e.preventDefault(); setSelectedRoom(meetingRooms[13]) }} alt="Mount Isa" />
                <area shape="circle" coords="618,369,45" onClick={(e) => { e.preventDefault(); setSelectedRoom(meetingRooms[14]) }} alt="Byron Bay" />
                <area shape="circle" coords="444,412,45" onClick={(e) => { e.preventDefault(); setSelectedRoom(meetingRooms[15]) }} alt="Airlie Beach" />
                <area shape="circle" coords="444,489,45" onClick={(e) => { e.preventDefault(); setSelectedRoom(meetingRooms[16]) }} alt="Bright" />
              </map>

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
        <small className="text-muted">Meeting Rooms v3.3.2</small>
      </footer>
    </CContainer>
  )
}

export default App
