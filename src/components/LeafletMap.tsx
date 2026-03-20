import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { type MeetingRoom } from '../data/meetingRooms'

interface LeafletMapProps {
  selectedRoom: MeetingRoom | null
  onRoomSelect: (room: MeetingRoom) => void
  rooms: MeetingRoom[]
  enlarged?: boolean
}

export default function LeafletMap({ selectedRoom, onRoomSelect, rooms, enlarged = false }: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const leafletMapRef = useRef<L.Map | null>(null)
  const markersRef = useRef<Map<number, L.CircleMarker>>(new Map())

  useEffect(() => {
    if (!mapRef.current || leafletMapRef.current) return

    // Image dimensions
    const imageWidth = 944
    const imageHeight = 730

    // Create map with image bounds
    const map = L.map(mapRef.current, {
      crs: L.CRS.Simple,
      minZoom: enlarged ? -1 : 0,
      maxZoom: enlarged ? 2 : 1,
      zoomControl: enlarged,
      attributionControl: false,
    })

    // Set image bounds
    const bounds: L.LatLngBoundsExpression = [[0, 0], [imageHeight, imageWidth]]
    
    // Add image overlay
    L.imageOverlay('/meeting-rooms-map.jpg', bounds).addTo(map)
    
    // Fit bounds
    map.fitBounds(bounds)
    
    // Set max bounds to prevent panning outside image
    map.setMaxBounds(bounds)

    // Add markers for each room
    rooms.forEach(room => {
      const marker = L.circleMarker([room.y, room.x], {
        radius: enlarged ? 20 : 15,
        fillColor: 'rgba(255, 193, 7, 0.3)',
        color: 'rgba(255, 193, 7, 0.8)',
        weight: 2,
        fillOpacity: 0.3,
      })
      .addTo(map)
      .on('click', () => onRoomSelect(room))

      // Add tooltip
      marker.bindTooltip(`#${room.id} ${room.name}`, {
        permanent: false,
        direction: 'top'
      })

      markersRef.current.set(room.id, marker)
    })

    leafletMapRef.current = map

    return () => {
      map.remove()
      leafletMapRef.current = null
      markersRef.current.clear()
    }
  }, [enlarged, rooms, onRoomSelect])

  // Update marker styles when selection changes
  useEffect(() => {
    if (!leafletMapRef.current) return

    markersRef.current.forEach((marker, roomId) => {
      const isSelected = selectedRoom?.id === roomId
      marker.setStyle({
        radius: enlarged ? (isSelected ? 25 : 20) : (isSelected ? 18 : 15),
        fillColor: isSelected ? 'rgba(255, 193, 7, 0.7)' : 'rgba(255, 193, 7, 0.3)',
        fillOpacity: isSelected ? 0.7 : 0.3,
        weight: isSelected ? 3 : 2,
      })
    })

    // Pan to selected room
    if (selectedRoom && !enlarged) {
      const marker = markersRef.current.get(selectedRoom.id)
      if (marker) {
        leafletMapRef.current.setView(marker.getLatLng(), 0.5, { animate: true })
      }
    }
  }, [selectedRoom, enlarged])

  return (
    <div 
      ref={mapRef} 
      style={{ 
        width: '100%', 
        height: enlarged ? '80vh' : '400px',
        cursor: 'pointer'
      }}
    />
  )
}
