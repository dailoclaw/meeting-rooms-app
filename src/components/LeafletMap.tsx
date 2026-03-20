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

// Hardcoded pixel coordinates from original map (x, y format)
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
    const w = 944
    const h = 730

    // Create map with CRS.Simple
    const map = L.map(mapRef.current, {
      crs: L.CRS.Simple,
      minZoom: enlarged ? -1 : -0.5,
      maxZoom: enlarged ? 2 : 1,
      zoomControl: enlarged,
      attributionControl: false,
      zoomSnap: 0.1,
    })

    // For CRS.Simple with images, bounds should be:
    // [[y_bottom, x_left], [y_top, x_right]]
    // In screen coordinates: y goes DOWN, so top=0, bottom=height
    // But Leaflet expects geographic convention: bottom < top
    // So we use: [[0, 0], [height, width]] where 0,0 is top-left
    const bounds: L.LatLngBoundsExpression = [[0, 0], [h, w]]
    
    // Add image overlay
    L.imageOverlay('/meeting-rooms-map.jpg', bounds).addTo(map)
    
    // Fit map to bounds
    map.fitBounds(bounds)
    map.setMaxBounds(bounds)

    // Add markers - convert pixel coordinates to Leaflet coordinates
    rooms.forEach(room => {
      const coords = roomCoordinates[room.id]
      if (!coords) return
      
      const [px_x, px_y] = coords
      
      // In CRS.Simple with our bounds [[0,0], [h,w]]:
      // Leaflet coordinate = pixel coordinate directly
      // Format is [lat, lng] which for images is [y, x]
      const marker = L.circleMarker([px_y, px_x], {
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
        const [px_x, px_y] = coords
        leafletMapRef.current.setView([px_y, px_x], 0.5, { animate: true })
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
