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

// Hardcoded pixel coordinates from original map
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

export default function LeafletMap({ selectedRoom, onRoomSelect, rooms, enlarged = false }: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const leafletMapRef = useRef<L.Map | null>(null)
  const markersRef = useRef<Map<number, L.CircleMarker>>(new Map())

  useEffect(() => {
    if (!mapRef.current || leafletMapRef.current) return

    // Image dimensions
    const imageWidth = 944
    const imageHeight = 730

    // Create map with CRS.Simple and image bounds
    const map = L.map(mapRef.current, {
      crs: L.CRS.Simple,
      minZoom: enlarged ? -1 : -0.5,
      maxZoom: enlarged ? 2 : 1,
      zoomControl: enlarged,
      attributionControl: false,
      zoomSnap: 0.1,
    })

    // Image bounds: For CRS.Simple, we need to invert Y-axis
    // Bottom-left corner is [0, 0], top-right is [height, width]
    const bounds: L.LatLngBoundsExpression = [[0, 0], [imageHeight, imageWidth]]
    
    // Add image overlay
    L.imageOverlay('/meeting-rooms-map.jpg', bounds).addTo(map)
    
    // Transform to flip Y-axis so image appears right-side up
    const pane = map.getPanes().overlayPane
    if (pane) {
      pane.style.transform = 'scaleY(-1)'
    }
    
    // Fit map to image bounds
    map.fitBounds(bounds)
    map.setMaxBounds(bounds.map(b => [b[0] - 50, b[1] - 50]) as L.LatLngBoundsExpression)

    // Add markers for each room using hardcoded coordinates
    rooms.forEach(room => {
      const coords = roomCoordinates[room.id]
      if (!coords) return
      
      const [x, y] = coords
      
      // Invert Y coordinate because we flipped the overlay pane
      const invertedY = imageHeight - y
      
      // Leaflet format: [lat, lng] = [y, x]
      const marker = L.circleMarker([invertedY, x], {
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
        direction: 'top',
        offset: [0, -10]
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
      const coords = roomCoordinates[selectedRoom.id]
      if (coords) {
        const [x, y] = coords
        const invertedY = 730 - y
        leafletMapRef.current.setView([invertedY, x], 0.5, { animate: true })
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
